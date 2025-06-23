import { FUAFieldCell, FUAFieldColumn, FUAFieldRow } from "../../models";

class FUAFieldCellImplementation {

    // Creation of FUA Field Cell
    async createSequelize(data: {
        // Field Column Data
        label: string; 
        showLabel: boolean;
        valueType: string;
        codeName: string;
        version: string;
        colSpan: number;
        rowSpan: number;
        // Field Row data
        FUAFieldRowId: number;
        // Audit Data
        createdBy: string;
    }) {
        let returnedFUAFieldCell = null;
        try {
            returnedFUAFieldCell = await FUAFieldCell.create(data);
        } catch (err: unknown){
            console.error('Error in FUA Field Cell Sequelize Implementation - createSequelize: Couldnt create FUA Field Cell in database using Sequelize. ', err);
            (err as Error).message =  'Error in FUA Field Cell Sequelize Implementation - createSequelize: Couldnt create FUA Field Cell in database using Sequelize: ' + (err as Error).message;
            throw err;
        }        

        return returnedFUAFieldCell;
    };

    // List FUA Field Cells
    // Pending to paginate results
    async listAllSequelize( ) {
        let returnedFUAFieldCells = [];
        try {
            returnedFUAFieldCells = await FUAFieldCell.findAll({
                where: {
                    active: true,
                }
            });

        } catch (err: unknown){
            console.error('Error in FUA Field Cell Sequelize Implementation - listAllSequelize: Couldnt list all FUA Field Cells in database using Sequelize. ', err);
            (err as Error).message =  'Error in FUA Field Row Sequelize Implementation - listAllSequelize: Couldnt list all FUA Field Cells in database using Sequelize. ' + (err as Error).message;
            throw err;
        }        

        return returnedFUAFieldCells;
    };

    // Get FUA Field Cell Id by UUID
    async getByUUIDSequelize(uuidSent: string){
        let returnedFUAFieldCell = null;
        try {
            returnedFUAFieldCell = await FUAFieldCell.findOne({
                where: {
                    uuid: uuidSent,
                    active: true,
                }
            });

        } catch (err: unknown){
            console.error(`Error in FUA Field Cell Sequelize Implementation - getByUUIDSquelize: Couldnt found FUA Field Cell identified by UUID '${uuidSent}' . `, err);
            (err as Error).message =  `Error in FUA Field Cell Sequelize Implementation - getByUUIDSquelize: Couldnt retrieve FUA Field Cell identified by UUID '${uuidSent}' . ` + (err as Error).message;
            throw err;
        }        

        return returnedFUAFieldCell;
    };

    // Get FUA Field Cell by id 
    async getByIdSequelize(id: number ) {

        let returnedFUAFieldCell = null;
        try {
            returnedFUAFieldCell = await FUAFieldCell.findOne({
                where: {
                    id: id,
                    active: true,
                }
            });


        } catch (err: unknown){
            console.error(`Error in FUA Field Cell Sequelize Implementation - getByIdSequelize: Couldnt retrieve FUA Field Cell identified by Id "${id}". `, err);
            (err as Error).message =  `Error in FUA Field Cell Sequelize Implementation - getByIdSequelize: Couldnt retrieve FUA Field Cell identified by Id "${id}" . ` + (err as Error).message;
            throw err;
        }     

        return returnedFUAFieldCell;
    };

    // Get FUA Cells by id 
    async getListByIdSequelize(id: number ) {

        let returnedFUAFieldCells = [];
        try {
            returnedFUAFieldCells = await FUAFieldColumn.findAll({
                where: {
                    id: id,
                    active: true,
                }
            });


        } catch (err: unknown){
            console.error(`Error in FUA Field Cells Sequelize Implementation - getListByIdSequelize: Couldnt retrieve FUA Field Cells identified by Id "${id}". `, err);
            (err as Error).message =  `Error in FUA Field Cells Sequelize Implementation - getListByIdSequelize: Couldnt retrieve FUA Field Cells identified by Id "${id}" . ` + (err as Error).message;
            throw err;
        }     

        // Returns an array ( [] )
        return returnedFUAFieldCells;
    };

    // Get FUA Cells by UUID 
    async getListByUUIDSequelize(auxUUID: string ) {

        let returnedFUAFieldColumns = null;
        try {
            returnedFUAFieldColumns = await FUAFieldColumn.findOne({
                where: {
                    uuid: auxUUID,
                    active: true,
                }
            });


        } catch (err: unknown){
            console.error(`Error in FUA Field Column Sequelize Implementation - getListByUUIDSequelize: Couldnt retrieve FUA Field Columns identified by UUID "${auxUUID}". `, err);
            (err as Error).message =  `Error in FUA Field Column Sequelize Implementation - getListByUUIDSequelize: Couldnt retrieve FUA Field Columns identified by UUID "${auxUUID}" . ` + (err as Error).message;
            throw err;
        }     
        // Nothing was found, returns null
        return returnedFUAFieldColumns;
    };


};

export default new FUAFieldCellImplementation();
