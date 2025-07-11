import FUAFormatFromSchemaModel from '../../modelsSequelize/FUAFormatFromSchemaModel';

interface FUAFormatFromSchemaCreateInterface {
    // Data
    name: string;
    filename: string;
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
    async createSequelize(data: FUAFormatFromSchemaCreateInterface ) {
        if( data.versionNumber == undefined ) data.versionNumber = 1; 
        let returnedFUAFormat = null;
        try {
            returnedFUAFormat = await FUAFormatFromSchemaModel.create(data);
        } catch (err: unknown){
            console.error('Error in FUA Format From Schema Sequelize Implementation: Couldnt create FUA Format From Schema in database using Sequelize. ', err);
            (err as Error).message =  'Error in FUA Format From Schema Sequelize Implementation: Couldnt create FUA Format From Schema in database using Sequelize: ' + (err as Error).message;
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


};

export default new FUAFormatFromSchemaImplementation();
