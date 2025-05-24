import { FUAFieldColumn } from "../../models";

class FUAFieldColumnRowImplementation {

    // Creation of FUA Field
    async createSequelize(data: {
        // Field Column Data
        label: string; 
        showLabel: boolean;
        valueType: string;
        codeName: string;
        version: string;
        columnIndex: number;
        // Field data
        FUAFieldId: number;
        // Audit Data
        createdBy: string;
    }) {
        let returnedFUAFieldColumn = null;
        try {
            returnedFUAFieldColumn = await FUAFieldColumn.create(data);
        } catch (err: unknown){
            console.error('Error in FUA Field Column Sequelize Implementation: Couldnt create FUA Field Column in database using Sequelize. ', err);
            (err as Error).message =  'Error in FUA Field Column Sequelize Implementation: Couldnt create FUA Field Column in database using Sequelize: ' + (err as Error).message;
            throw err;
        }        

        return returnedFUAFieldColumn;
    };

    // List FUA Field Columns
    // Pending to paginate results
    async listAllSequelize( ) {
        let returnedFUAFieldColumns = [];
        try {
            returnedFUAFieldColumns = await FUAFieldColumn.findAll({
                where: {
                    active: true,
                }
            });

        } catch (err: unknown){
            console.error('Error in FUA Field Column Implementation: Couldnt list all FUA Field Columns in database using Sequelize. ', err);
            (err as Error).message =  'Error in FUA Field Column Implementation: Couldnt list all FUA Field Columns in database using Sequelize. ' + (err as Error).message;
            throw err;
        }        

        return returnedFUAFieldColumns;
    };

    // Get FUA Field Column Id by UUID
    async getByUUIDSequelize(uuidSent: string){
        let returnedFUAFieldColumn = null;
        try {
            returnedFUAFieldColumn = await FUAFieldColumn.findAll({
                where: {
                    uuid: uuidSent,
                    active: true,
                }
            });

        } catch (err: unknown){
            console.error(`Error in FUA Field Column Sequelize Implementation: Couldnt found FUA Field Column identified by UUID '${uuidSent}' . `, err);
            (err as Error).message =  `Error in FUA Field Column Sequelize Implementation: Couldnt retrieve FUA Field Column identified by UUID '${uuidSent}' . ` + (err as Error).message;
            throw err;
        }        

        return returnedFUAFieldColumn;
    };

    // Get FUA Format by id 
    async getByIdSequelize(id: number ) {

        let returnedFUAFieldColumn = null;
        try {
            returnedFUAFieldColumn = await FUAFieldColumn.findAll({
                where: {
                    id: id,
                    active: true,
                }
            });


        } catch (err: unknown){
            console.error(`Error in FUA Field Column Sequelize Implementation: Couldnt retrieve FUA Field Column identified by Id "${id}". `, err);
            (err as Error).message =  `Error in FUA Field Column Sequelize Implementation: Couldnt retrieve FUA Field Column identified by Id "${id}" . ` + (err as Error).message;
            throw err;
        }     

        return returnedFUAFieldColumn;
    };

};

export default new FUAFieldColumnRowImplementation();
