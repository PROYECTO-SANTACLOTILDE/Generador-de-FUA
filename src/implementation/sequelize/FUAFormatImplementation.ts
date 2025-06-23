import { raw } from "express";
import { FUAFormat, FUAPage } from "../../models";

class FUAFormatImplementation {

    // Creation of FUA Format
    async createSequelize(data: {
        // Format Data
        codeName: string; 
        version: string;
        // Audit Data
        createdBy: string;
    }) {
        let returnedFUAFormat = null;
        try {
            returnedFUAFormat = await FUAFormat.create(data);
        } catch (err: unknown){
            console.error('Error in FUAFormat Sequelize Implementation: Couldnt create FUA Format in database using Sequelize. ', err);
            (err as Error).message =  'Error in FUAFormat Sequelize Implementation: Couldnt create FUA Format in database using Sequelize: ' + (err as Error).message;
            throw err;
        }        

        return returnedFUAFormat;
    };

    // List FUA Formats
    // Pending to paginate results
    async listAllSequelize( ) {
        let returnedFUAFormats = [];
        try {
            returnedFUAFormats = await FUAFormat.findAll({
                where: {
                    active: true,
                }
            });

        } catch (err: unknown){
            console.error('Error in FUAFormat Sequelize Implementation: Couldnt list all FUA Formats in database using Sequelize. ', err);
            (err as Error).message =  'Error in FUAFormat Sequelize Implementation: Couldnt list all FUA Formats in database using Sequelize. ' + (err as Error).message;
            throw err;
        }        

        return returnedFUAFormats;
    };

    // Get FUA Format Id by UUID
    async getByIdOrUUIDSequelize(uuidSent: string){
        let returnFUAFormat = null;
        try {
            returnFUAFormat = await FUAFormat.findOne({
                where: {
                    uuid: uuidSent,
                    active: true,
                }
            });

        } catch (err: unknown){
            console.error(`Error in FUAFormat Sequelize Implementation: Couldnt found FUA Format identified by UUID '${uuidSent}' . `, err);
            (err as Error).message =  `Error in FUAFormat Sequelize Implementation: Couldnt retrieve FUA Format identified by UUID '${uuidSent}' . ` + (err as Error).message;
            throw err;
        }        

        return returnFUAFormat;
    };

    // Get FUA Format by id 
    async getByIdSequelize(id: number ) {

        let returnedFUAFormat = null;
        try {
            returnedFUAFormat = await FUAFormat.findOne({
                where: {
                    id: id,
                    active: true,
                },
                raw: true, // Return raw data
            });


        } catch (err: unknown){
            console.error(`Error in FUA Format Sequelize Implementation: Couldnt retrieve FUA Format identified by Id "${id}". `, err);
            (err as Error).message =  `Error in FUA Format Sequelize Implementation: Couldnt retrieve FUA Format identified by Id "${id}" . ` + (err as Error).message;
            throw err;
        }
     

        return returnedFUAFormat;
    };

    // Get FUA Format Id by UUID
    async getByUUIDSequelize(uuid: string ) {

        let returnedFUAFormatId = null;
        try {
            returnedFUAFormatId = await FUAFormat.findAll({
                attributes: [
                    'id',
                ],
                where: {
                    uuid: uuid,
                    active: true,
                }
            });
            

        } catch (err: unknown){
            console.error(`Error in FUAFormat Sequelize Implementation: Couldnt retrieve FUA Format Id identified by UUID '${uuid}' . `, err);
            (err as Error).message =  `Error in FUAFormat Sequelize Implementation: Couldnt retrieve FUA Format Id identified by UUID '${uuid}' . ` + (err as Error).message;
            throw err;
        }   
        
        return returnedFUAFormatId;
    };

    // Get FUA Pages by Id
    async getFUAPagesByIdSequelize(id: number) {
        let returnedFUAPages = null;
        // Get FUA PAges
        try {
            returnedFUAPages = await FUAPage.findAll({
                where: {
                    FUAFormatId: id,
                    active: true,
                }
            });

        } catch (err: unknown){
            console.error(`Error in FUA Format Sequelize Implementation - getFUAPagesByIdSequelize: Couldnt retrieve FUA Pages with FUAFormatId identified by Id "${id}". `, err);
            (err as Error).message =  `Error in FUA Format Sequelize Implementation - getFUAPagesByIdSequelize: Couldnt retrieve FUA Pages with FUAFormatId identified by Id "${id}" . ` + (err as Error).message;
            throw err;
        }
        
        // If nothing was found, it will return a []
        return returnedFUAPages;
    }


};

export default new FUAFormatImplementation();
