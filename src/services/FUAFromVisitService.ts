import {z} from "zod";

import { isValidUUIDv4 } from "../utils/utils";
import FUAFromVisitImplementation from "../implementation/sequelize/FUAFromVisitImplementation";
import FUAFormatFromSchemaService from "./FUAFormatFromSchemaService";
import BaseEntityVersionService from "./BaseEntityVersionService";
import BaseEntity from "../modelsTypeScript/BaseEntity";
import { Version_Actions } from "../utils/VersionConstants";


// Schemas
const newFUAFromVisitSchema = z.object({
    // FUA Data, checksum not needed
    payload: z.string(), 
    schemaType: z.string(),    
    // Audit Data
    outputType: z.string(),
    FUAFormatFromSchemaId: z.string(),
    createdBy: z.string()
});


class FUAFromVisitService {

    // Creation of FUA Field
    async create(data: {
        // FUAFromVisit Data
        payload: string; 
        schemaType: string;
        outputType: string;
        // FUAFormatFromSchema Identifier
        FUAFormatFromSchemaId: string;
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

        // Check if FUAFormatFromSchema exists
        let auxFUAFormat = null;
        try {
            auxFUAFormat = await FUAFormatFromSchemaService.getByIdOrUUID(data.FUAFormatFromSchemaId);
        }catch(err: any){
            console.error(`Error in FUA From Visit service - create - consultinf Format:  `, err);
            throw new Error(`Error in FUA From Visit service - create- consultinf Format:  ` + (err as Error).message);
        }

        if(auxFUAFormat == null){
            // FUAFromat sent doesnt exist
            const newError = new Error(`Error in FUA From Visit Service - create: FUAFormat identified with ${data.FUAFormatFromSchemaId} doesnt exist. `);
            throw newError;
        }

        // Send data to create  
        let returnedFUA = null;

        // TODO: update with a new fucntion in case of the putputType sent
        // Auxiliar file
        // Example: save a blob
        const buffer = Buffer.from('Hello, I am stored as a blob!');

        try {
            returnedFUA = await FUAFromVisitImplementation.createSequelize({
                payload: data.payload,
                schemaType: data.schemaType,
                outputType: data.outputType,
                output: buffer,
                FUAFormatFromSchemaId: auxFUAFormat.id,
                // Audit Data
                createdBy: data.createdBy,
            });
        } catch (err: unknown){
            console.error(`Error in FUA From Visit service - create:  `, err);
            throw new Error(`Error in FUA From Visit service - create:  ` + (err as Error).message);
        }
        
        // Insert version
        try{
            let newVersion = await BaseEntityVersionService.create(
                new BaseEntity(returnedFUA.dataValues),
                "FUAFormatFromSchema",
                Version_Actions.CREATE,
                [ {
                    type: "FUAFormatFromSchema",
                    uuid: auxFUAFormat.uuid
                } ]
            );
        }catch(error: any){
            (error as Error).message =  'Error in FUA Format From Schema Service:  ' + (error as Error).message;
            throw error;
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
