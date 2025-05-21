import { FUAPage } from '../models/FUAPage.js';
import { FUAFormat } from '../models/FUAFormat.js';

class FUAPageService {

    // Creation of FUA Page
    async createFUAPage(data: { 
        // Page Data 
        title: string; 
        codename: string; 
        version: string; 
        pageNumber: number; 
        //Format Data
        formatId?: string;
        formatUUID?: string;
        // Audit data
        createdByUUID: string;
    }) {
        
        // Check if format ID or UUID was sent, preference over ID
        if( data.formatId != null || data.formatUUID != null){
            throw new Error("ERROR IN FUAPAGE SERVICE: At least format ID or UUID is need to create FUA Page. ");
        }

        // Check if pageNumnber is valid and integer
        if( (!Number.isInteger(data.pageNumber)) || data.pageNumber <= 0 ){
            throw new Error(" ERROR IN FUAPAGE SERVICE:At least format ID or UUID is need to create FUA Page. ");
        }

        // Get format UUID if format ID was given
        // Refactorize with service
        try {
            const fuaFormat = await FUAFormat.findAll({
                attributes: ['id','uuid'],
                where: {
                    active: true,
                },
            });
        }catch(error){
            console.error(`ERROR IN FUAPAGE SERVICE: Couldnt find ID for format UUID given: ${data.formatUUID} `)
        }

        // Send data to create  
        let nuData = {

        };

        let returnedFUAPage = null;
        try {
            returnedFUAPage = await FUAPage.create(data);
        } catch (err: unknown){
            console.error('ERROR IN FUAPAGE SERVICE: Couldnt create FUA Format in database. ', err);
            throw new Error('ERROR IN FUAPAGE SERVICE: Couldnt create FUA Format in database. ' + (err as Error).message);
        }        

        return {
            uuid: returnedFUAPage.uuid
        };
    };
};

export default new FUAPageService();
