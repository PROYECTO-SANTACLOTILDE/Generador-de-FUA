import { FUAFormat, FUASection } from "../../models";

class FUASectionImplementation {

    // Creation of FUA Section
    async createSequelize(data: {
        // Section Data
        title: string; 
        showTitle: boolean;
        codeName: string;
        version: string;
        // Page data
        FUAPageId: number;
        // Audit Data
        createdBy: string;
    }) {
        let returnedFUASection = null;
        try {
            returnedFUASection = await FUASection.create(data);
        } catch (err: unknown){
            console.error('Error in FUASection Sequelize Implementation: Couldnt create FUA Section in database using Sequelize. ', err);
            (err as Error).message =  'Error in FUASection Sequelize Implementation: Couldnt create FUA Section in database using Sequelize: ' + (err as Error).message;
            throw err;
        }        

        return returnedFUASection;
    };

    // List FUA Sections
    // Pending to paginate results
    async listAllSequelize( ) {
        let returnedFUAFSections = [];
        try {
            returnedFUAFSections = await FUASection.findAll({
                where: {
                    active: true,
                }
            });

        } catch (err: unknown){
            console.error('Error in FUASection Implementation: Couldnt list all FUA Srctions in database using Sequelize. ', err);
            (err as Error).message =  'Error in FUASection Implementation: Couldnt list all FUA Srctions in database using Sequelize. ' + (err as Error).message;
            throw err;
        }        

        return returnedFUAFSections;
    };

    // Get FUA Format Id by UUID
    async getByUUIDSequelize(uuidSent: string){
        let returnFUASection = null;
        try {
            returnFUASection = await FUAFormat.findAll({
                where: {
                    uuid: uuidSent,
                    active: true,
                }
            });

        } catch (err: unknown){
            console.error(`Error in FUASection Sequelize Implementation: Couldnt found FUA Section identified by UUID '${uuidSent}' . `, err);
            (err as Error).message =  `Error in FUASection Sequelize Implementation: Couldnt retrieve FUA Section identified by UUID '${uuidSent}' . ` + (err as Error).message;
            throw err;
        }        

        return returnFUASection;
    };

    // Get FUA Format by id 
    async getByIdSequelize(id: number ) {

        let returnedFUAFormat = null;
        try {
            returnedFUAFormat = await FUAFormat.findAll({
                where: {
                    id: id,
                    active: true,
                }
            });


        } catch (err: unknown){
            console.error(`Error in FUASection Sequelize Implementation: Couldnt retrieve FUA Section identified by Id "${id}". `, err);
            (err as Error).message =  `Error in FUASection Sequelize Implementation: Couldnt retrieve FUA Section identified by Id "${id}" . ` + (err as Error).message;
            throw err;
        }
     

        return returnedFUAFormat;
    };

};

export default new FUASectionImplementation();
