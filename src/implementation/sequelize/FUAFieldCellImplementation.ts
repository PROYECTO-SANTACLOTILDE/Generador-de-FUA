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
            returnedFUAFieldCell = await FUAFieldCell.findAll({
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
            returnedFUAFieldCell = await FUAFieldCell.findAll({
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

};

export default new FUAFieldCellImplementation();
