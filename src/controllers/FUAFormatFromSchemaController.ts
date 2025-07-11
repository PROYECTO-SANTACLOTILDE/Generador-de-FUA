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

        let newFUAFormat = null;
        try {
            newFUAFormat = await FUAFormatFromSchemaService.create(controllerBody);
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
    /* async render (req: Request, res: Response): Promise<void>  {
        const payload = req.params.id;
        const { token = "---", visit = "---" } = req.body ?? {};

        // Validate token
        
        let htmlContent = null;

        try {
            htmlContent = await FUAFormatFromSchemaController.renderById(payload);
            if(htmlContent === null){
                res.status(404).json({
                    error: `FUA Format by Id or UUID '${payload}' couldnt be found. `, 
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
            
    }, */
};

export default FUAFormatFromSchemaController;

