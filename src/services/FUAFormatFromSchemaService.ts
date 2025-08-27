import {z} from "zod";
import { parse } from 'jsonc-parser';

import FUAFormatImplementation from '../implementation/sequelize/FUAFormatImplementation';
import { isValidUUIDv4 } from "../utils/utils";
import FUARenderingUtils from "../utils/FUARendering";
import FUAFormatFromSchemaImplementation from "../implementation/sequelize/FUAFormatFromSchemaImplementation";
import puppeteer from "puppeteer";

import * as fs from "fs";
import * as path from "path";
import { plainAddPlaceholder } from '@signpdf/placeholder-plain';
import { P12Signer } from '@signpdf/signer-p12';
import signpdf from '@signpdf/signpdf';


import crypto from "crypto";
import { getServerCertFingerprintSHA256 } from "../utils/serverCert";

const verifyPDF = require("@ninja-labs/verify-pdf");

// Schemas

const newFUAFormatFromSchemaZod = z.object({
    // Format Data
    name: z.string(),
    content: z.string(),
    // Base Field Form Data
    codeName: z.string(),    
    versionTag: z.string(),
    versionNumber: z.number().int().positive(), // must be a positive integer
    // Audit Data
    createdBy: z.string(),
});

const editFUAFormatFromSchemaZod = z.object({
    // Format Data
    uuid: z.string(),
    name: z.string(),
    content: z.string(),
    // Base Field Form Data
    codeName: z.string(),    
    versionTag: z.string(),
    versionNumber: z.number().int().positive(), // must be a positive integer
    // Audit Data
    createdBy: z.string(),
});

export class FUAFormatFromSchemaService {

    // Creation of FUA Format
    async create(data: {
        // Format Data
        name: string;
        content: string;
        // Version Data
        codeName: string;
        versionTag: string; 
        versionNumber: number;
        // Audit Data
        createdBy: string;
    }) {
        // Object Validation
        const result = newFUAFormatFromSchemaZod.safeParse(data);
        if( !result.success ){
            console.error('Error in FUA Format From Schema Service - createFUAFormat: ZOD validation. \n', result.error);
            const newError = new Error('Error in FUA Format From Schema Service - createFUAFormat: ZOD validation. ');
            (newError as any).details = result.error;
            throw newError;
        }
        
        // FUAFormat creation
        let returnedFUAFormat = null;
        try {
            returnedFUAFormat = await FUAFormatFromSchemaImplementation.createSequelize({
                // Format Data
                name: data.name,
                content: data.content,
                // Version Data
                codeName: data.codeName,
                versionTag: data.versionTag , 
                versionNumber: data.versionNumber,
                // Audit Data
                createdBy: data.createdBy,
            });
        } catch (err: unknown){
            console.error('Error in FUA Format From Schema Service: ', err);
            (err as Error).message =  'Error in FUA Format From Schema Service: \n' + (err as Error).message;
            throw err;
        }

        return {
            uuid: returnedFUAFormat.uuid
        };
    };

    // List FUA Formats
    // Pending to paginate results
    async listAll( ) {
        let returnedFUAFormats = [];
        try {
            returnedFUAFormats = await FUAFormatFromSchemaImplementation.listAllSequelize();

        } catch (err: unknown){
            console.error('Error in FUA Format From Schema Service: ', err);
            (err as Error).message =  'Error in FUA Format From Schema Service: ' + (err as Error).message;
            throw err;
        }        

        return returnedFUAFormats;
    };

