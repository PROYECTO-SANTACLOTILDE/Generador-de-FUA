import FUAFormatImplementation from '../implementation/sequelize/FUAFormatImplementation';

class FUAFormatService {

    // Creation of FUA Format
    async createFUAFormat(data: { 
        // Format Data
        codeName: string; 
        version: string; 
        // Audit Data
        createdBy: string;
    }) {
        // Check if ID or at least
        let returnedFUAFormat = null;
        try {
            returnedFUAFormat = await FUAFormatImplementation.createFUAFormatSequelize(data);
        } catch (err: unknown){
            console.error('Error in FUAFormat Service: ', err);
            (err as Error).message =  'Error in FUAFormat Service: ' + (err as Error).message;
            throw err;
        }

        return {
            uuid: returnedFUAFormat.uuid
        };
    };

    // List FUA Formats
    // Pending to paginate results
    async listAllFUAFormats( ) {
        let returnedFUAFormats = [];
        try {
            returnedFUAFormats = await FUAFormatImplementation.listAllFUAFormatsSequelize();

        } catch (err: unknown){
            console.error('Error in FUAFormat Service: ', err);
            (err as Error).message +=  'Error in FUAFormat Service: ' + (err as Error).message;
            throw err;
        }        

        return returnedFUAFormats;
    };
};

export default new FUAFormatService();
