import { FUAPage, FUASection } from "../../models";
import FUAFormatService from "../../services/FUAFormatService";

class FUAPageImplementation {

    // Creation of FUA Page
    async createFUAPageSequelize(data: { 
        // Page Data
        title: string;
        codeName: string; 
        version: string; 
        pageNumber: number;
        nextPage?: number; // Id
        previousPage?: number; // Id
        //FUAFormat Data
        FUAFormatId: number; // Id
        // Audit Data
        createdBy: string;
    }) {
        

        let returnedFUAPage = null;
        try {
            returnedFUAPage = await FUAPage.create({
                title: data.title,
                codeName: data.codeName, 
                version: data.version, 
                pageNumber: data.pageNumber,
                nextPage: data.nextPage,
                previousPage: data.previousPage,
                FUAFormatId: data.FUAFormatId,
                createdBy: data.createdBy,
            });
        } catch (err: unknown){
            console.error('Error in FUAPage Sequelize Implementation: Couldnt create FUA Page in database using Sequelize. ', err);
            (err as Error).message =  'Error in FUAPage Sequelize Implementation: Couldnt create FUA Page in database using Sequelize: ' + (err as Error).message;
            throw err;
        }        

        return returnedFUAPage;
    };

    // List FUA Page of Format
    async listAllFUAPagesSequelize( ) {
        let returnedFUAPages = [];
        try{
            returnedFUAPages = await FUAPage.findAll({
                where: {
                    active: true,
                }
            });
        } catch (err: unknown) {
            console.error('Error in FUAPage Sequelize Implementation: Couldnt list all FUA Page in database using Sequelize. ', err);
            (err as Error).message =  'Error in FUAPage Sequelize Implementation: Couldnt list all FUA Page in database using Sequelize: ' + (err as Error).message;
            throw err;
        }
        return returnedFUAPages;
    };

    // Get FUA Page by Id
    async getFUAPageByIdSequelize(id: number){
        let returnFUAPage = null;
        try {
            returnFUAPage = await FUAPage.findAll({
                where: {
                    id: id,
                    active: true,
                }
            });

        } catch (err: unknown){
            console.error(`Error in FUAPage Sequelize Implementation: Couldnt retrieve FUA Page identified by Id '${id}' . `, err);
            (err as Error).message =  `Error in FUAPage Sequelize Implementation: Couldnt retrieve FUA Page identified by Id '${id}' . ` + (err as Error).message;
            throw err;
        }        

        return returnFUAPage;
    };

    // Get FUA Page by UUID
    async getFUAPageByUUIDSequelize(uuid: string){
        let returnFUAPage = null;
        try {
            returnFUAPage = await FUAPage.findAll({
                where: {
                    uuid: uuid,
                    active: true,
                }
            });

        } catch (err: unknown){
            console.error(`Error in FUAPage Sequelize Implementation: Couldnt retrieve FUA Page identified by UUID '${uuid}' . `, err);
            (err as Error).message =  `Error in FUAPage Sequelize Implementation: Couldnt retrieve FUA Page identified by UUID '${uuid}' . ` + (err as Error).message;
            throw err;
        }        

        return returnFUAPage;
    };

    // Get FUA Sections by Id
    async getFUASectionsByIdSequelize(idReceived: number){
        let returnedFUASections = [];
        // Get FUA PAges
        try {
            returnedFUASections = await FUASection.findAll({
                where: {
                    FUAPageId: idReceived,
                    active: true,
                }
            });

        } catch (err: unknown){
            console.error(`Error in FUA Page Sequelize Implementation - getFUASectionsByIdSequelize: Couldnt retrieve FUA Sections with FUA Page Id identified by Id "${idReceived}". `, err);
            (err as Error).message =  `Error in FUA Page Sequelize Implementation - getFUASectionsByIdSequelize: Couldnt retrieve FUA Sections with FUA Page Id identified by Id "${idReceived}" . ` + (err as Error).message;
            throw err;
        }
        
        // If nothing was found, it will return a []
        return returnedFUASections;
    };
};

export default new FUAPageImplementation();