    // Get FUA Format by Id (Id or UUID)
    async getByIdOrUUID( idReceived: string ) {
        let returnedFUAFormat = null;

        // Check if UUID or Id was sent
        let id = null;
        const nuNumber = Number(idReceived);
        if( Number.isInteger(nuNumber) ){
            id = nuNumber;

            try {
                returnedFUAFormat = await FUAFormatFromSchemaImplementation.getByIdSequelize(id);

            } catch (err: unknown){
                console.error('Error in FUA Format From Schema Service: ', err);
                (err as Error).message =  'Error in FUA Format From SchemaFUA Format From Schema Service: ' + (err as Error).message;
                throw err;
            }     
        }else{
            // Get id by UUID
            //Validate UUID Format        
            if (!isValidUUIDv4(idReceived) ) {
                console.error('Error in FUA Format From Schema Service: Invalid UUID format. ');
                throw new Error("Error in FUA Format From Schema Service: Invalid UUID format. ");
            }
            try {

                returnedFUAFormat = await FUAFormatFromSchemaImplementation.getByUUIDSequelize(idReceived);

            } catch (err: unknown){
                console.error('Error in FUA Format From Schema Service: ', err);
                (err as Error).message =  'Error in FUA Format From Schema Service: ' + (err as Error).message;
                throw err;
            }
            
        }      
        // If nothing was offund, return a null
        return returnedFUAFormat;
    };

    // Get FUA Format Id by UUID
    async getIdByUUID( uuidReceived: string){
        let returnedFUAFormats = null;

        //Validate UUID Format        
        if (!isValidUUIDv4(uuidReceived) ) {
            throw new Error("Error FUA Format From Schema Service - getIdByUUID: Invalid UUID format. ");
        }

        try {
            returnedFUAFormats = await FUAFormatFromSchemaImplementation.getByUUIDSequelize(uuidReceived);

        } catch (err: unknown){
            console.error('Error in FUA Format From Schema Service - getIdByUUID: ', err);
            (err as Error).message =  'Error in FUA Format From Schema Service- getIdByUUID: ' + (err as Error).message;
            throw err;
        }

        // If nothing was found, it will return a null
        return returnedFUAFormats
    }

    // Render FUA Format by Id
    async renderById( visitPayload: Object, idReceived: string ) {
        // Get Format by Id or UUID
        let auxFuaFormat = null;
        try {
            auxFuaFormat = await this.getByIdOrUUID(idReceived);
        } catch (err: unknown){
            console.error('Error in FUAFormat Service - renderById: ', err);
            (err as Error).message =  'Error in FUAFormat Service - renderById: ' + (err as Error).message;
            throw err;
        }

        // If nothing was found, it will return a null
        if( auxFuaFormat === null){
            return null;
        } 

        let htmlContent = ''; 

        let parsedContent = parse(auxFuaFormat.content);

        try{
            htmlContent = await FUARenderingUtils.renderFUAFormatFromSchema(parsedContent, false);
        } catch(error: any){
            console.error('Error in FUA Format Service - renderById: ', error);
            (error as Error).message =  'Error in FUA Format Service - renderById: ' + (error as Error).message;
            throw error;
        }
        
        
        return htmlContent;   
    }


    // Edit of FUA format
    async edit(data: {
        // Format Data
        uuid: string;
        name: string;
        content: string;
        // Version Data
        codeName: string;
        versionTag: string; 
        versionNumber: number;
        // Audit Data
        createdBy: string;
    }) {
        // Object Validation
        const result = editFUAFormatFromSchemaZod.safeParse(data);
        if( !result.success ){
            console.error('Error in FUA Format From Schema Service - editFUAFormat: ZOD validation. \n', result.error);
            const newError = new Error('Error in FUA Format From Schema Service - editFUAFormat: ZOD validation. ');
            (newError as any).details = result.error;
            throw newError;
        }
        
        // FUAFormat edit
        let returnedFUAFormat = null;
        try {
            returnedFUAFormat = await FUAFormatFromSchemaImplementation.editSequelize({
                // Format Data
                uuid: data.uuid,
                name: data.name,
                content: data.content,
                // Version Data
                codeName: data.codeName,
                versionTag: data.versionTag , 
                versionNumber: data.versionNumber,
                // Audit Data
                createdBy: data.createdBy,
            });
        } catch (err: unknown){
            console.error('Error in FUA Format From Schema Service: ', err);
            (err as Error).message =  'Error in FUA Format From Schema Service: \n' + (err as Error).message;
            throw err;
        }
        if (returnedFUAFormat == null){
            return null;
        }
    
        return {
            uuid: returnedFUAFormat.uuid
        };
    };

