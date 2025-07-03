import {z} from "zod";

import FUAFieldColumnImplementation from "../implementation/sequelize/FUAFieldColumnImplementation";
import { isValidUUIDv4 } from "../utils/utils";
import { FUAField } from "../modelsSequelize";
import FUAFieldRowService from "./FUAFieldRowService";


// Schemas
const newFUAFieldColumnSchema = z.object({
    // Field Column Data
    label: z.string(), 
    showLabel: z.string(),
    valueType: z.string(),
    codeName: z.string(),
    version: z.string(),   
    columnIndex: z.number().int().positive(), 
    // Field Data
    FUAFieldId: z.string().or(z.number().int().positive() ),
    // Audit Data
    createdBy: z.string(),
});


class FUAFieldColumnService {

    // Creation of FUA Column Column
    async create(data: any) {
        
        // Object validation
        const result = newFUAFieldColumnSchema.safeParse(data);
        if( !result.success ){
            console.error('Error in FUA Field Column Service - create: ZOD validation. \n', result.error);
            const newError = new Error('Error in FUA Field Column Service - create: ZOD validation. ');
            (newError as any).details = result.error;
            throw newError;
        }

        // Check if FUA Section exists
        let auxFUAField = null;

        try {
            auxFUAField = await FUAField.getByIdOrUUID( data.FUAFieldId.toString() );
        } catch (error: unknown) {
            console.error(`Error in FUA Field Column Service - getByIdOrUUID: Couldnt search FUA Field by Id or UUID '${data.FUAFormat}' sent in database using Sequelize. `, error);
            (error as Error).message =  `Error in FUA Field column Service - getByIdOrUUID: Couldnt search FUA Field by Id or UUID  '${data.FUAFormat}' sent in database using Sequelize. ` + (error as Error).message;
            throw error;
        }
        // Check if a FUA Field wanst found
        if(auxFUAField === null){
            // In case a FUA Field wasnt found
            console.error(`Error in FUA Field Column Service: Couldnt found FUA Field Column by Id or UUID '${data.FUAFormat}' sent in database using Sequelize. `);
            throw new Error(`Error in FUA Field Column Service: Couldnt found FUA Field Column by Id or UUID '${data.FUAFormat}' sent in database using Sequelize. `);
        }

        let FUAFieldId = auxFUAField.id;

        // Send data to create  
        let returnedFUAFieldColumn = null;

        try {
            returnedFUAFieldColumn = await FUAFieldColumnImplementation.createSequelize({
                label: data.label,
                showLabel: data.showLabel,
                valueType: data.valueType,
                codeName: data.codeName,
                version: data.version,
                columnIndex: data.columnIndex,
                FUAFieldId: FUAFieldId,
                createdBy: data.createdBy,
            });
        } catch (err: unknown){
            console.error(`Error in FUA Field Column service - create:  `, err);
            throw new Error(`Error in FUA Field Column service - create:  ` + (err as Error).message);
        }        

        return {
            uuid: returnedFUAFieldColumn.uuid
        };
    }

    // List all FUA Columns
    async listAll( ){
        let returnedFUAFieldColumns = [];
        try {
            returnedFUAFieldColumns = await FUAFieldColumnImplementation.listAllSequelize();

        } catch (err: unknown){
            console.error('Error in FUA Field Column Service - listAll: ', err);
            (err as Error).message =  'Error in FUASection Service - listAll: ' + (err as Error).message;
            throw err;
        }        

        return returnedFUAFieldColumns;
    };

    // Get FUA Field Column by Id (Id or UUID)
    async getByIdOrUUID (idReceived: string) {
        let returnedFUAFieldColumn = null;
        // Check if UUID or Id was sent
        const nuNumber = Number(idReceived);
        if( Number.isInteger(nuNumber) ){
            try {
                returnedFUAFieldColumn = await FUAFieldColumnImplementation.getByIdSequelize(nuNumber);
            } catch (err: unknown){
                console.error('Error in FUA Field Column Service - getByIdOrUUID: ', err);
                (err as Error).message =  'Error in FUA Field Column Service - getByIdOrUUID: ' + (err as Error).message;
                throw err;
            }     
        }else{
            // Get id by UUID
            //Validate UUID Format        
            if (!isValidUUIDv4(idReceived) ) {
                console.error('Error in FUA Field Column Service - getByIdOrUUID: Invalid UUID format. ');
                throw new Error("Error in FUA Field Column Service - getByIdOrUUID: Invalid UUID format. ");
            }
            try {
                returnedFUAFieldColumn = await FUAFieldColumnImplementation.getByUUIDSequelize(idReceived);
            } catch (err: unknown){
                console.error('Error in FUA Field Column Service - getByIdOrUUID: ', err);
                (err as Error).message =  'Error in FUA Field Column Service - getByIdOrUUID: ' + (err as Error).message;
                throw err;
            }
            
        }      
            
        return returnedFUAFieldColumn;
    };

    // Get list by FUA Field Identifier (Id or UUID)
    async getListByFUAFieldIdOrUUID (idReceived: string) {
        let returnedFUAFieldColumns = [];
        try{
            // Not null or empty string validation
            if (!idReceived?.trim()) throw new Error('Error in FUA Field Column Service - getListByFUAFieldIdOrUUID:  Identifier could not be empty or null. ');
            
            // Check if UUID or Id was sent
            const nuNumber = Number(idReceived);
            
            if( Number.isInteger(nuNumber) && nuNumber > 0 ){
                returnedFUAFieldColumns = await FUAFieldColumnImplementation.getListByFUAFieldIdSequelize(nuNumber);
            }else{
                //Validate UUID
                if (!isValidUUIDv4(idReceived) ) {
                    console.error('Error in FUA Field Column Service - getListByFUAFieldIdOrUUID: Invalid UUID format. ');
                    throw new Error("Error in FUA Field Column Service - getListByFUAFieldIdOrUUID: Invalid UUID format. ");
                }
                
                // Get FUA Format Id
                const auxFUAFieldColumn: any = await this.getByIdOrUUID(idReceived);

                returnedFUAFieldColumns = await FUAFieldColumnImplementation.getListByFUAFieldIdSequelize(auxFUAFieldColumn.id);
            }
        }catch(err: unknown){
            console.error('Error in FUA Field Column Service - getListByFUAFieldIdOrUUID: ', err);
            (err as Error).message =  'Error in FUA Field Column Service - getListByFUAFieldIdOrUUID: ' + (err as Error).message;
            throw err;
        }       
        
        return returnedFUAFieldColumns;
    };

    

};

export default new FUAFieldColumnService();
