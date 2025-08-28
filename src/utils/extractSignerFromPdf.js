// utils/extractSignerFromPdf.js
// Parse the CMS (/Contents) of a signed PDF to retrieve the SIGNER's certificate
// and return its SHA-256 fingerprint (and CN for debugging).
// Supports three /Contents encodings: <HEX...>, (literal string), and stream/endstream.
// Also trims padding and slices the DER to the exact ASN.1 length to avoid trailing zeros.

const forge = require("node-forge");
const crypto = require("crypto");

/** Convert a JS latin1 string to a Buffer of raw bytes (0..255). */
function latin1ToBuffer(str) {
  const out = Buffer.allocUnsafe(str.length);
  for (let i = 0; i < str.length; i++) out[i] = str.charCodeAt(i) & 0xff;
  return out;
}

/** Heuristic: trim trailing 0x00 bytes (common padding in /Contents). */
function trimTrailingZeros(buf) {
  let end = buf.length;
  while (end > 0 && buf[end - 1] === 0x00) end--;
  return end === buf.length ? buf : buf.subarray(0, end);
}

/**
 * Slice the given buffer to the exact ASN.1 DER top-level SEQUENCE length:
 *   0x30 [len or 0x81/0x82 + len] ...
 * Returns a sliced view if length is consistent; otherwise returns original.
 */
function sliceExactDer(buf) {
  if (buf.length < 4) return buf;
  // Find the first 0x30 (SEQUENCE) — sometimes padding precedes
  let start = 0;
  while (start < buf.length && buf[start] !== 0x30) start++;
  if (start >= buf.length - 2) return buf;

  const tag = buf[start]; // 0x30
  const lenByte = buf[start + 1];
  let headerLen = 2;
  let contentLen = 0;

  if (lenByte < 0x80) {
    contentLen = lenByte;
  } else if (lenByte === 0x81) {
    if (start + 2 >= buf.length) return buf;
    contentLen = buf[start + 2];
    headerLen = 3;
  } else if (lenByte === 0x82) {
    if (start + 3 >= buf.length) return buf;
    contentLen = (buf[start + 2] << 8) | buf[start + 3];
    headerLen = 4;
  } else {
    // Long-form > 0x82 is unlikely here; bail out.
    return buf;
  }

  const totalLen = headerLen + contentLen;
  if (start + totalLen <= buf.length) {
    return buf.subarray(start, start + totalLen);
  }
  return buf; // length inconsistent; fallback to original
}

/** Try to parse a PKCS#7 DER asn1 and locate the signer leaf via (issuer + serial). */
function tryPkcs7(derBuf) {
  try {
    // common PDF quirk: padding zeros → trim then slice exact ASN.1 length
    const trimmed = trimTrailingZeros(derBuf);
    const exact = sliceExactDer(trimmed);

    const asn1 = forge.asn1.fromDer(exact.toString("binary"));
    const p7 = forge.pkcs7.messageFromAsn1(asn1);

    const si = (p7.signerInfos && p7.signerInfos[0]) ? p7.signerInfos[0] : null;
    const certs = Array.isArray(p7.certificates) ? p7.certificates : [];
    if (!si || !certs.length) return null;

    const signerIssuer = si.issuer;
    const signerSerial = si.serialNumber;

    let leaf = null;
    for (const c of certs) {
      try {
        const sameSerial = c.serialNumber && signerSerial && c.serialNumber === signerSerial;
        const sameIssuer =
          c.issuer && signerIssuer && JSON.stringify(c.issuer) === JSON.stringify(signerIssuer);
        if (sameSerial && sameIssuer) { leaf = c; break; }
      } catch {}
    }
    if (!leaf) leaf = certs[0];
    if (!leaf) return null;

    const pem = forge.pki.certificateToPem(leaf);
    const der = Buffer.from(
      pem.replace(/-----(BEGIN|END) CERTIFICATE-----/g, "").replace(/\s+/g, ""),
      "base64"
    );
    const fp = crypto.createHash("sha256").update(der).digest("hex").toUpperCase();

    let cn;
    try { cn = leaf.subject.getField("CN")?.value; } catch {}
    return { fp, cn };
  } catch {
    return null;
  }
}

/**
 * Extract signer fingerprint (and CN) from a PDF buffer.
 * @param {Buffer} pdfBuffer
 * @returns {{ fp: string, cn?: string } | null}
 */
function extractSignerFromPdf(pdfBuffer) {
  const latin = pdfBuffer.toString("latin1");

  // (A) HEX-form: /Contents <...hex...>
  const hexRE = /\/Contents\s*<([0-9A-Fa-f\s\r\n]+)>/g;
  const hexCandidates = [];
  let m;
  while ((m = hexRE.exec(latin)) !== null) {
    const hex = (m[1] || "").replace(/\s+/g, "");
    if (hex.length >= 2) {
      try { hexCandidates.push(Buffer.from(hex, "hex")); } catch {}
    }
  }

  // (B) Literal string: /Contents ( ...binary... )
  const litRE = /\/Contents\s*\(([\s\S]*?)\)/g;
  const literalCandidates = [];
  while ((m = litRE.exec(latin)) !== null) {
    const body = m[1] || "";
    const unescaped = body.replace(/\\\)/g, ")").replace(/\\\\/g, "\\");
    literalCandidates.push(latin1ToBuffer(unescaped));
  }

  // (C) Stream: /Contents << ... >> stream ... endstream
  const streamRE = /\/Contents[\s\S]{0,300}stream\r?\n([\s\S]*?)\r?\nendstream/g;
  const streamCandidates = [];
  while ((m = streamRE.exec(latin)) !== null) {
    const body = m[1] || "";
    streamCandidates.push(latin1ToBuffer(body));
  }

  // Merge and try largest first (real CMS is typically the largest)
  const all = [...hexCandidates, ...literalCandidates, ...streamCandidates]
    .filter(b => Buffer.isBuffer(b) && b.length > 0)
    .sort((a, b) => b.length - a.length);

  // Uncomment for debug:
  // console.log("[cms] candidates:", { hex: hexCandidates.length, lit: literalCandidates.length, stream: streamCandidates.length, total: all.length, topLen: all[0]?.length });

  for (const derBuf of all) {
    const out = tryPkcs7(derBuf);
    if (out) return out;
  }
  return null;
}

module.exports = { extractSignerFromPdf };