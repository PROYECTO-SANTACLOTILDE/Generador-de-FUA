import { FUAFieldColumn, FUAFieldRow } from "../../models";

class FUAFieldRowImplementation {

    // Creation of FUA Field Row
    async createSequelize(data: {
        // Field Column Data
        label: string; 
        showLabel: boolean;
        valueType: string;
        codeName: string;
        version: string;
        rowIndex: number;
        // Field Column data
        FUAFieldColumnId: number;
        // Audit Data
        createdBy: string;
    }) {
        let returnedFUAFieldRow = null;
        try {
            returnedFUAFieldRow = await FUAFieldColumn.create(data);
        } catch (err: unknown){
            console.error('Error in FUA Field Row Sequelize Implementation - createSequelize: Couldnt create FUA Field Row in database using Sequelize. ', err);
            (err as Error).message =  'Error in FUA Field Row Sequelize Implementation - createSequelize: Couldnt create FUA Field Row in database using Sequelize: ' + (err as Error).message;
            throw err;
        }        

        return returnedFUAFieldRow;
    };

    // List FUA Field Rows
    // Pending to paginate results
    async listAllSequelize( ) {
        let returnedFUAFieldRows = [];
        try {
            returnedFUAFieldRows = await FUAFieldRow.findAll({
                where: {
                    active: true,
                }
            });

        } catch (err: unknown){
            console.error('Error in FUA Field Row Implementation - listAllSequelize: Couldnt list all FUA Field Rows in database using Sequelize. ', err);
            (err as Error).message =  'Error in FUA Field Row Implementation - listAllSequelize: Couldnt list all FUA Field Rows in database using Sequelize. ' + (err as Error).message;
            throw err;
        }        

        return returnedFUAFieldRows;
    };

    // Get FUA Field Row Id by UUID
    async getByUUIDSequelize(uuidSent: string){
        let returnedFUAFieldRow = null;
        try {
            returnedFUAFieldRow = await FUAFieldRow.findOne({
                where: {
                    uuid: uuidSent,
                    active: true,
                }
            });

        } catch (err: unknown){
            console.error(`Error in FUA Field Row Sequelize Implementation - getByUUIDSquelize: Couldnt found FUA Row Column identified by UUID '${uuidSent}' . `, err);
            (err as Error).message =  `Error in FUA Field Row Sequelize Implementation - getByUUIDSquelize: Couldnt retrieve FUA Field Row identified by UUID '${uuidSent}' . ` + (err as Error).message;
            throw err;
        }        

        return returnedFUAFieldRow;
    };

    // Get FUA Field Row by id 
    async getByIdSequelize(id: number ) {

        let returnedFUAFieldRow = null;
        try {
            returnedFUAFieldRow = await FUAFieldColumn.findOne({
                where: {
                    id: id,
                    active: true,
                }
            });


        } catch (err: unknown){
            console.error(`Error in FUA Field Row Sequelize Implementation - getByIdSequelize: Couldnt retrieve FUA Field Row identified by Id "${id}". `, err);
            (err as Error).message =  `Error in FUA Field Row Sequelize Implementation - getByIdSequelize: Couldnt retrieve FUA Field Row identified by Id "${id}" . ` + (err as Error).message;
            throw err;
        }     

        return returnedFUAFieldRow;
    };

    // Get FUA Rows by id 
    async getListByIdSequelize(id: number ) {

        let returnedFUARows = [];
        try {
            returnedFUARows = await FUAFieldRow.findAll({
                where: {
                    id: id,
                    active: true,
                }
            });


        } catch (err: unknown){
            console.error(`Error in FUA Field Row Sequelize Implementation - getListByIdSequelize: Couldnt retrieve FUA Field Columns identified by Id "${id}". `, err);
            (err as Error).message =  `Error in FUA Field Row Sequelize Implementation - getListByIdSequelize: Couldnt retrieve FUA Field Columns identified by Id "${id}" . ` + (err as Error).message;
            throw err;
        }     

        // Returns an array ( [] )
        return returnedFUARows;
    };

    // Get FUA Rows by UUID 
    async getListByUUIDSequelize(auxUUID: string ) {

        let returnedFUARows = null;
        try {
            returnedFUARows = await FUAFieldRow.findOne({
                where: {
                    uuid: auxUUID,
                    active: true,
                }
            });


        } catch (err: unknown){
            console.error(`Error in FUA Field Row Sequelize Implementation - getListByUUIDSequelize: Couldnt retrieve FUA Row Columns identified by UUID "${auxUUID}". `, err);
            (err as Error).message =  `Error in FUA Field Row Sequelize Implementation - getListByUUIDSequelize: Couldnt retrieve FUA Row Columns identified by UUID "${auxUUID}" . ` + (err as Error).message;
            throw err;
        }     
        // Nothing was found, returns null
        return returnedFUARows;
    };

};

export default new FUAFieldRowImplementation();
