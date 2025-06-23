import {z} from "zod";

import FUASectionImplementation from "../implementation/sequelize/FUASectionImplementation";
import { isValidUUIDv4 } from "../utils/utils";
import FUAPageService from "./FUAPageService";

// Schemas

const newFUASectionSchema = z.object({
    // Page Data
    title: z.string(), 
    showTitle: z.boolean(),
    codeName: z.string(),
    version: z.string(),    
    titleHeight: z.number().positive(),
    bodyHeight: z.number().positive(),
    //Page Data
    FUAPageId: z.string().or(z.number().int().positive() ),
    // Audit Data
    createdBy: z.string(),
});


class FUASectionService {

    // Creation of FUA Section
    async create(data: {
            // Page Data
            title: string;
            showTitle: boolean;
            codeName: string;
            version: string;
            titleHeight: number;
            bodyHeight: number;
            // Page ID
            FUAPageId: string | number;
            // Audit Data
            createdBy: string;
        }) {
        
        // Object validation
        const result = newFUASectionSchema.safeParse(data);
        if( !result.success ){
            console.error('Error in FUA Section Service - create: ZOD validation. \n', result.error);
            const newError = new Error('Error in FUA Section Service - create: ZOD validation. ');
            (newError as any).details = result.error;
            throw newError;
        }

        // Check if FUA Section exists
        let auxFUAPage = null;

        try {
            auxFUAPage = await FUAPageService.getByIdOrUUID( data.FUAPageId.toString() );
        } catch (error: unknown) {
            console.error(`Error in FUA Section Service - create: Couldnt search FUA Page by Id or UUID '${data.FUAPageId}' sent in database using Sequelize. `, error);
            (error as Error).message =  `Error in FUA Section Service - create: Couldnt search FUA Format by Id or UUID  '${data.FUAPageId}' sent in database using Sequelize. ` + (error as Error).message;
            throw error;
        }
        // Check if a FUA Format wanst found
        if(auxFUAPage === null){
            // In case a FUA Format wasnt found
            console.error(`Error in FUA Section Service: Couldnt found FUA Page by Id or UUID '${data.FUAPageId.toString()}' sent in database using Sequelize. `);
            throw new Error(`Error in FUA Section Service: Couldnt found FUA Page by Id or UUID '${data.FUAPageId.toString()}' sent in database using Sequelize. `);
        }

        // Pending to check nextPage and previousPage
        
        let FUAPageId = auxFUAPage.id;

        // Send data to create  
        let returnedFUASection = null;

        try {
            returnedFUASection = await FUASectionImplementation.createSequelize({
                title: data.title,
                showTitle: data.showTitle,
                codeName: data.codeName,
                version: data.version,
                titleHeight: data.titleHeight,
                bodyHeight: data.bodyHeight,
                FUAPageId: FUAPageId,
                createdBy: data.createdBy,
            });
        } catch (err: unknown){
            console.error(`Error in FUAPage service:  `, err);
            throw new Error(`Error in FUAPage service:  ` + (err as Error).message);
        }        

        return {
            uuid: returnedFUASection.uuid
        };
    }

    // List all FUA Pages
    async listAll( ){
        let returnedFUASections = [];
        try {
            returnedFUASections = await FUASectionImplementation.listAllSequelize();

        } catch (err: unknown){
            console.error('Error in FUASection Service: ', err);
            (err as Error).message =  'Error in FUASection Service: ' + (err as Error).message;
            throw err;
        }        

        return returnedFUASections;
    };

    // get FUA Section by Id (Id or UUID)
    async getByIdOrUUID (idReceived: string) {
        let returnedFUASection = null;

        // Check if UUID or Id was sent
        let id = null;
        const nuNumber = Number(idReceived);
        if( Number.isInteger(nuNumber) ){
            id = nuNumber;

            try {
                returnedFUASection = await FUASectionImplementation.getByIdSequelize(id);

            } catch (err: unknown){
                console.error('Error in FUA Section Service - getByIdOrUUID: ', err);
                (err as Error).message =  'Error in FUASection Service - getByIdOrUUID: ' + (err as Error).message;
                throw err;
            }     
        }else{
            // Get id by UUID

            //Validate UUID Format        
            if (!isValidUUIDv4(idReceived) ) {
                console.error('Error in FUASection Service - getByIdOrUUID: Invalid UUID format. ');
                throw new Error("Error in FUASection Service - getByIdOrUUID: Invalid UUID format. ");
            }
            try {

                returnedFUASection = await FUASectionImplementation.getByUUIDSequelize(idReceived);

            } catch (err: unknown){
                console.error('Error in FUA Section Service - getByIdOrUUID: ', err);
                (err as Error).message =  'Error in FUASection Service - getByIdOrUUID: ' + (err as Error).message;
                throw err;
            }
            
        }      
            
        // If nothing was found, it will return a null
        return returnedFUASection;
    };

    // Get FUA Fields by Id 
    async getFUAFieldsById( idReceived: number ) {

        let returnedFUASections = [];
        
        try {
            returnedFUASections = await FUASectionImplementation.getFUAFieldsByIdSequelize(idReceived);
        } catch (err: unknown){
            console.error('Error in FUA Fields Service - getFUAFieldsById: ', err);
            (err as Error).message =  'Error in FUA Fields Service - getFUAFieldsById: ' + (err as Error).message;
            throw err;
        }

        return returnedFUASections;
    };
};

export default new FUASectionService();
