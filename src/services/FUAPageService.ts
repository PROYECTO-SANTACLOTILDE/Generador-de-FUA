import {z} from "zod";

import FUAPageImplementation from "../implementation/sequelize/FUAPageImplementation";
import { isValidUUIDv4 } from "../utils/utils";
import FUAFormatService from "./FUAFormatService";

// Schemas

const newFUAPageFormatSchema = z.object({
    // Page Data
    title: z.string(), 
    codeName: z.string(),
    version: z.string(),
    pageNumber: z.number().int().positive(),
    nextPage: z.string().or(z.number().int().positive() ).optional(),
    previousPage: z.string().or(z.number().int().positive() ).optional(),
    //Format Data
    FUAFormatId: z.string().or(z.number().int().positive() ),
    // Audit Data
    createdBy: z.string(),
});


class FUAPageService {

    // Creation of FUA Page
    async create(data: any) {
        
        // Object validation
        const result = newFUAPageFormatSchema.safeParse(data);
        if( !result.success ){
            console.error('Error in FUAPAge Service - createFUAPage: ZOD validation. \n', result.error);
            const newError = new Error('Error in FUAPAge Service - createFUAPage: ZOD validation. ');
            (newError as any).details = result.error;
            throw newError;
        }

        // Check if FUA Format exists
        let auxFUAFormat = null;

        try {
            auxFUAFormat = await FUAFormatService.getByIdOrUUID( data.FUAFormatId.toString() );
        } catch (error: unknown) {
            console.error(`Error in FUA Page Service: Couldnt search FUA Format by Id or UUID '${data.FUAFormat.FUAFormatId}' sent in database using Sequelize. `, error);
            (error as Error).message =  `Error in FUA Page Service: Couldnt search FUA Format by Id or UUID  '${data.FUAFormat.FUAFormatId}' sent in database using Sequelize. ` + (error as Error).message;
            throw error;
        }
        // Check if a FUA Format wanst found
        if(auxFUAFormat === null){
            // In case a FUA Format wasnt found
            console.error(`Error in FUA Page Service: Couldnt found FUA Format by Id or UUID '${data.FUAFormat}' sent in database using Sequelize. `);
            throw new Error(`Error in FUA Page Service: Couldnt found FUA Format by Id or UUID '${data.FUAFormat}' sent in database using Sequelize. `);
        }

        // Pending to check nextPage and previousPage
        
        let FUAFormatId = auxFUAFormat[0].id;

        // Send data to create  
        let returnedFUAPage = null;
        console.log("ID OF FORMAT: ",auxFUAFormat)
        try {
            returnedFUAPage = await FUAPageImplementation.createFUAPageSequelize({
                title: data.title,
                codeName: data.codeName,
                version: data.version,
                pageNumber: data.pageNumber,
                nextPage: data.nextPage,
                previousPage: data.previousPage,
                FUAFormatId: FUAFormatId,
                createdBy: data.createdBy,
            });
        } catch (err: unknown){
            console.error(`Error in FUAPage service:  `, err);
            throw new Error(`Error in FUAPage service:  ` + (err as Error).message);
        }        

        return {
            uuid: returnedFUAPage.uuid
        };
    }

    // List all FUA Pages
    async listAll( ){
        let returnedFUAPages = [];
        try {
            returnedFUAPages = await FUAPageImplementation.listAllFUAPagesSequelize();

        } catch (err: unknown){
            console.error('Error in FUAFormat Service: ', err);
            (err as Error).message =  'Error in FUAFormat Service: ' + (err as Error).message;
            throw err;
        }        

        return returnedFUAPages;
    };

    // Get FUA Page by Id (Id or UUID)
    async getByIdOrUUID (idReceived: string) {
        let returnedFUAPage = null;

        // Check if UUID or Id was sent
        let id = null;
        const nuNumber = Number(idReceived);
        if( Number.isInteger(nuNumber) ){
            id = nuNumber;

            try {
                returnedFUAPage = await FUAPageImplementation.getFUAPageByIdSequelize(id);

            } catch (err: unknown){
                console.error('Error in FUAPage Service: ', err);
                (err as Error).message =  'Error in FUAPage Service: ' + (err as Error).message;
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

                returnedFUAPage = await FUAPageImplementation.getFUAPageByUUIDSequelize(idReceived);

            } catch (err: unknown){
                console.error('Error in FUAFormat Service: ', err);
                (err as Error).message =  'Error in FUAFormat Service: ' + (err as Error).message;
                throw err;
            }
            
        }      
            
        // If nothing was found, it will return a []
        if( Array.isArray(returnedFUAPage) && returnedFUAPage.length === 0){
            return null;
        } 

        return returnedFUAPage;
    };

    // Get FUA Sections by Id or UUID
    async getFUASectionsByIdOrUUID( idReceived: string ) {
        // Get FUA Page Id or UUID
        let auxFUAPage = null;
        try {
            auxFUAPage = await this.getByIdOrUUID(idReceived);
        } catch (err: unknown){
            console.error('Error in FUA Page Service - getFUAPagesByIdOrUUID: ', err);    
            (err as Error).message =  'Error in FUA Page Service - getFUAPagesByIdOrUUID: ' + (err as Error).message;
            throw err;  
        }

        // If nothing was found, it will return a []
        if( Array.isArray(auxFUAPage) && auxFUAPage.length === 0){
            console.error(`Error in FUA Format Service - getFUAPagesByIdOrUUID: Couldnt found FUA Format identified by Id "${idReceived}". `);
            throw new Error(`Error in FUA Format Service - getFUAPagesByIdOrUUID: Couldnt found FUA Format identified by Id "${idReceived}". `);
        }

        auxFUAPage = auxFUAPage[0]; // Get the first element, since it is an array

        let returnedFUASections = [];
        
        try {
            returnedFUASections = await FUAPageImplementation.getFUASectionsByIdSequelize(auxFUAPage.id);
        } catch (err: unknown){
            console.error('Error in FUA Page Service - getFUASectionsByIdOrUUID: ', err);
            (err as Error).message =  'Error in FUA Page Service - getFUASectionsByIdOrUUID: ' + (err as Error).message;
            throw err;
        }

        return returnedFUASections;
    }
};

export default new FUAPageService();
