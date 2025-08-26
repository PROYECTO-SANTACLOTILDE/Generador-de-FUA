import { raw } from "express";
import { FUAFromVisit } from "../../modelsSequelize";

class FUAFromVisitImplementation {

    // Creation of FUA From Visit
    async createSequelize(data: {
        // FUA Data
        payload: string; 
        schemaType: string;
        // Audit Data
        createdBy: string;
    }) {
        let returnedFUA = null;
        try {
            returnedFUA = await FUAFromVisit.create({...data, checksum: "-"});
        } catch (err: unknown){
            console.error('Error in FUA From Visit Sequelize Implementation: Couldnt create FUA From Visit in database using Sequelize. ', err);
            (err as Error).message =  'Error in FUA From Visit Sequelize Implementation: Couldnt create FUA From Visit in database using Sequelize: ' + (err as Error).message;
            throw err;
        }        

        return returnedFUA;
    };

    // List FUA 
    // Pending to paginate results
    async listAllSequelize( ) {
        let returnedFUAs = [];
        try {
            returnedFUAs = await FUAFromVisit.findAll({
                where: {
                    active: true,
                },
            });

        } catch (err: unknown){
            console.error('Error in FUA From Visit Sequelize Implementation: Couldnt list all FUA Formats in database using Sequelize. ', err);
            (err as Error).message =  'Error in FUA From Visit Sequelize Implementation: Couldnt list all FUA Formats in database using Sequelize. ' + (err as Error).message;
            throw err;
        }        

        return returnedFUAs;
    };

    // Get FUA From Visit by id 
    async getByIdSequelize(id: number ) {

        let returnedFUAFormat = null;
        try {
            returnedFUAFormat = await FUAFromVisit.findOne({
                where: {
                    id: id,
                    active: true,
                },
            });


        } catch (err: unknown){
            console.error(`Error in FUA From Visit Sequelize Implementation: Couldnt retrieve findOne identified by Id "${id}". `, err);
            (err as Error).message =  `Error in FUA From Visit Sequelize Implementation: Couldnt retrieve findOne identified by Id "${id}" . ` + (err as Error).message;
            throw err;
        }
     

        return returnedFUAFormat;
    };

    // Get FUA From Visit by UUID
    async getByUUIDSequelize(uuid: string ) {

        let returnedFUA = null;
        try {
            returnedFUA = await FUAFromVisit.findOne({
                where: {
                    uuid: uuid,
                    active: true,
                }
            });
            

        } catch (err: unknown){
            console.error(`Error in FUA From Visit Sequelize Implementation: Couldnt retrieve FUA From Visit Id identified by UUID '${uuid}' . `, err);
            (err as Error).message =  `Error in FUA From Visit Sequelize Implementation: Couldnt retrieve FUA From Visit Id identified by UUID '${uuid}' . ` + (err as Error).message;
            throw err;
        }   
        
        return returnedFUA;
    };

};

export default new FUAFromVisitImplementation();
