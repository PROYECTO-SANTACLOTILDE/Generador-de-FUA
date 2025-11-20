
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
}

export default new FUAFromVisitPDFImplementation();