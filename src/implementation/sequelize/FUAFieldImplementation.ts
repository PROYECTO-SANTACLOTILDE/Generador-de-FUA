import { FUAField, FUASection } from "../../models";
import { isValidUUIDv4 } from "../../utils/utils";

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
        bodyHeight: number;
        bodyWidth: number;
        top: number;
        left: number;
        labelSize: number;
        // Section data
        FUASectionId: number;
        // Audit Data
        createdBy: string;
    }) {
        let returnedFUAField = null;
        try {
            returnedFUAField = await FUAField.create(data);
        } catch (err: unknown){
            console.error('Error in FUA Field Sequelize Implementation: Couldnt create FUA Field in database using Sequelize. ', err);
            (err as Error).message =  'Error in FUA Field Sequelize Implementation: Couldnt create FUA Field in database using Sequelize: ' + (err as Error).message;
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
            returnedFUAField = await FUAField.findOne({
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
            returnedFUAField = await FUAField.findOne({
                where: {
                    id: id,
                    active: true,
                }
            });


        } catch (err: unknown){
            console.error(`Error in FUA Field Sequelize Implementation - getByIdSequelize: Couldnt retrieve FUA Field identified by Id "${id}". `, err);
            (err as Error).message =  `Error in FUA Field Sequelize Implementation  - getByIdSequelize: Couldnt retrieve FUA Field identified by Id "${id}" . ` + (err as Error).message;
            throw err;
        }     

        return returnedFUAField;
    };

    // Get list by FUA Format Id
    async getListByFUAFormatId(idReceived: number){
        let returnedFUAFields = [];
        try {
            returnedFUAFields = await FUAField.findAll({
                where: {
                    id: idReceived,
                    active: true,
                }
            });
        } catch (err: unknown){
            console.error('Error in FUA Field Sequelize Implementation - getListByFUAFormatId: ', err);
            (err as Error).message =  'Error in FUA Field Sequelize Implementation - getListByFUAFormatId: ' + (err as Error).message;
            throw err;
        }                       
        // If nothing was found, it will return a []
        return returnedFUAFields;
    };

    // Get list by FUA Format UUID
    async getListByFUAFormatUUID(idReceived: string){
        let returnedFUAFields = [];
        try {
            returnedFUAFields = await FUAField.findAll({
                where: {
                    uuid: idReceived,
                    active: true,
                }
            });
        } catch (err: unknown){
            console.error('Error in FUA Field Sequelize Implementation - getListByFUAFormatUUID: ', err);
            (err as Error).message =  'Error in FUA Field Sequelize Implementation - getListByFUAFormatUUID: ' + (err as Error).message;
            throw err;
        }                       
        // If nothing was found, it will return a []
        return returnedFUAFields;
    };

};

export default new FUAFieldImplementation();
