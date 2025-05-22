import {z} from "zod";

import FUAFormatImplementation from '../implementation/sequelize/FUAFormatImplementation';
import { isValidUUIDv4 } from "../utils/utils";

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
            returnedFUAFormat = await FUAFormatImplementation.createFUAFormatSequelize(data);
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
            returnedFUAFormats = await FUAFormatImplementation.listAllFUAFormatsSequelize();

        } catch (err: unknown){
            console.error('Error in FUAFormat Service: ', err);
            (err as Error).message =  'Error in FUAFormat Service: ' + (err as Error).message;
            throw err;
        }        

        return returnedFUAFormats;
    };

    // Get FUA Format by Id (Id or UUID)
    async getByIdOrUUID( idReceived: string ) {
        let returnedFUAFormats = null;

        // Check if UUID or Id was sent
        let id = null;
        const nuNumber = Number(idReceived);
        if( Number.isInteger(nuNumber) ){
            id = nuNumber;

            try {
                returnedFUAFormats = await FUAFormatImplementation.getFUAFormatByIdSequelize(id);

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

                returnedFUAFormats = await FUAFormatImplementation.getFUAFormatByUUIDSequelize(idReceived);

            } catch (err: unknown){
                console.error('Error in FUAFormat Service: ', err);
                (err as Error).message =  'Error in FUAFormat Service: ' + (err as Error).message;
                throw err;
            }
            
        }      
        
        // If nothing was found, it will return a []
        if( Array.isArray(returnedFUAFormats) && returnedFUAFormats.length === 0){
            return null;
        } 

        return returnedFUAFormats;
    };

    // Get FUA Format Id by UUID
    async getIdbyUUID( uuidReceived: string){
        let returnedFUAFormats = null;

        //Validate UUID Format        
        if (!isValidUUIDv4(uuidReceived) ) {
            throw new Error("Invalid UUID format. ");
        }

        try {
            returnedFUAFormats = await FUAFormatImplementation.getFUAFormatIdbyUUIDSequelize(uuidReceived);

        } catch (err: unknown){
            console.error('Error in FUAFormat Service: ', err);
            (err as Error).message =  'Error in FUAFormat Service: ' + (err as Error).message;
            throw err;
        }

        // If nothing was found, it will return a []
        if( Array.isArray(returnedFUAFormats) && returnedFUAFormats.length === 0){
            return null;
        } 
    }
};

export default new FUAFormatService();
