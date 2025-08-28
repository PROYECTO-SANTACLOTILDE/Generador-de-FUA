// utils/verifySignedByOurServer.js
// Verify that a PDF is (a) signed, (b) intact, and (c) signed by *our* server
// by comparing the signer's certificate fingerprint against the server's .p12 fingerprint.
// Includes a CMS fallback that parses /Contents to locate the actual signer leaf.

const crypto = require("crypto");
const verifyPDF = require("@ninja-labs/verify-pdf");
const { getServerCertFingerprintSHA256 } = require("../utils/serverCert");
const { extractSignerFromPdf } = require("../utils/extractSignerFromPdf");

/** PEM -> SHA-256 fingerprint (uppercase hex). Returns null if invalid. */
function pemToFpSHA256(pem) {
  if (!pem || typeof pem !== "string") return null;
  try {
    const der = Buffer.from(
      pem.replace(/-----(BEGIN|END) CERTIFICATE-----/g, "").replace(/\s+/g, ""),
      "base64"
    );
    return crypto.createHash("sha256").update(der).digest("hex").toUpperCase();
  } catch {
    return null;
  }
}

/**
 * Verify a signed PDF and check if it was signed by our server.
 * @param {Buffer} pdfBuffer
 * @returns {Promise<{
 *   hasSignature: boolean,
 *   integrity: boolean,
 *   signedByServer: boolean,
 *   serverFingerprint?: string,
 *   signerFingerprint?: string,
 *   signerCN?: string
 * }>}
 */
async function verifySignedByOurServer(pdfBuffer) {
  try {
    // 1) Ask the library to parse signatures and basic integrity
    const report = await verifyPDF(pdfBuffer);
    const hasSignature = Array.isArray(report?.signatures) && report.signatures.length > 0;
    const integrity = !!(report?.integrity ?? report?.verified);

    if (!hasSignature) {
      return { hasSignature: false, integrity: false, signedByServer: false };
    }
    if (!integrity) {
      return { hasSignature: true, integrity: false, signedByServer: false };
    }

    // 2) Collect PEM candidates from the report
    const pemCandidates = [];

    // 2a) Primary signature object
    const sig = report?.signatures ? report.signatures[0] : null;
    const pemFromSig =
      (sig && (sig.pemCertificate || sig.certificate || sig.signerPEM || sig.certPEM)) || null;
    if (pemFromSig) pemCandidates.push(pemFromSig);

    // 2b) meta.certs chain (if provided)
    if (Array.isArray(report?.meta?.certs)) {
      for (const c of report.meta.certs) {
        const pem =
          (c && (c.pemCertificate || c.certificate || c.signerPEM || c.certPEM)) || null;
        if (pem) pemCandidates.push(pem);
      }
    }

    // 3) PEM → fingerprints
    const signerFingerprints = [];
    for (const pem of pemCandidates) {
      const fp = pemToFpSHA256(pem);
      if (fp) signerFingerprints.push(fp);
    }

    // 4) Compare with our server cert
    const serverFp = getServerCertFingerprintSHA256();
    let signedByServer = signerFingerprints.includes(serverFp);

    // 5) CMS fallback if still no match
    let signerFpForReturn = signerFingerprints[0] || null;
    let signerCN = undefined;

    if (!signedByServer) {
      const cms = extractSignerFromPdf(pdfBuffer);
      if (cms && cms.fp) {
        signerCN = cms.cn;
        // Force returning what fallback found, even if not matching
        signerFpForReturn = cms.fp;
        if (cms.fp === serverFp) {
          signedByServer = true;
        }
      }
    }

    return {
      hasSignature: true,
      integrity: true,
      signedByServer,
      serverFingerprint: serverFp,
      signerFingerprint: signerFpForReturn || undefined,
      signerCN,
    };
  } catch (err) {
    console.error("Error in FUAFormat Service - verifySignedByOurServer:", err);
    err.message = "Error in FUAFormat Service - verifySignedByOurServer: " + err.message;
    throw err;
  }
}

module.exports = {
  verifySignedByOurServer,
};