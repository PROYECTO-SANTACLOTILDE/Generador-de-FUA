// utils/serverCert.ts
// Read the server-side P12 and return the leaf certificate SHA-256 fingerprint (uppercase hex).
import fs from "fs";
import path from "path";
import crypto from "crypto";
import forge from "node-forge";

let cachedFpSha256: string | null = null;

/**
 * Returns the SHA-256 fingerprint (uppercase hex) of the leaf certificate stored in the server .p12.
 * Uses an in-process cache; restart the process or change P12 path/passphrase to refresh.
 */
export function getServerCertFingerprintSHA256(): string {
  if (cachedFpSha256) return cachedFpSha256;

  const p12Path = path.resolve(process.cwd(), "./src/certificate/certificate.p12");
  const passphrase = process.env.P12_PASSPHRASE ?? "password";

  // 1) read P12 DER
  const p12Der = fs.readFileSync(p12Path);

  // 2) ASN.1 decode
  const p12Asn1 = forge.asn1.fromDer(p12Der.toString("binary"));

  // 3) PKCS#12 w/ passphrase
  const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, false, passphrase);

  // 4) pull cert bags
  const bags = p12.getBags({ bagType: forge.pki.oids.certBag });
  const certBags = (bags[forge.pki.oids.certBag] || []) as any[];

  if (!certBags.length) {
    throw new Error("No certificate found in server P12.");
  }

  // 5) leaf (often first)
  const certObj = certBags[0];
  const cert = certObj?.cert as forge.pki.Certificate | undefined;
  if (!cert) {
    throw new Error("Invalid certificate structure in P12.");
  }

  // 6) PEM → DER → SHA-256
  const pem = forge.pki.certificateToPem(cert);
  const der = Buffer.from(
    pem.replace(/-----(BEGIN|END) CERTIFICATE-----/g, "").replace(/\s+/g, ""),
    "base64"
  );
  const fp = crypto.createHash("sha256").update(der).digest("hex").toUpperCase();

  cachedFpSha256 = fp;
  return fp;
}

export default { getServerCertFingerprintSHA256 };