    // Return a signed PDF by Id
    async returnSignedPDFbyID(idReceived: string): Promise<Buffer | null> {
        // Get FUA Format from DB
        let auxFuaFormat = null;
        try {
            auxFuaFormat = await this.getByIdOrUUID(idReceived);
        } catch (err: unknown){
            console.error('Error in FUAFormat Service - returnSignedPDFbyID: ', err);
            (err as Error).message =  'Error in FUAFormat Service - returnSignedPDFbyID: ' + (err as Error).message;
            throw err;
        }
        // If nothing was found, it will return a null
        if( auxFuaFormat === null){
            return null;
        } 
        // Generate the pdf 

        let parsedSchema = null;

        try {
            parsedSchema = parse(auxFuaFormat.content);

        }catch (err: unknown){
            console.error('Error in FUAFormat Service - returnSignedPDFbyID: ', err);
            (err as Error).message = 'Error in FUAFormat Service - returnSignedPDFbyID: ' + (err as Error).message;
            throw err;
        }

        let htmlContent = '';

        try{
            htmlContent = await FUARenderingUtils.renderFUAFormatFromSchema(parsedSchema, true);
        }catch (err: unknown){
            console.error('Error in FUAFormat Service - returnSignedPDFbyID: ', err);
            (err as Error).message = 'Error in FUAFormat Service - returnSignedPDFbyID: ' + (err as Error).message;
            throw err;
        }
        
        let pdfBuffer: Buffer;

        try {
            const browser = await puppeteer.launch({
                headless: true,
                defaultViewport: null,
                args: ["--no-sandbox", "--font-render-hinting=none"],
            });
        const page = await browser.newPage();
        await page.emulateMediaType("print");

        await page.setContent(htmlContent, {waitUntil: "networkidle0"});

        const rawPdf = await page.pdf({
            printBackground: true,
            preferCSSPageSize: false,  // même choix que votre code
            width: "210mm",
            height: "297mm",
            margin: { top: "0mm", right: "0mm", bottom: "0mm", left: "0mm" },
            pageRanges: "1-",
            displayHeaderFooter: false,
            scale: 1,
        });

        pdfBuffer = Buffer.isBuffer(rawPdf) ? rawPdf : Buffer.from(rawPdf);    

        console.log("Type vérifié :", Buffer.isBuffer(pdfBuffer));  
        console.log("Taille du buffer :", pdfBuffer.length);

        await page.close();
        await browser.close();
        }catch(err: unknown){
            console.error('Error in FUAFormat Service - returnSignedPDFbyID: ', err);
            (err as Error).message = 'Error in FUAFormat Service - returnSignedPDFbyID: ' + (err as Error).message;
            throw err;
        }
        let signedPdf: Buffer;
        try {
            const certPath = path.resolve(process.cwd(), "./src/certificate/certificate.p12");
            const passphrase = "password";
            const p12Buffer = fs.readFileSync(certPath);

            const pdfWithPlaceholder = plainAddPlaceholder({
                pdfBuffer: pdfBuffer,
                reason: "Approval",
                contactInfo: "gidis@example.com",
                name: "My Server",
                location: "PUCP"
            });

            const signer = new P12Signer(p12Buffer, {passphrase});  
            signedPdf = await signpdf.sign(pdfWithPlaceholder, signer);
        }catch (err: unknown) {
            console.error('Error in FUAFormat Service - returnSignedPDFbyID (sign): ', err);
            (err as Error).message = 'Error in FUAFormat Service - returnSignedPDFbyID (sign): ' + (err as Error).message;
            throw err;
        }
    
    return signedPdf;
    }

    


};

export default new FUAFormatFromSchemaService();
