import {z} from "zod";

import FUAFieldImplementation from "../implementation/sequelize/FUAFieldImplementation";
import { isValidUUIDv4 } from "../utils/utils";
import FUASectionService from "./FUASectionService";


// Schemas
const newFUASFieldSchema = z.object({
    // Field Data
    label: z.string(), 
    showLabel: z.string(),
    labelOrientation: z.string(),
    labelPosition: z.string(),
    valueType: z.string(),
    orientation: z.string(),
    codeName: z.string(),
    version: z.string(),    
    // Section Data
    FUASection: z.string().or(z.number().int().positive() ),
    // Audit Data
    createdBy: z.string(),
});


class FUAFieldService {

    // Creation of FUA Page
    async create(data: any) {
        
        // Object validation
        const result = newFUASFieldSchema.safeParse(data);
        if( !result.success ){
            console.error('Error in FUAField Service - createFUAField: ZOD validation. \n', result.error);
            const newError = new Error('Error in FUAField Service - createFUAField: ZOD validation. ');
            (newError as any).details = result.error;
            throw newError;
        }

        // Check if FUA Section exists
        let auxFUASection = null;

        try {
            auxFUASection = await FUASectionService.getByIdOrUUID( data.FUASection.toString() );
        } catch (error: unknown) {
            console.error(`Error in FUA Field Service: Couldnt search FUA Field by Id or UUID '${data.FUAFormat}' sent in database using Sequelize. `, error);
            (error as Error).message =  `Error in FUA Field Service: Couldnt search FUA Field by Id or UUID  '${data.FUAFormat}' sent in database using Sequelize. ` + (error as Error).message;
            throw error;
        }
        // Check if a FUA Format wanst found
        if(auxFUASection === null){
            // In case a FUA Format wasnt found
            console.error(`Error in FUA Field Service: Couldnt found FUA Field by Id or UUID '${data.FUAFormat}' sent in database using Sequelize. `);
            throw new Error(`Error in FUA Field Service: Couldnt found FUA Field by Id or UUID '${data.FUAFormat}' sent in database using Sequelize. `);
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
                FUASectionId: FUASectionId,
                createdBy: data.createdBy,
            });
        } catch (err: unknown){
            console.error(`Error in FUA Field service:  `, err);
            throw new Error(`Error in FUA Field service:  ` + (err as Error).message);
        }        

        return {
            uuid: returnedFUAField.uuid
        };
    }

    // List all FUA Pages
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

    // get FUA Section by Id (Id or UUID)
    async getByIdOrUUID (idReceived: string) {
        let returnedFUAField = null;

        // Check if UUID or Id was sent
        let id = null;
        const nuNumber = Number(idReceived);
        if( Number.isInteger(nuNumber) ){
            id = nuNumber;

            try {
                returnedFUAField = await FUAFieldImplementation.getByIdSequelize(id);

            } catch (err: unknown){
                console.error('Error in FUA Field Service: ', err);
                (err as Error).message =  'Error in FUA Field Service: ' + (err as Error).message;
                throw err;
            }     
        }else{
            // Get id by UUID

            //Validate UUID Format        
            if (!isValidUUIDv4(idReceived) ) {
                console.error('Error in FUA Field Service: Invalid UUID format. ');
                throw new Error("Error in FUA Field Service: Invalid UUID format. ");
            }
            try {

                returnedFUAField = await FUAFieldImplementation.getByUUIDSequelize(idReceived);

            } catch (err: unknown){
                console.error('Error in FUASection Service: ', err);
                (err as Error).message =  'Error in FUASection Service: ' + (err as Error).message;
                throw err;
            }
            
        }      
            
        // If nothing was found, it will return a []
        if( Array.isArray(returnedFUAField) && returnedFUAField.length === 0){
            return null;
        } 

        return returnedFUAField;
    };
};

export default new FUAFieldService();
