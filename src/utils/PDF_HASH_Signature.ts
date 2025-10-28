
// pdfSignedHash.ts
import { PDFDocument, PDFName, PDFString, PDFDict } from 'pdf-lib';
import crypto from 'crypto';
import { readFileSync } from 'fs'
import path from 'path';

/**
 * Compute HMAC-SHA256 hex string of given bytes using secret key.
 */
function computeHmacHex(bytes: Uint8Array | Buffer, secretKey: string): string {
  return crypto.createHmac('sha256', secretKey).update(Buffer.from(bytes)).digest('hex');
}

/**
 * Ensure an /Info dictionary exists in the trailer. Returns the PDFDict for Info.
 * If none exists, creates an empty dict and attaches it.
 */
function ensureInfoDict(pdfDoc: PDFDocument): PDFDict {
  const context = (pdfDoc as any).context;
  
  const trailerDict = context.lookup(context.trailer) ?? context.trailerDict ?? context.trailer;
  if (!trailerDict) {
    throw new Error('Impossible de récupérer le trailer dictionary du PDF.');
  }

  let infoRef = trailerDict.get(PDFName.of('Info'));
  let infoDict: PDFDict;

  if (!infoRef) {
    infoDict = context.obj({});
    trailerDict.set(PDFName.of('Info'), infoDict);
  } else {
    infoDict = context.lookup(infoRef) as PDFDict;
  }

  return infoDict;
}

/**
 * Sign a PDF Buffer by computing HMAC over PDF bytes *without* the SignedHash entry,
 * then writing the hex HMAC into the Info dictionary under /SignedHash.
 *
 * @param pdfBuffer Input PDF bytes
 * @param secretKey Secret key used for HMAC (shared secret)
 * @returns Buffer of signed PDF
 */
export async function signPdfBuffer(pdfBuffer: any, secretKey: string): Promise<Buffer> {
  const pdfDoc = await PDFDocument.load(pdfBuffer);

  // Ensure Info dict exists
  const infoDict = ensureInfoDict(pdfDoc);

  // Remove SignedHash if present so we compute HMAC on PDF without it
  try {
    infoDict.delete(PDFName.of('SignedHash'));
  } catch (e) {
    // ignore if deletion not supported or not present
  }

  // Save intermediate bytes (PDF without SignedHash)
  const tmpBytes = await pdfDoc.save();

  // Compute HMAC
  const hmacHex = computeHmacHex(tmpBytes, secretKey);

  // Set SignedHash in Info dictionary as a PDFString
  infoDict.set(PDFName.of('SignedHash'), PDFString.of(hmacHex));

  // Save final PDF bytes (with SignedHash)
  const finalBytes = await pdfDoc.save();
  return Buffer.from(finalBytes);
}

/**
 * Verify a PDF signed with signPdfBuffer.
 *
 * It reads /SignedHash from Info, removes the field, saves a temporary PDF,
 * computes HMAC over that PDF and compares to the stored value.
 *
 * @param pdfBuffer The PDF bytes to verify
 * @param secretKey The same secret used to sign (HMAC key)
 * @returns { valid: boolean, expected?: string, found?: string, reason?: string }
 */
export async function verifyPdfBuffer(
  pdfBuffer: Buffer,
  secretKey: string
): Promise<{ valid: boolean; expected?: string; found?: string; reason?: string }> {
  const pdfDoc = await PDFDocument.load(pdfBuffer);

  // If no Info dict -> no signature stored
  const trailer = (pdfDoc as any).context.trailer;
  const infoRef = trailer.get(PDFName.of('Info'));
  if (!infoRef) {
    return { valid: false, reason: 'No Info dictionary present' };
  }

  const infoDict = (pdfDoc as any).context.lookup(infoRef) as PDFDict;

  const foundObj = infoDict.get(PDFName.of('SignedHash'));
  if (!foundObj) {
    return { valid: false, reason: 'No /SignedHash entry found in Info dictionary' };
  }

  // decode found value (PDFString)
  let foundHash: string | undefined;
  try {
    foundHash = (foundObj as any).decodeText();
  } catch (e) {
    // fallback: if it's not a PDFString, attempt toString
    try {
      foundHash = String((foundObj as any));
    } catch {
      foundHash = undefined;
    }
  }

  if (!foundHash) {
    return { valid: false, reason: 'Could not decode /SignedHash value' };
  }

  // Remove SignedHash before recomputing HMAC
  try {
    infoDict.delete(PDFName.of('SignedHash'));
  } catch (e) {
    // ignore if deletion fails
  }

  // Save temporary PDF bytes (without SignedHash)
  const tmpBytes = await pdfDoc.save();
  const expected = computeHmacHex(tmpBytes, secretKey);

  return { valid: expected === foundHash, expected, found: foundHash };
}

/* ======================
   Exemple d'utilisation
   ======================

import fs from 'fs';
import { signPdfBuffer, verifyPdfBuffer } from './pdfSignedHash';

(async () => {
  const input = fs.readFileSync('input.pdf');
  const key = 'ma-cle-secrete';

  // Signer
  const signed = await signPdfBuffer(input, key);
  fs.writeFileSync('signed.pdf', signed);

  // Vérifier
  const result = await verifyPdfBuffer(signed, key);
  console.log(result);
})();
*/


// My own functions according to the pdf-lib documentation: 


export async function pdfMetadataAccess(pdfBuffer : any){

    const pdfDoc = await PDFDocument.load(pdfBuffer, { 
        updateMetadata: true 
    });

    console.log('Title:', pdfDoc.getTitle());
    console.log('Author:', pdfDoc.getAuthor());
    console.log('Subject:', pdfDoc.getSubject());
    console.log('Creator:', pdfDoc.getCreator());
    console.log('Keywords:', pdfDoc.getKeywords());
    console.log('Producer:', pdfDoc.getProducer());
    console.log('Creation Date:', pdfDoc.getCreationDate());
    console.log('Modification Date:', pdfDoc.getModificationDate());
}


// Attention ajouter gestion des erreurs avec try...

export async function pdfMetadataHashSignature(pdfBuffer : any, secretKey : any){
    
    
    const hmacHex = computeHmacHex(pdfBuffer, secretKey);    
    
    const pdfDoc = await PDFDocument.load(pdfBuffer, { 
        updateMetadata: false
    });

    pdfDoc.setKeywords([hmacHex]);

    const pdfBytesSigned = await pdfDoc.save();
    
    const pdfBufferSigned = pdfBytesSigned;

    return pdfBufferSigned;
}

