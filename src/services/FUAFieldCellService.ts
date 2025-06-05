import {z} from "zod";

import { isValidUUIDv4 } from "../utils/utils";
import FUAFieldRowService from "./FUAFieldRowService";
import FUAFieldCellImplementation from "../implementation/sequelize/FUAFieldCellImplementation";


// Schemas
const newFUAFieldCellSchema = z.object({
    // Field Row Data
    label: z.string(), 
    showLabel: z.string(),
    valueType: z.string(),
    codeName: z.string(),
    version: z.string(),   
    colSpan: z.number().int().min(0), 
    rowIndex: z.number().int().positive(),
    // Field Data
    FUAFieldRowId: z.string().or(z.number().int().positive() ),
    // Audit Data
    createdBy: z.string(),
});


class FUAFieldCellService {

    // Creation of FUA Field Cell
    async create(data: any) {
        
        // Object validation
        const result = newFUAFieldCellSchema.safeParse(data);
        if( !result.success ){
            console.error('Error in FUA Field Cell Service - create: ZOD validation. \n', result.error);
            const newError = new Error('Error in FUA Field Cell Service - create: ZOD validation. ');
            (newError as any).details = result.error;
            throw newError;
        }

        // Check if FUA Field Cell exists
        let auxFUARow = null;

        try {
            auxFUARow = await FUAFieldRowService.getByIdOrUUID( data.FUAFieldRowId.toString() );
        } catch (error: unknown) {
            console.error(`Error in FUA Field Cell Service - create: Couldnt search FUA Field Row by Id or UUID '${data.FUAFormat}'. `, error);
            (error as Error).message =  `Error in FUA Field Cell Service - create: Couldnt search FUA Field Row by Id or UUID  '${data.FUAFormat}'. ` + (error as Error).message;
            throw error;
        }
        // Check if a FUA Field Cell wanst found
        if(auxFUARow === null){
            // In case a FUA Field Row wasnt found
            console.error(`Error in FUA Field Cell Service - create: Couldnt found FUA Field Row by Id or UUID '${data.FUAFormat}'. `);
            throw new Error(`Error in FUA Field Cell Service - create: Couldnt found FUA Field Row by Id or UUID '${data.FUAFormat}'. `);
        }

        let FUAFieldRowId = auxFUARow[0].id;

        // Send data to create  
        let returnedFUAFieldRow = null;

        try {
            returnedFUAFieldRow = await FUAFieldCellImplementation.createSequelize({
                label: data.label,
                showLabel: data.showLabel,
                valueType: data.valueType,
                codeName: data.codeName,
                version: data.version,
                colSpan: data.colSpan,
                rowSpan: data.colSpan,
                FUAFieldRowId: FUAFieldRowId,
                createdBy: data.createdBy,
            });
        } catch (err: unknown){
            console.error(`Error in FUA Field Cell service - create:  `, err);
            throw new Error(`Error in FUA Field Cell service - create:  ` + (err as Error).message);
        }        

        return {
            uuid: returnedFUAFieldRow.uuid
        };
    }

    // List all FUA Field Cells
    async listAll( ){
        let returnedFUAFieldCells = [];
        try {
            returnedFUAFieldCells = await FUAFieldCellImplementation.listAllSequelize();

        } catch (err: unknown){
            console.error('Error in FUA Field Cell Service - listAll: ', err);
            (err as Error).message =  'Error in Cell Field Row Service - listAll: ' + (err as Error).message;
            throw err;
        }        

        return returnedFUAFieldCells;
    };

    // get FUA Field Cell by Id (Id or UUID)
    async getByIdOrUUID (idReceived: string) {
        let returnedFUAFieldCell = null;

        // Check if UUID or Id was sent
        let id = null;
        const nuNumber = Number(idReceived);
        if( Number.isInteger(nuNumber) ){
            id = nuNumber;

            try {
                returnedFUAFieldCell = await FUAFieldCellImplementation.getByIdSequelize(id);

            } catch (err: unknown){
                console.error('Error in FUA Field Cell Service - getByIdOrUUID: ', err);
                (err as Error).message =  'Error in FUA Field Cell Service - getByIdOrUUID: ' + (err as Error).message;
                throw err;
            }     
        }else{
            // Get id by UUID

            //Validate UUID Format        
            if (!isValidUUIDv4(idReceived) ) {
                console.error('Error in FUA Field Cell Service - getByIdOrUUID: Invalid UUID format. ');
                throw new Error("Error in FUA Field Cell Service - getByIdOrUUID: Invalid UUID format. ");
            }
            try {

                returnedFUAFieldCell = await FUAFieldCellImplementation.getByUUIDSequelize(idReceived);

            } catch (err: unknown){
                console.error('Error in FUA Field Cell Service: ', err);
                (err as Error).message =  'Error in FUA Field Cell Service: ' + (err as Error).message;
                throw err;
            }
            
        }      
            
        // If nothing was found, it will return a []
        if( Array.isArray(returnedFUAFieldCell) && returnedFUAFieldCell.length === 0){
            return null;
        } 

        return returnedFUAFieldCell;
    };
};

export default new FUAFieldCellService();
