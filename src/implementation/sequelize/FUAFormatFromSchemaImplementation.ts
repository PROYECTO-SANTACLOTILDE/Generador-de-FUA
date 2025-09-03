import FUAFormatFromSchemaModel from '../../modelsSequelize/FUAFormatFromSchemaModel';
import { inspect } from "util";

interface FUAFormatFromSchemaCreateInterface {
    // Data
    name: string;
    content: string;
    //Field Form Data
    codeName: string; 
    versionTag: string;
    versionNumber?: number;        
    // Audit Data
    createdBy: string;
};

class FUAFormatFromSchemaImplementation {
    // Creation of FUA Format
    async createSequelize(data : {
        // Data
        name: string;
        content: string;
        //Field Form Data
        codeName: string; 
        versionTag: string;
        versionNumber: number;        
        // Audit Data
        createdBy: string;
    }) {
        if( data.versionNumber == undefined ) data.versionNumber = 1; 
        let returnedFUAFormat = null;
        try {
            returnedFUAFormat = await FUAFormatFromSchemaModel.create(data);
        } catch (err: any){
            (err as Error).message =  'Error in FUA Format From Schema Sequelize Implementation: Couldnt create FUA Format From Schema in database using Sequelize: ' + (err as Error).message;
            const line = inspect(err, { depth: 100, colors: false });
            err.details = line.replace(/^/gm, '\t');     
            throw err;
        }        

        return returnedFUAFormat;
    };

    // List FUA Formats
    // Pending to paginate results
    async listAllSequelize( ) {
        let returnedFUAFormats = [];
        try {
            returnedFUAFormats = await FUAFormatFromSchemaModel.findAll({
                where: {
                    active: true,
                }
            });

        } catch (err: unknown){
            console.error('Error in FUA Format From Schema Sequelize Implementation: Couldnt list all FUA Format From Schema in database using Sequelize. ', err);
            (err as Error).message =  'Error in FUA Format From Schema Sequelize Implementation: Couldnt list all FUA Format From Schema in database using Sequelize. ' + (err as Error).message;
            throw err;
        }        

        return returnedFUAFormats;
    };

    // Get FUA Format Id by UUID
    async getByUUIDSequelize(uuidReceived: string){
        let returnFUAFormat = null;
        try {
            returnFUAFormat = await FUAFormatFromSchemaModel.findOne({
                where: {
                    uuid: uuidReceived,
                    active: true,
                }
            });

        } catch (err: unknown){
            console.error(`Error in FUA Format From Schema Implementation: Couldnt found FUA Format From Schema identified by UUID '${uuidReceived}' . `, err);
            (err as Error).message =  `Error in FUA Format From Schema Implementation: Couldnt retrieve FUA Format From Schema identified by UUID '${uuidReceived}' . ` + (err as Error).message;
            throw err;
        }        

        return returnFUAFormat;
    };

    // Get FUA Format by id 
    async getByIdSequelize(idReceived: number ) {

        let returnedFUAFormat = null;
        try {
            returnedFUAFormat = await FUAFormatFromSchemaModel.findOne({
                where: {
                    id: idReceived,
                    active: true,
                },
                raw: true, // Return raw data
            });


        } catch (err: unknown){
            console.error(`Error in FUA Format From Schema Sequelize Implementation: Couldnt retrieve FUA Format From Schema identified by Id "${idReceived}". `, err);
            (err as Error).message =  `Error in FUA Format From Schema Sequelize Implementation: Couldnt retrieve FUA Format From Schema identified by Id "${idReceived}" . ` + (err as Error).message;
            throw err;
        }
     

        return returnedFUAFormat;
    };   

    async editSequelize(data : {
        // Data
        uuid: string;
        name: string;
        content: string;
        //Field Form Data
        codeName: string; 
        versionTag: string;
        versionNumber: number;
        createdBy: string;
    }){

        // Find the object to edit
        let searchedFUAFormat = null;

        try {
            searchedFUAFormat = await this.getByUUIDSequelize(data.uuid);
        } catch (err: unknown){
            console.error(`Error in FUA Format From Schema Sequelize Implementation: Couldnt found FUA Format From Schema in database identified by UUID ${data.uuid} Sequelize. `, err);
            (err as Error).message =  `Error in FUA Format From Schema Sequelize Implementation: Couldnt found FUA Format From Schema in database identified by UUID ${data.uuid} Sequelize. ` + (err as Error).message;
            throw err;
        }

        if(searchedFUAFormat === null){
            // In case a FUA Format wasnt found
            console.error(`Error in FUA Format From Schema Sequelize Implementation: Couldnt found FUA Format by UUID '${data.uuid}' sent in database using Sequelize. `);
            throw new Error(`Error in FUA Format From Schema Sequelize Implementation: Couldnt found FUA Format by UUID '${data.uuid}' sent in database using Sequelize. `);
        }
        

        // Set the new fields

        let returnedFUAFormat = null;
        let aux = null;
        returnedFUAFormat = searchedFUAFormat.set(data);
        try {
            aux = await returnedFUAFormat.save();
        } catch (err: unknown){
            console.error('Error in FUA Format From Schema Sequelize Implementation: Couldnt save FUA Format From Schema in database using Sequelize. ', err);
            (err as Error).message =  'Error in FUA Format From Schema Sequelize Implementation: Couldnt save FUA Format From Schema in database using Sequelize: ' + (err as Error).message;
            throw err;
        }

        

        return aux;
    };


};

export default new FUAFormatFromSchemaImplementation();
