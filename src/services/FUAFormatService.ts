import {z} from "zod";

import FUAFormatImplementation from '../implementation/sequelize/FUAFormatImplementation';
import { isValidUUIDv4 } from "../utils/utils";
import FUARenderingUtils from "../utils/FUARendering";

// Schemas

const newFUAFormatSchema = z.object({
    // Format Data
    codeName: z.string(), 
    version: z.string(),
    // Audit Data
    createdBy: z.string(),
});

class FUAFormatService {

    // Creation of FUA Format
    async create(data: {
        // Format Data
        codeName: string; 
        version: string;
        // Audit Data
        createdBy: string;
    }) {
        // Object Validation
        const result = newFUAFormatSchema.safeParse(data);
        if( !result.success ){
            console.error('Error in FUAFormat Service - createFUAFormat: ZOD validation. \n', result.error);
            const newError = new Error('Error in FUAFormat Service - createFUAFormat: ZOD validation. ');
            (newError as any).details = result.error;
            throw newError;
        }
        
        // FUAFormat creation
        let returnedFUAFormat = null;
        try {
            returnedFUAFormat = await FUAFormatImplementation.createSequelize(data);
        } catch (err: unknown){
            console.error('Error in FUAFormat Service: ', err);
            (err as Error).message =  'Error in FUAFormat Service: \n' + (err as Error).message;
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
            returnedFUAFormats = await FUAFormatImplementation.listAllSequelize();

        } catch (err: unknown){
            console.error('Error in FUAFormat Service: ', err);
            (err as Error).message =  'Error in FUAFormat Service: ' + (err as Error).message;
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
                returnedFUAFormat = await FUAFormatImplementation.getByIdSequelize(id);

            } catch (err: unknown){
                console.error('Error in FUAFormat Service: ', err);
                (err as Error).message =  'Error in FUAFormat Service: ' + (err as Error).message;
                throw err;
            }     
        }else{
            // Get id by UUID
            //Validate UUID Format        
            if (!isValidUUIDv4(idReceived) ) {
                console.error('Error in FUAFormat Service: Invalid UUID format. ');
                throw new Error("Error in FUAFormat Service: Invalid UUID format. ");
            }
            try {

                returnedFUAFormat = await FUAFormatImplementation.getByUUIDSequelize(idReceived);

            } catch (err: unknown){
                console.error('Error in FUAFormat Service: ', err);
                (err as Error).message =  'Error in FUAFormat Service: ' + (err as Error).message;
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
            throw new Error("Error in FUA Format Service - getIdByUUID: Invalid UUID format. ");
        }

        try {
            returnedFUAFormats = await FUAFormatImplementation.getByUUIDSequelize(uuidReceived);

        } catch (err: unknown){
            console.error('Error in FUA Format Service - getIdByUUID: ', err);
            (err as Error).message =  'Error in FUA Format Service- getIdByUUID: ' + (err as Error).message;
            throw err;
        }

        // If nothing was found, it will return a null
        return returnedFUAFormats
    }

    // Get FUA Pages by Id or UUID
    async getFUAPagesByIdOrUUID( idReceived: string ) {
        // Get FUA Format Id or UUID
        let auxFUAFormat = null;
        try {
            auxFUAFormat = await this.getByIdOrUUID(idReceived);
        } catch (err: unknown){
            console.error('Error in FUA Format Service - getFUAPagesByIdOrUUID: ', err);    
            (err as Error).message =  'Error in FUA Format Service - getFUAPagesByIdOrUUID: ' + (err as Error).message;
            throw err;  
        }

        // If nothing was found, it will return a []
        if( Array.isArray(auxFUAFormat) && auxFUAFormat.length === 0){
            console.error(`Error in FUA Format Service - getFUAPagesByIdOrUUID: Couldnt found FUA Format identified by Id "${idReceived}". `);
            throw new Error(`Error in FUA Format Service - getFUAPagesByIdOrUUID: Couldnt found FUA Format identified by Id "${idReceived}". `);
        }

        let returnedFUAFormatPages = [];
        
        try {
            returnedFUAFormatPages = await FUAFormatImplementation.getFUAPagesByIdSequelize(auxFUAFormat.id);
        } catch (err: unknown){
            console.error('Error in FUA Format Service - getFUAPagesByIdOrUUID: ', err);
            (err as Error).message =  'Error in FUA Format Service - getFUAPagesByIdOrUUID: ' + (err as Error).message;
            throw err;
        }

        return returnedFUAFormatPages;
    }

    // Render FUA Format by Id
    async renderById( idReceived: string ) {
        // Get Format by Id or UUID
        let auxFuaFormat = null;
        try {
            auxFuaFormat = await this.getByIdOrUUID(idReceived);
        } catch (err: unknown){
            console.error('Error in FUAFormat Service - renderById: ', err);
            (err as Error).message =  'Error in FUAFormat Service - renderById: ' + (err as Error).message;
            throw err;
        }
        // If nothing was found, it will return a []
        if( auxFuaFormat === null){
            return null;
        } 

        // Get FUA Pages
        auxFuaFormat.pages = [];
        try {
            auxFuaFormat.pages = await this.getFUAPagesByIdOrUUID(auxFuaFormat.id);
        } catch (err: unknown){
            console.error('Error in FUA Format Service - renderById: ', err);
            (err as Error).message =  'Error in FUA Format Service - renderById: ' + (err as Error).message;
            throw err;
        }

        // Render FUA Pages of FUA Format
        let htmlContent = null;

        try{
            htmlContent = await FUARenderingUtils.renderFUAFormat(auxFuaFormat);
        } catch(error: any){
            console.error('Error in FUA Format Service - renderById: ', error);
            (error as Error).message =  'Error in FUA Format Service - renderById: ' + (error as Error).message;
            throw error;
        }
        
        
        return htmlContent;
         
    }
};

export default new FUAFormatService();
