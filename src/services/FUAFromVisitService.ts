import {z} from "zod";

import { isValidUUIDv4 } from "../utils/utils";
import FUAFromVisitImplementation from "../implementation/sequelize/FUAFromVisitImplementation";


// Schemas
const newFUAFromVisitSchema = z.object({
    // FUA Data, checksum not needed
    payload: z.string(), 
    schemaType: z.string(),    
    // Audit Data
    createdBy: z.string(),
});


class FUAFromVisitService {

    // Creation of FUA Field
    async create(data: {
        // FUA Data
        payload: string; 
        schemaType: string;
        // Audit Data
        createdBy: string;
    }) {
        
        // Object validation
        const result = newFUAFromVisitSchema.safeParse(data);
        if( !result.success ){
            console.error('Error in FUA From Visit Service - create: ZOD validation. \n', result.error);
            const newError = new Error('Error in FUA From Visit Service - create: ZOD validation. ');
            (newError as any).details = result.error;
            throw newError;
        }

        // Check if FUA Format exists

        // Send data to create  
        let returnedFUA = null;

        try {
            returnedFUA = await FUAFromVisitImplementation.createSequelize({
                payload: data.payload,
                schemaType: data.schemaType,
                // Audit Data
                createdBy: data.createdBy,
            });
        } catch (err: unknown){
            console.error(`Error in FUA From Visit service - create:  `, err);
            throw new Error(`Error in FUA From Visit service - create:  ` + (err as Error).message);
        }        

        return {
            uuid: returnedFUA.uuid
        };
    }

    // List all FUA Pages
    async listAll( ){
        let returnedFUAFields = [];
        try {
            returnedFUAFields = await FUAFromVisitImplementation.listAllSequelize();

        } catch (err: unknown){
            console.error('Error in FUA From Visit Service: ', err);
            (err as Error).message =  'Error in FUA From Visit Service: ' + (err as Error).message;
            throw err;
        }        

        return returnedFUAFields;
    };

    // get FUA From Visit by Id (Id or UUID)
    async getByIdOrUUID (idReceived: string) {
        let returnedFUAField = null;

        // Check if UUID or Id was sent
        let id = null;
        const nuNumber = Number(idReceived);
        if( Number.isInteger(nuNumber) ){
            id = nuNumber;

            try {
                returnedFUAField = await FUAFromVisitImplementation.getByIdSequelize(id);

            } catch (err: unknown){
                console.error('Error in FUA From Visit Service - getByIdOrUUID: ', err);
                (err as Error).message =  'Error in FUA From Visit Service - getByIdOrUUID: ' + (err as Error).message;
                throw err;
            }     
        }else{
            // Get id by UUID

            //Validate UUID Format        
            if (!isValidUUIDv4(idReceived) ) {
                console.error('Error in FUA From Visit: Invalid UUID format. ');
                throw new Error("Error in FUA From Visit: Invalid UUID format. ");
            }
            try {

                returnedFUAField = await FUAFromVisitImplementation.getByUUIDSequelize(idReceived);

            } catch (err: unknown){
                console.error('Error in FUA From Visit Service: ', err);
                (err as Error).message =  'Error in FUA From Visit Service: ' + (err as Error).message;
                throw err;
            }            
        }      
            
        // If nothing was found, it will return a null
        return returnedFUAField;
    };
};

export default new FUAFromVisitService();
