import {z} from "zod";

import FUAFieldImplementation from "../implementation/sequelize/FUAFieldImplementation";
import { isValidUUIDv4 } from "../utils/utils";
import FUASectionService from "./FUASectionService";
import FUAFieldColumnService from "./FUAFieldColumnService";



// Schemas
const newFUAFieldSchema = z.object({
    // Field Data
    label: z.string(), 
    showLabel: z.boolean(),
    labelOrientation: z.string(),
    labelPosition: z.string(),
    valueType: z.string(),
    orientation: z.string(),
    codeName: z.string(),
    version: z.string(),    
    bodyHeight: z.number().positive(),
    bodyWidth: z.number().positive(),
    top: z.number().nonnegative(),
    left: z.number().nonnegative(),
    labelSize: z.number().positive(),
    // Section Data
    FUASectionId: z.string().or(z.number().int().positive() ),
    // Audit Data
    createdBy: z.string(),
});


class FUAFieldService {

    // Creation of FUA Field
    async create(data: {
        // Field Data
        label: string;
        showLabel: boolean;
        labelOrientation: string;
        labelPosition: string;
        valueType: string;
        orientation: string;
        codeName: string;
        version: string;
        bodyHeight: number;
        bodyWidth: number;
        top: number;
        left: number;
        labelSize: number;
        // Section Data
        FUASectionId: string | number;
        // Audit Data
        createdBy: string;
    }) {
        
        // Object validation
        const result = newFUAFieldSchema.safeParse(data);
        if( !result.success ){
            console.error('Error in FUAField Service - create: ZOD validation. \n', result.error);
            const newError = new Error('Error in FUAField Service - create: ZOD validation. ');
            (newError as any).details = result.error;
            throw newError;
        }

        // Check if FUA Section exists
        let auxFUASection = null;

        try {
            auxFUASection = await FUASectionService.getByIdOrUUID( data.FUASectionId.toString() );
        } catch (error: unknown) {
            console.error(`Error in FUA Field Service - create: Couldnt search FUA Section by Id or UUID '${data.FUASectionId.toString()}' sent in database using Sequelize. `, error);
            (error as Error).message =  `Error in FUA Field Service - create: Couldnt search FUA Section by Id or UUID  '${data.FUASectionId.toString()}' sent in database using Sequelize. ` + (error as Error).message;
            throw error;
        }
        // Check if a FUA Format wanst found
        if(auxFUASection === null){
            // In case a FUA Format wasnt found
            console.error(`Error in FUA Field Service - create: Couldnt found FUA Section by Id or UUID '${data.FUASectionId.toString()}' sent in database using Sequelize. `);
            throw new Error(`Error in FUA Field Service - create: Couldnt found FUA Section by Id or UUID '${data.FUASectionId.toString()}' sent in database using Sequelize. `);
        }

        // Pending to check nextPage and previousPage
        
        let FUASectionId = auxFUASection[0].id;

        // Send data to create  
        let returnedFUAField = null;

        try {
            returnedFUAField = await FUAFieldImplementation.createSequelize({
                label: data.label,
                showLabel: data.showLabel,
                labelOrientation: data.labelOrientation,
                labelPosition: data.labelPosition,
                valueType: data.valueType,
                orientation: data.orientation,
                codeName: data.codeName,
                version: data.version,
                bodyHeight: data.bodyHeight,
                bodyWidth: data.bodyWidth,
                top: data.top,
                left: data.left,
                labelSize: data.labelSize,
                FUASectionId: FUASectionId,
                createdBy: data.createdBy,
            });
        } catch (err: unknown){
            console.error(`Error in FUA Field service - create:  `, err);
            throw new Error(`Error in FUA Field service - create:  ` + (err as Error).message);
        }        

        return {
            uuid: returnedFUAField.uuid
        };
    }

    // List all FUA Fields
    async listAll( ){
        let returnedFUAFields = [];
        try {
            returnedFUAFields = await FUAFieldImplementation.listAllSequelize();

        } catch (err: unknown){
            console.error('Error in FUASection Service: ', err);
            (err as Error).message =  'Error in FUASection Service: ' + (err as Error).message;
            throw err;
        }        

        return returnedFUAFields;
    };

    // Get list by Id (Id or UUID)
    async getListByFUAFormatIdOrUUID (idReceived: string) {
        let returnedFUAFields = [];
        // Check if UUID or Id was sent
        let id = null;
        const nuNumber = Number(idReceived);
        if( Number.isInteger(nuNumber) ){
            id = nuNumber;
            try {
                returnedFUAFields = await FUAFieldImplementation.getListByFUAFormatId(id);
            } catch (err: unknown){
                console.error('Error in FUA Field Service - getListByFUAFormatIdOrUUID: ', err);
                (err as Error).message =  'Error in FUA Field Service - getListByFUAFormatIdOrUUID: ' + (err as Error).message;
                throw err;
            }     
        }else{
            // Get id by UUID

            //Validate UUID Format        
            if (!isValidUUIDv4(idReceived) ) {
                console.error('Error in FUA Field Service - getListByFUAFormatIdOrUUID: Invalid UUID format. ');
                throw new Error("Error in FUA Field Service - getListByFUAFormatIdOrUUID: Invalid UUID format. ");
            }
            try {
                returnedFUAFields = await FUAFieldImplementation.getListByFUAFormatUUID(idReceived);
            } catch (err: unknown){
                console.error('Error in FUA Field Service Service - getByIdOrUUID: ', err);
                (err as Error).message =  'Error in FUA Field Service Service - getByIdOrUUID: ' + (err as Error).message;
                throw err;
            }            
        }                  
        // If nothing was found, it will return a null
        return returnedFUAFields;
    };
        
};

export default new FUAFieldService();
