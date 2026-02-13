import BaseEntity from "../modelsTypeScript/BaseEntity";

import FUAFromVisitPDFImplementation from "../implementation/sequelize/FUAFromVisitPDFImplementation";
import BaseEntityVersionService from "./BaseEntityVersionService";
import { Version_Actions } from "../utils/VersionConstants";
import FUAFromVisitService from "./FUAFromVisitService";
import { isValidUUIDv4 } from "../utils/utils";
import {z} from "zod";
import FUAFormat from "../modelsTypeScript/FUAFormat";
import * as path from 'path';
import { importPayloadToMapping } from "../utils/mappingUtils";


const newFUAFromVisitPDFSchema = z.object({
    name: z.string(),
    fileData: z.instanceof(Buffer),
    versionTag: z.string().optional(),
    versionCounter: z.number().int().positive().optional(),
    FUAFromVisitModelId: z.number().int().positive(),
    BaseEntityVersionModelId: z.string().or(z.number().int().positive()),
    createdBy: z.string()
})


class FUAFromVisitPDFService {

    async create(data: {
            name: string;
            fileData: Buffer;
            versionTag?: string;
            versionCounter? : number;
            FUAFromVisitModelId: number;
            BaseEntityVersionModelId: string | number;
            createdBy: string;
        }
    ){
        //Object validation
        const result = newFUAFromVisitPDFSchema.safeParse(data);
        if( !result.success ){
            console.error('Error in FUAFromVisitPDF Service - createFUAPage: ZOD validation. \n', result.error);
            const newError = new Error('Error in FUAFromVisitPDF Service - create: ZOD validation. ');
            (newError as any).details = result.error;
            throw newError;
        }        

        // Check if FUAFormatFromVisitModel exists
        let auxFUAFromVisit = null;
        try {
            auxFUAFromVisit = await FUAFromVisitService.getByIdOrUUID(data.FUAFromVisitModelId.toString());
        }catch(err: any){
            console.error(`Error in FUA From Visit PDF service - create - consultinf FormatFromVisit:  `, err);
            throw new Error(`Error in FUA From Visit PDF service - create- consultinf FormatFromVisit:  ` + (err as Error).message);
        }
        if(auxFUAFromVisit == null){
            // FUAFromVisit sent doesnt exist
            const newError = new Error(`Error in FUA From Visit PDF Service - create: FUAFromVisit identified with ${data.FUAFromVisitModelId} doesnt exist. `);
            throw newError;
        }

        let auxBaseEntityVersion = null;
        try {
            auxBaseEntityVersion = await BaseEntityVersionService.getByIdOrUUID({id: data.BaseEntityVersionModelId.toString(), type: "FUAFromVisit"});
        }catch(err: any){
            console.error(`Error in FUA From Visit PDF service - create - consultinf FormatFromVisit:  `, err);
            throw new Error(`Error in FUA From Visit PDF service - create- consultinf FormatFromVisit:  ` + (err as Error).message);
        }
        if(auxBaseEntityVersion == null){
            // auxBaseEntityVersion sent doesnt exist
            const newError = new Error(`Error in FUA From Visit PDF Service - create: BaseEntityVersion identified with ${data.FUAFromVisitModelId} doesnt exist. `);
            throw newError;
        }
           
        let newData = {
            name: data.name,
            fileData: data.fileData,
            versionTag: data.versionTag ?? "1.0",
            versionCounter: data.versionCounter ?? 1,
            FUAFromVisitModelId: data.FUAFromVisitModelId,
            BaseEntityVersionModelId: auxBaseEntityVersion.id,
            createdBy: data.createdBy
        }

        let returnedPDF = null;
        try{
            returnedPDF = await FUAFromVisitPDFImplementation.createSequelize(newData);
        } catch (err: unknown){
            console.error(`Error in FUA From Visit service - create:  `, err);
            throw new Error(`Error in FUA From Visit service - create:  ` + (err as Error).message);
        }  

        //Create version 
        try{
            let newVersion = await BaseEntityVersionService.create(
                new BaseEntity(returnedPDF.dataValues),
                "FUAFromVisitPDF",
                Version_Actions.CREATE,
                [ {
                    type: "FUAFromVisit",
                    uuid: auxFUAFromVisit.uuid
                } ]
            );
        }catch(error: any){
            (error as Error).message =  'Error in FUA From Visit Service:  ' + (error as Error).message;
            throw error;
        }

        return {
            uuid: returnedPDF.uuid
        };
    }

    async getByIdOrUUID (idReceived: string){
        let returnedFUAFromVisitPDF = null;

        let id = null;
        const nuNumber = Number(idReceived);
        if (Number.isInteger(nuNumber)){
            id = nuNumber;

            try{
                returnedFUAFromVisitPDF = await FUAFromVisitPDFImplementation.getByIdSequelize(id);

            } catch (err: unknown){
                console.error('Error in FUA From Visit PDF Service - getByIdOrUUID: ', err);
                (err as Error).message =  'Error in FUA From Visit PDF Service - getByIdOrUUID: ' + (err as Error).message;
                throw err;
            }
        }else{
            if (!isValidUUIDv4(idReceived)){
                console.error('Error in FUA From Visit PDF: Invalid UUID format. ');
                throw new Error("Error in FUA From Visit PDF: Invalid UUID format. ");
            }
            try{
                returnedFUAFromVisitPDF = await FUAFromVisitPDFImplementation.getByUUIDSequelize(idReceived);
            } catch (err: unknown){
                console.error('Error in FUA From Visit PDF Service: ', err);
                (err as Error).message =  'Error in FUA From Visit PDF Service: ' + (err as Error).message;
                throw err;
            }  
        }
        // If nothing was found, it will return a null
        return returnedFUAFromVisitPDF;

    }

    async listAll(){
        let returnedFUAFromVisitPDFs = [];
        try{
            returnedFUAFromVisitPDFs = await FUAFromVisitPDFImplementation.listAllSequelize();

        } catch (err: unknown){
            console.error('Error in FUA From Visit PDF Service: ', err);
            (err as Error).message =  'Error in FUA From Visit PDF Service: ' + (err as Error).message;
            throw err;
        } 
        return returnedFUAFromVisitPDFs;
    };

    

    async getPDF(id: string){
        let pdfBytes = null;
        try{
            const FUAFromVisitPDF = await this.getByIdOrUUID(id);
            pdfBytes = FUAFromVisitPDF.fileData;
        } catch (err: unknown){
            console.error('Error in FUA From Visit PDF Service - getPDF: ', err);
            (err as Error).message =  'Error in FUA From Visit PDF Service - getPDF: ' + (err as Error).message;
            throw err;
        }
        return pdfBytes;
    }
}

export default new FUAFromVisitPDFService();