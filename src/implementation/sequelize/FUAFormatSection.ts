import { FUAFormat } from "../../models";

class FUAFormatSection {

    // Creation of FUA Format
    async createFUAFormatSequelize(data: {
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
    async listAllFUAFormatsSequelize( ) {
        let returnedFUAFormats = [];
        try {
            returnedFUAFormats = await FUAFormat.findAll({
                where: {
                    active: true,
                }
            });

        } catch (err: unknown){
            console.error('Error in FUAFormat Implementation: Couldnt list all FUA Formats in database using Sequelize. ', err);
            (err as Error).message =  'Error in FUAFormat Implementation: Couldnt list all FUA Formats in database using Sequelize. ' + (err as Error).message;
            throw err;
        }        

        return returnedFUAFormats;
    };

    // Get FUA Format Id by UUID
    async getFUAFormatByUUIDSequelize(uuidSent: string){
        let returnFUAFormat = null;
        try {
            returnFUAFormat = await FUAFormat.findAll({
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
    async getFUAFormatByIdSequelize(id: number ) {

        let returnedFUAFormat = null;
        try {
            returnedFUAFormat = await FUAFormat.findAll({
                where: {
                    id: id,
                    active: true,
                }
            });


        } catch (err: unknown){
            console.error(`Error in FUAFormat Sequelize Implementation: Couldnt retrieve FUA Format identified by Id "${id}". `, err);
            (err as Error).message =  `Error in FUAFormat Sequelize Implementation: Couldnt retrieve FUA Format identified by Id "${id}" . ` + (err as Error).message;
            throw err;
        }
     

        return returnedFUAFormat;
    };

    // Get FUA Format Id by UUID
    async getFUAFormatIdbyUUIDSequelize(uuid: string ) {

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
};

export default new FUAFormatImplementation();
