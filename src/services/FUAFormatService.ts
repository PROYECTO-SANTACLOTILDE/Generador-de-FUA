import { FUAFormat } from '../models/FUAFormat.js';

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
            returnedFUAFormat = await FUAFormat.create(data);
        } catch (err: unknown){
            console.error('Error in FUAFormat Service: Couldnt create FUA Format in database. ', err);
            (err as Error).message =  'Error in FUAFormat Service - Couldnt create FUA Format in database: ' + (err as Error).message;
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
            returnedFUAFormats = await FUAFormat.findAll({
                where: {
                    active: true,
                }
            });
            console.log(returnedFUAFormats);
        } catch (err: unknown){
            console.error('Error in FUAFormat Service: Couldnt list all FUA Formats in database. xdd', err);
            (err as Error).message +=  'Error in FUAFormat Service: Couldnt list all FUA Formats in database. xdd';
            throw err;
        }        

        return returnedFUAFormats;
    };
};

export default new FUAFormatService();
