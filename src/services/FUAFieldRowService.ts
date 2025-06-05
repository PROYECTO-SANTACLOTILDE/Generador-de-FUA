import {z} from "zod";

import { isValidUUIDv4 } from "../utils/utils";
import FUAFieldColumnService from "./FUAFieldColumnService";
import FUAFieldRowImplementation from "../implementation/sequelize/FUAFieldRowImplementation";


// Schemas
const newFUAFieldRowSchema = z.object({
    // Field Row Data
    label: z.string(), 
    showLabel: z.string(),
    valueType: z.string(),
    codeName: z.string(),
    version: z.string(),   
    rowIndex: z.number().int().positive(), 
    // Field Data
    FUAFieldColumnId: z.string().or(z.number().int().positive() ),
    // Audit Data
    createdBy: z.string(),
});


class FUAFieldRowService {

    // Creation of FUA Field Row
    async create(data: any) {
        
        // Object validation
        const result = newFUAFieldRowSchema.safeParse(data);
        if( !result.success ){
            console.error('Error in FUA Field Row Service - create: ZOD validation. \n', result.error);
            const newError = new Error('Error in FUA Field Row Service - create: ZOD validation. ');
            (newError as any).details = result.error;
            throw newError;
        }

        // Check if FUA Column exists
        let auxFUAColumn = null;

        try {
            auxFUAColumn = await FUAFieldColumnService.getByIdOrUUID( data.FUAFieldColumnId.toString() );
        } catch (error: unknown) {
            console.error(`Error in FUA Field Row Service - getByIdOrUUID of FUA Field Column Service: Couldnt search FUA Field Row by Id or UUID '${data.FUAFormat}'. `, error);
            (error as Error).message =  `Error in FUA Field Row Service - getByIdOrUUID of FUA Field Column Service: Couldnt search FUA Field Row by Id or UUID  '${data.FUAFormat}'. ` + (error as Error).message;
            throw error;
        }
        // Check if a FUA Field Row wanst found
        if(auxFUAColumn === null){
            // In case a FUA Field Row wasnt found
            console.error(`Error in FUA Field Row Service: Couldnt found FUA Field Column by Id or UUID '${data.FUAFormat}'. `);
            throw new Error(`Error in FUA Field Row Service: Couldnt found FUA Field Column by Id or UUID '${data.FUAFormat}'. `);
        }

        let FUAFieldColumnId = auxFUAColumn[0].id;

        // Send data to create  
        let returnedFUAFieldRow = null;

        try {
            returnedFUAFieldRow = await FUAFieldRowImplementation.createSequelize({
                label: data.label,
                showLabel: data.showLabel,
                valueType: data.valueType,
                codeName: data.codeName,
                version: data.version,
                rowIndex: data.rowIndex,
                FUAFieldColumnId: FUAFieldColumnId,
                createdBy: data.createdBy,
            });
        } catch (err: unknown){
            console.error(`Error in FUA Field Row service - create:  `, err);
            throw new Error(`Error in FUA Field Row service - create:  ` + (err as Error).message);
        }        

        return {
            uuid: returnedFUAFieldRow.uuid
        };
    }

    // List all FUA Field Rows
    async listAll( ){
        let returnedFUAFieldRows = [];
        try {
            returnedFUAFieldRows = await FUAFieldRowImplementation.listAllSequelize();

        } catch (err: unknown){
            console.error('Error in FUA Field Row Service - listAll: ', err);
            (err as Error).message =  'Error in FUA Field Row Service - listAll: ' + (err as Error).message;
            throw err;
        }        

        return returnedFUAFieldRows;
    };

    // get FUA Field Row by Id (Id or UUID)
    async getByIdOrUUID (idReceived: string) {
        let returnedFUAFieldRow = null;

        // Check if UUID or Id was sent
        let id = null;
        const nuNumber = Number(idReceived);
        if( Number.isInteger(nuNumber) ){
            id = nuNumber;

            try {
                returnedFUAFieldRow = await FUAFieldRowImplementation.getByIdSequelize(id);

            } catch (err: unknown){
                console.error('Error in FUA Field Row Service - getByIdOrUUID: ', err);
                (err as Error).message =  'Error in FUA Field Row Service - getByIdOrUUID: ' + (err as Error).message;
                throw err;
            }     
        }else{
            // Get id by UUID

            //Validate UUID Format        
            if (!isValidUUIDv4(idReceived) ) {
                console.error('Error in FUA Field Row Service - getByIdOrUUID: Invalid UUID format. ');
                throw new Error("Error in FUA Field Row Service - getByIdOrUUID: Invalid UUID format. ");
            }
            try {

                returnedFUAFieldRow = await FUAFieldRowImplementation.getByUUIDSequelize(idReceived);

            } catch (err: unknown){
                console.error('Error in FUA Field Row Service: ', err);
                (err as Error).message =  'Error in FUA Field Row Service: ' + (err as Error).message;
                throw err;
            }
            
        }      
            
        // If nothing was found, it will return a []
        if( Array.isArray(returnedFUAFieldRow) && returnedFUAFieldRow.length === 0){
            return null;
        } 

        return returnedFUAFieldRow;
    };
};

export default new FUAFieldRowService();
