// Libraries
import { Request, Response} from 'express';
const fs = require('fs');
const path = require('path');
import { parse } from 'jsonc-parser';
import FUAFormatFromSchemaService from '../services/FUAFormatFromSchemaService';
import { inspect } from "util";

// Other imports
import {Log} from '../middleware/logger/models/typescript/Log';
import { loggerInstance } from '../middleware/logger/models/typescript/Logger';
import { Logger_LogLevel } from '../middleware/logger/models/typescript/LogLevel';
import { Logger_SecurityLevel } from '../middleware/logger/models/typescript/SecurityLevel';
import { Logger_LogType } from '../middleware/logger/models/typescript/LogType';


class FUAFormatFromSchemaController {
    // Private attribute holding the entity name
    private readonly entityName: string = "FUAFormatFromSchema";

    create = async (req: Request, res: Response): Promise<void> => {
        
        try {
            const controllerBody = req.body;
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };

            const file = files['formatPayload']?.[0];
            
            const jsoncContent = file.buffer.toString('utf-8');
            const parsed = parse(jsoncContent);

            // Parsed payload wasn't a jsonc object
            if(parsed === undefined){
                let auxError = new Error('Error in FUA Format From Schema Controller - create: File sent wasnt jsonc compliant (parsing error). ');
                throw auxError;
            }

            // Validation parsing validation pending needed

            let newFUAFormat = null;
            newFUAFormat = await FUAFormatFromSchemaService.create({
                name: controllerBody.name,
                content: jsoncContent,
                codeName: controllerBody.name  ?? controllerBody.name.toString(),
                versionTag: controllerBody.versionTag ?? controllerBody.name.toString() + '_1',
                versionNumber: controllerBody.versionNumber ?? 1,
                createdBy: controllerBody.createdBy,  
            });
            
            let auxLog = new Log({
                timeStamp: new Date(),
                logLevel: Logger_LogLevel.INFO,
                securityLevel: Logger_SecurityLevel.Admin,
                logType: Logger_LogType.CREATE,
                environmentType: loggerInstance.enviroment.toString(),
                content: {
                    object: {
                        name: this.entityName,
                        uuid: newFUAFormat.uuid ?? '---'                        
                    }
                },
                description: ("Creating FUA Format From Schema Successful")
            });
            loggerInstance.printLog(auxLog, [
                { name: "terminal" },
                { name: "file", file: "logs/auxLog.log"},
                { name: "database" }
            ]);   

            res.status(201).json(newFUAFormat);   
        } catch (err: any) {
            res.status(500).json({
                error: 'Failed to create FUA Format From Schema. (Controller)', 
                message: (err as (Error)).message,
                details: (err as any).details ?? null, 
            });

            let auxLog = new Log({
                timeStamp: new Date(),
                logLevel: Logger_LogLevel.ERROR,
                securityLevel: Logger_SecurityLevel.Admin,
                logType: Logger_LogType.CREATE,
                environmentType: loggerInstance.enviroment.toString(),
                description: (err.message ? (err.message+'\n') : '') + (err.details ?? '')
            });
            loggerInstance.printLog(auxLog, [
                { name: "terminal" },
                { name: "file", file: "logs/auxLog.log"},
                { name: "database" }
            ]);
        }     
    };

    // Pending pagination
    listAll = async (req: Request, res: Response): Promise<void> => {
        try {
            
            const listFUAFormats = await FUAFormatFromSchemaService.listAll();
            let auxLog = new Log({
                timeStamp: new Date(),
                logLevel: Logger_LogLevel.INFO,
                securityLevel: Logger_SecurityLevel.Admin,
                logType: Logger_LogType.READ,
                environmentType: loggerInstance.enviroment.toString(),
                content: {
                    objectName: this.entityName,
                    object: listFUAFormats.map( (auxFuaFormat : any) => ({
                        uuid:  auxFuaFormat.uuid
                    }))
                },
                description: ("Listing all FUA Formats From Schema Successful")
            });
            loggerInstance.printLog(auxLog, [
                { name: "terminal" },
                { name: "file", file: "logs/auxLog.log"}, 
                { name: "database" }
            ]);   

            res.status(200).json(listFUAFormats);
        } catch (err: any) {
            res.status(500).json({
                error: 'Failed to list FUA Formats From Schema. (Controller)', 
                message: (err as (Error)).message,
                details: (err as any).details ?? null, 
            });
            let auxLog = new Log({
                timeStamp: new Date(),
                logLevel: Logger_LogLevel.ERROR,
                securityLevel: Logger_SecurityLevel.Admin,
                logType: Logger_LogType.READ,
                environmentType: loggerInstance.enviroment.toString(),
                description: (err.message ? (err.message+'\n') : '') + (err.details ?? '')
            });
            loggerInstance.printLog(auxLog, [
                { name: "terminal" },
                { name: "file", file: "logs/auxLog.log"},
                { name: "database" }
            ]);
        } 
    };

    getById = async (req: Request, res: Response): Promise<void> => {
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
            let auxLog = new Log({
                timeStamp: new Date(),
                logLevel: Logger_LogLevel.ERROR,
                securityLevel: Logger_SecurityLevel.Admin,
                logType: Logger_LogType.READ,
                environmentType: loggerInstance.enviroment.toString(),
                description: (err.message ? (err.message+'\n') : '') + (err.details ?? '')
            });
            loggerInstance.printLog(auxLog, [
                { name: "terminal" },
                { name: "file", file: "logs/auxLog.log"},
                { name: "database" }
            ]);
        }
        let auxLog = new Log({
                timeStamp: new Date(),
                logLevel: Logger_LogLevel.INFO,
                securityLevel: Logger_SecurityLevel.Admin,
                logType: Logger_LogType.READ,
                environmentType: loggerInstance.enviroment.toString(),
                description: ("Getting FUA Format by Id or UUID Successful")
            });
            loggerInstance.printLog(auxLog, [
                { name: "terminal" },
                { name: "file", file: "logs/auxLog.log"},
                { name: "database" }
            ]);
            
    };

    // Render FUA Format by Id or UUID
    render = async (req: Request, res: Response): Promise<void> => {
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
            let auxLog = new Log({
                timeStamp: new Date(),
                logLevel: Logger_LogLevel.INFO,
                securityLevel: Logger_SecurityLevel.Admin,
                logType: Logger_LogType.SYSTEM,
                environmentType: loggerInstance.enviroment.toString(),
                description: ("Rendering FUA Format by Id or UUID Successful")
            });
            loggerInstance.printLog(auxLog, [
                { name: "terminal" },
                { name: "file", file: "logs/auxLog.log"},
                { name: "database" }
            ]);   
        } catch (err: any) {
            res.status(500).json({
                error: 'Failed to render FUA Format. (Controller)', 
                message: (err as (Error)).message,
                details: (err as any).details ?? null, 
            });
            let auxLog = new Log({
                timeStamp: new Date(),
                logLevel: Logger_LogLevel.ERROR,
                securityLevel: Logger_SecurityLevel.Admin,
                logType: Logger_LogType.SYSTEM,
                environmentType: loggerInstance.enviroment.toString(),
                description: (err.message ? (err.message+'\n') : '') + (err.details ?? '')
            });
            loggerInstance.printLog(auxLog, [
                { name: "terminal" },
                { name: "file", file: "logs/auxLog.log"},
                { name: "database" }
            ]);
        }   
    };

    edit = async (req: Request, res: Response): Promise<void> => {
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
                versionNumber: controllerBody.versionNumber ?? 1
            });
            if (editFUAFormat == null){
                res.status(304).json({
                    error: `FUA Field by UUID '${controllerBody.uuid}' couldnt be found. `,
                });
                return;
            }
            res.status(200).json(editFUAFormat);  
            let auxLog = new Log({
                timeStamp: new Date(),
                logLevel: Logger_LogLevel.ERROR,
                securityLevel: Logger_SecurityLevel.Admin,
                logType: Logger_LogType.EDIT,
                environmentType: loggerInstance.enviroment.toString(),
                description: ("Editing FUA Format From Schema Successful")
            });
            loggerInstance.printLog(auxLog, [
                { name: "terminal" },
                { name: "file", file: "logs/auxLog.log"},
                { name: "database" }
            ]);  
        } catch (err: any) {
            res.status(500).json({
                error: 'Failed to edit FUA Format From Schema. (Controller)', 
                message: (err as (Error)).message,
                details: (err as any).details ?? null, 
            });
            let auxLog = new Log({
                timeStamp: new Date(),
                logLevel: Logger_LogLevel.ERROR,
                securityLevel: Logger_SecurityLevel.Admin,
                logType: Logger_LogType.EDIT,
                environmentType: loggerInstance.enviroment.toString(),
                description: (err.message ? (err.message+'\n') : '') + (err.details ?? '')
            });
            loggerInstance.printLog(auxLog, [
                { name: "terminal" },
                { name: "file", file: "logs/auxLog.log"},
                { name: "database" }
            ]);
        }
            
    };
}

export default new FUAFormatFromSchemaController();