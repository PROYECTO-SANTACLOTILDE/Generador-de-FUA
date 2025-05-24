import { FUAField, FUASection } from "../../models";

class FUAFieldImplementation {

    // Creation of FUA Field
    async createSequelize(data: {
        // Field Data
        label: string; 
        showLabel: boolean;
        labelOrientation: string;
        labelPosition: string;
        valueType: string;
        orientation: string;
        codeName: string;
        version: string;
        // Section data
        FUASectionId: number;
        // Audit Data
        createdBy: string;
    }) {
        let returnedFUAField = null;
        try {
            returnedFUAField = await FUAField.create(data);
        } catch (err: unknown){
            console.error('Error in FUAField Sequelize Implementation: Couldnt create FUA Field in database using Sequelize. ', err);
            (err as Error).message =  'Error in FUAField Sequelize Implementation: Couldnt create FUA Field in database using Sequelize: ' + (err as Error).message;
            throw err;
        }        

        return returnedFUAField;
    };

    // List FUA Fields
    // Pending to paginate results
    async listAllSequelize( ) {
        let returnedFUAFields = [];
        try {
            returnedFUAFields = await FUAField.findAll({
                where: {
                    active: true,
                }
            });

        } catch (err: unknown){
            console.error('Error in FUAField Implementation: Couldnt list all FUA Fields in database using Sequelize. ', err);
            (err as Error).message =  'Error in FUAField Implementation: Couldnt list all FUA Fields in database using Sequelize. ' + (err as Error).message;
            throw err;
        }        

        return returnedFUAFields;
    };

    // Get FUA Field Id by UUID
    async getByUUIDSequelize(uuidSent: string){
        let returnedFUAField = null;
        try {
            returnedFUAField = await FUAField.findAll({
                where: {
                    uuid: uuidSent,
                    active: true,
                }
            });

        } catch (err: unknown){
            console.error(`Error in FUAField Sequelize Implementation: Couldnt found FUA Field identified by UUID '${uuidSent}' . `, err);
            (err as Error).message =  `Error in FUAField Sequelize Implementation: Couldnt retrieve FUA Field identified by UUID '${uuidSent}' . ` + (err as Error).message;
            throw err;
        }        

        return returnedFUAField;
    };

    // Get FUA Format by id 
    async getByIdSequelize(id: number ) {

        let returnedFUAField = null;
        try {
            returnedFUAField = await FUAField.findAll({
                where: {
                    id: id,
                    active: true,
                }
            });


        } catch (err: unknown){
            console.error(`Error in FUAField Sequelize Implementation: Couldnt retrieve FUA Field identified by Id "${id}". `, err);
            (err as Error).message =  `Error in FUAField Sequelize Implementation: Couldnt retrieve FUA Field identified by Id "${id}" . ` + (err as Error).message;
            throw err;
        }     

        return returnedFUAField;
    };

};

export default new FUAFieldImplementation();
