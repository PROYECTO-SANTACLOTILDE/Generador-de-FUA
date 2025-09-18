import FUAFormatFromSchemaModel from '../../modelsSequelize/FUAFormatFromSchemaModel';
import { inspect } from "util";
import { BaseEntityInterface } from '../../modelsTypeScript/BaseEntity';
import BaseEntityModel from '../../modelsSequelize/BaseEntityModel';
import { BaseEntityVersion_MiddleTableModel, BaseEntityVersionModel } from '../../modelsSequelize';
import { transactionInst } from '../../middleware/globalTransaction';

export type relatedEntity = {
    type: string;
    uuid: string;
}

interface BaseEntityVersionInterface extends BaseEntityInterface{
    // Attributes
    uuidEntity: string;
    versionCounter: number;
    type: string;
    hash: string;
    action: string;
    content: string;
    relatedEntities?: Array<relatedEntity>; 
};

/*
relatedObjects: [
    { "FUAFormat" , uuid }, -> version
    { "FUAMapping", uuid }  -> version

]

*/

class BaseEntityVersionImplementation {
    
    async createSequelize(data : BaseEntityVersionInterface)
    {
        // Check last version number
        let lastVersions : any;
        try {
            lastVersions = await BaseEntityVersionModel.findAndCountAll({
                where: {
                    uuidEntity: data.uuidEntity,
                    type: data.type,
                    active: true,
                },
            });
            lastVersions = lastVersions.count + 1;
        }catch(err : any){
            (err as Error).message =  'Error in BaseEntityVersion Sequelize Implementation: Couldnt create BaseEntityVersion in database using Sequelize: Not able to find the current last version entity in the table' + (err as Error).message;
            const line = inspect(err, { depth: 100, colors: false });
            err.details = line.replace(/^/gm, '\t');     
            throw err;
        }
        // Check for related objects
        let relatedObjectsIds = Array<number>();
        if(data.relatedEntities !== undefined){
            for(let auxRelEnt of data.relatedEntities){
                // Check for version uuid
                let auxResult = null;
                try{
                    auxResult = await BaseEntityVersionModel.findOne({
                        where: {
                            uuidEntity: auxRelEnt.uuid,
                            type: auxRelEnt.type
                        }
                    });
                    if(auxResult !== undefined) relatedObjectsIds.push(auxResult.id);
                    else{
                        let auxError = new Error('BaseEntityVersion Sequelize Implementation: Couldnt create BaseEntityVersion in database using Sequelize: AuxRessult is undefined, one/some related object are missing in the table');
                        throw auxError;
                    }
                }catch(err : any){
                    (err as Error).message =  'Error in BaseEntityVersion Sequelize Implementation: Couldnt create BaseEntityVersion in database using Sequelize: ' + (err as Error).message;
                    const line = inspect(err, { depth: 100, colors: false });
                    err.details = line.replace(/^/gm, '\t');     
                    throw err;
                }
            }
        };

        // Insert new version using sequelize
        let newVersion = null;
        data.versionCounter = lastVersions;
        try {
            newVersion = await BaseEntityVersionModel.create(data, {transaction: transactionInst.transaction});
        } catch (err: any){
            (err as Error).message =  'Error in BaseEntityVersion Sequelize Implementation: Couldnt create BaseEntityVersion in database using Sequelize: ' + (err as Error).message;
            const line = inspect(err, { depth: 100, colors: false });
            err.details = line.replace(/^/gm, '\t');     
            throw err;
        }        

        // Insert related entities
        for( let auxRelEnt of relatedObjectsIds){
            let newMiddleTableEntry = null;
            try{
                newMiddleTableEntry = await BaseEntityVersion_MiddleTableModel.create({
                    mainEntity: newVersion.id,
                    relatedEntity: auxRelEnt,
                }, 
                {transaction: transactionInst.transaction}
            );
            }catch(err : any){
                (err as Error).message =  'Error in BaseEntityVersion Sequelize Implementation: Couldnt create BaseEntityVersion in database using Sequelize: ' + (err as Error).message;
                const line = inspect(err, { depth: 100, colors: false });
                err.details = line.replace(/^/gm, '\t');     
                throw err;
            }
        } 

        return newVersion;
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

        } catch (err: any){
            //console.error('Error in FUA Format From Schema Sequelize Implementation: Couldnt list all FUA Format From Schema in database using Sequelize. ', err);
            (err as Error).message =  'Error in FUA Format From Schema Sequelize Implementation: Couldnt list all FUA Format From Schema in database using Sequelize. ' + (err as Error).message;
            const line = inspect(err, { depth: 100, colors: false });
            err.details = line.replace(/^/gm, '\t');     
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

        } catch (err: any){
            (err as Error).message =  `Error in FUA Format From Schema Implementation: Couldnt retrieve FUA Format From Schema identified by UUID '${uuidReceived}' . ` + (err as Error).message;
            const line = inspect(err, { depth: 100, colors: false });
            err.details = line.replace(/^/gm, '\t'); 
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


        } catch (err: any){
            (err as Error).message =  `Error in FUA Format From Schema Sequelize Implementation: Couldnt retrieve FUA Format From Schema identified by Id "${idReceived}" . ` + (err as Error).message;
            const line = inspect(err, { depth: 100, colors: false });
            err.details = line.replace(/^/gm, '\t'); 
            throw err;
        }
     

        return returnedFUAFormat;
    };   

};

export default new BaseEntityVersionImplementation();
