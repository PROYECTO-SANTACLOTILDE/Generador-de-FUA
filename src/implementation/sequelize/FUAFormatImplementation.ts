import { FUAFormat } from '../../models/FUAFormat.js';

class FUAFormatImplementation {

    // Creation of FUA Format
    async createFUAFormatSequelize(data: { 
        // Format Data
        codeName: string; 
        version: string; 
        // Audit Data
        createdBy: string;
    }) {
        // Check if ID or at least
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
            (err as Error).message +=  'Error in FUAFormat Implementation: Couldnt list all FUA Formats in database using Sequelize. ' + (err as Error).message;
            throw err;
        }        

        return returnedFUAFormats;
    };
};

export default new FUAFormatImplementation();
