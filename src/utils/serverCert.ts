// file used to read and extract certificate information for Pdf signature verification

import fs from "fs";
import path from "path";
import crypto from "crypto";
// Si ton TS n'accepte pas l'import default, utilise: import * as forge from "node-forge";
import forge from "node-forge";

let cachedFpSha256: string | null = null;

export function getServerCertFingerprintSHA256(): string { 
  if (cachedFpSha256) return cachedFpSha256;

  // Localisation of the .p12 and passphrase
  const p12Path = path.resolve(process.cwd(), "./src/certificate/certificate.p12");
  const passphrase = process.env.P12_PASSPHRASE ?? "password";

  // Reading of the .p12 and decode in ASN.1 with forge
  const p12Der = fs.readFileSync(p12Path);
  const p12Asn1 = forge.asn1.fromDer(p12Der.toString("binary"));

  // Opening the PKCS#12 with the passphrase
  const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, false, passphrase);

  // recover certBadgs
  const bags = p12.getBags({ bagType: forge.pki.oids.certBag });
  // Node-forge typings vary depending on versions -> we cast to any[] to avoid false positives TS
  const certBags = (bags[forge.pki.oids.certBag] || []) as any[];

  if (!certBags.length) {
    throw new Error("No certificate found in P12.");
  }

  // take the leaf certificate (1st position)
  const firstBag = certBags[0];
  const cert = firstBag && firstBag.cert ? (firstBag.cert as forge.pki.Certificate) : null;
  if (!cert) {
    throw new Error("No valid certificate inside the cert bag.");
  }

  // Convert in PEM ans DER
  const pem = forge.pki.certificateToPem(cert);
  const der = Buffer.from(
    pem.replace(/-----(BEGIN|END) CERTIFICATE-----/g, "").replace(/\s+/g, ""),
    "base64"
  );

  // Calculation of the fingerprint
  const fp = crypto.createHash("sha256").update(der).digest("hex").toUpperCase();
  cachedFpSha256 = fp;
  return fp;
}

