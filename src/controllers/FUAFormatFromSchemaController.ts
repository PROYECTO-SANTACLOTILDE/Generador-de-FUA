import { Request, Response} from 'express';

const fs = require('fs');
const path = require('path');
import { parse } from 'jsonc-parser';

import FUAFormatFromSchemaService from '../services/FUAFormatFromSchemaService';


const FUAFormatFromSchemaController = {

    async create  (req: Request, res: Response): Promise<void>  {
        const controllerBody = req.body;
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        const file = files['formatPayload']?.[0];
         
        const jsoncContent = file.buffer.toString('utf-8');
        const parsed = parse(jsoncContent);

        // Validation parsing validation pending needed
        

        let newFUAFormat = null;
        try {
            newFUAFormat = await FUAFormatFromSchemaService.create({
                name: controllerBody.name,
                content: jsoncContent,
                codeName: controllerBody.name  ?? controllerBody.name.toString(),
                versionTag: controllerBody.versionTag ?? controllerBody.name.toString() + '_1',
                versionNumber: controllerBody.versionNumber ?? 1,
                createdBy: controllerBody.createdBy,
            });
            res.status(201).json(newFUAFormat);    
        } catch (err: any) {
            res.status(500).json({
                error: 'Failed to create FUA Format From Schema. (Controller)', 
                message: (err as (Error)).message,
                details: (err as any).details ?? null, 
            });
        }
            
    },

    // Pending pagination
    async listAll (req: Request, res: Response): Promise<void>  {
        try {
            const listFUAFormats = await FUAFormatFromSchemaService.listAll();
            res.status(200).json(listFUAFormats);
        } catch (err: any) {
            res.status(500).json({
                error: 'Failed to list FUA Formats From Schema. (Controller)', 
                message: (err as (Error)).message,
                details: (err as any).details ?? null, 
            });
        }    
    },

    async getById (req: Request, res: Response): Promise<void>  {
        const payload = req.params.id;

        let searchedFUAFormat = null;

        try {
            searchedFUAFormat = await FUAFormatFromSchemaService.getByIdOrUUID(payload);
            
            // In case nothing was found 
            if(searchedFUAFormat === null){
                res.status(404).json({
                    error: `FUA Format by Id or UUID '${payload}' couldnt be found. `,
                });
                return;
            }

            res.status(200).json(searchedFUAFormat);    
        } catch (err: any) {
            res.status(500).json({
                error: 'Failed to get FUA Format. (Controller)', 
                message: (err as (Error)).message,
                details: (err as any).details ?? null, 
            });
        }
            
    },

    // Render FUA Format by Id or UUID
    async render (req: Request, res: Response): Promise<void>  {
        const formatidentifier = req.params.id;
        const visitpayload = req.body.payload;
     
        let htmlContent = null;

        try {
            htmlContent = await FUAFormatFromSchemaService.renderById(visitpayload, formatidentifier);
            if(htmlContent === null){
                res.status(404).json({
                    error: `FUA Format by Id or UUID '${formatidentifier}' couldnt be found. `, 
                });
                return;
            }                
            res.status(200).send(htmlContent);    
        } catch (err: any) {
            res.status(500).json({
                error: 'Failed to render FUA Format. (Controller)', 
                message: (err as (Error)).message,
                details: (err as any).details ?? null, 
            });
        }
            
    },

    async edit (req: Request, res: Response): Promise<void>  {
        const controllerBody = req.body;
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        const file = files['formatPayload']?.[0];
         
        const jsoncContent = file.buffer.toString('utf-8');
        const parsed = parse(jsoncContent);

        // Validation parsing validation pending needed
        

        let editFUAFormat = null;
        try {
            editFUAFormat = await FUAFormatFromSchemaService.edit({
                uuid: req.params.id,
                name: controllerBody.name,
                content: jsoncContent,
                codeName: controllerBody.name  ?? controllerBody.name.toString(),
                versionTag: controllerBody.versionTag ?? controllerBody.name.toString() + '_1',
                versionNumber: controllerBody.versionNumber ?? 1,
                createdBy: controllerBody.createdBy,
            });
            if (editFUAFormat == null){
                res.status(304).json({
                    error: `FUA Field by UUID '${controllerBody.uuid}' couldnt be found. `,
                });
                return;
            }
            res.status(200).json(editFUAFormat);    
        } catch (err: any) {
            res.status(500).json({
                error: 'Failed to edit FUA Format From Schema. (Controller)', 
                message: (err as (Error)).message,
                details: (err as any).details ?? null, 
            });
        }
            
    },

    async returnSignedPDFbyID (req: Request, res: Response): Promise<void>  {
        const payload = req.params.id;

        try {
            const signedPdf = await FUAFormatFromSchemaService.returnSignedPDFbyID(payload);

            if (signedPdf === null) {
                res.status(404).json({
                    error: `FUA Format by Id or UUID '${payload}' couldnt be found. `,
                });
                return;
            }
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('X-Content-Type-Options', 'nosniff');
            res.setHeader('Content-Disposition', 'inline; filename="fua-signed.pdf"');
            res.status(200).end(signedPdf);
        } catch (err: any) {
            res.status(500).json({
                error: 'Failed to return signed PDF. (Controller)', 
                message: (err as Error).message,
                details: (err as any).details ?? null, 
            });
        }    
    }

};

export default FUAFormatFromSchemaController;

