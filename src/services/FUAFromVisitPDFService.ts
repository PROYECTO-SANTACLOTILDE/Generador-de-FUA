import BaseEntity from "../modelsTypeScript/BaseEntity";

import FUAFromVisitPDFImplementation from "../implementation/sequelize/FUAFromVisitPDFImplementation";
import BaseEntityVersionService from "./BaseEntityVersionService";
import { Version_Actions } from "../utils/VersionConstants";
import FUAFromVisitService from "./FUAFromVisitService";

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
}

export default new FUAFromVisitPDFService();