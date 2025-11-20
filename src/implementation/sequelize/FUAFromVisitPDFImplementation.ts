
import { FUAFromVisitPDFModel } from '../../modelsSequelize';



class FUAFromVisitPDFImplementation {
    async createSequelize(data: {
        name: string;
        fileData: Buffer;
        versionTag: string;
        versionCounter: number;
        FUAFromVisitModelId: number;
        BaseEntityVersionModelId: number;
        createdBy: string;
    }) {
        let returnedPDF = null;
        try{
            returnedPDF = await FUAFromVisitPDFModel.create({...data});
        } catch (err: unknown){
            console.error('Error in FUA From Visit PDF Sequelize Implementation: Couldnt create FUA From Visit PDF in database using Sequelize. ', err);
            (err as Error).message =  'Error in FUA From Visit PDF Sequelize Implementation: Couldnt create FUA From Visit PDF in database using Sequelize: ' + (err as Error).message;
            throw err;
        }
        return returnedPDF;
    }

    async getByIdSequelize(id: number){
        let returnedFUAFromVisitPDF = null;
        try{
            returnedFUAFromVisitPDF = await FUAFromVisitPDFModel.findOne({
                where: {
                    id: id,
                    active: true
                }
            })
        } catch (err: unknown){
            console.error(`Error in FUA From Visit PDF Sequelize Implementation: Couldnt retrieve findOne identified by Id "${id}". `, err);
            (err as Error).message =  `Error in FUA From Visit PDF Sequelize Implementation: Couldnt retrieve findOne identified by Id "${id}" . ` + (err as Error).message;
            throw err;
        }
        return returnedFUAFromVisitPDF;
    }
    
    async getByUUIDSequelize(uuid: string ) {

        let returnedFUAFromVisitPDF = null;
        try {
            returnedFUAFromVisitPDF = await FUAFromVisitPDFModel.findOne({
                where: {
                    uuid: uuid,
                    active: true,
                }
            });
            

        } catch (err: unknown){
            console.error(`Error in FUA From Visit PDF Sequelize Implementation: Couldnt retrieve FUA From Visit Id identified by UUID '${uuid}' . `, err);
            (err as Error).message =  `Error in FUA From Visit PDF Sequelize Implementation: Couldnt retrieve FUA From Visit Id identified by UUID '${uuid}' . ` + (err as Error).message;
            throw err;
        }   
        return returnedFUAFromVisitPDF;
    };

    async listAllSequelize(){
        let returnedFUAFromVisitPDFs = [];
        try{
            returnedFUAFromVisitPDFs = await FUAFromVisitPDFModel.findAll({
                attributes: {exclude: ['fileData']},
                where: {
                    active: true,
                }
            });
        } catch (err: unknown){
            console.error('Error in FUA From Visit PDF Sequelize Implementation: Couldnt list all FUA From Visit PDF in database using Sequelize. ', err);
            (err as Error).message =  'Error in FUA From Visit PDF Sequelize Implementation: Couldnt list all FUA From Visit PDF in database using Sequelize. ' + (err as Error).message;
            throw err;
        }
        return returnedFUAFromVisitPDFs;
    }

}

export default new FUAFromVisitPDFImplementation();