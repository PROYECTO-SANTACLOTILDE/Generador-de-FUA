import {FUAFormat} from '../models/FUAFormat.js';
import { User } from '../models/User.js';

class FUAFormatService {

    // Creation of FUA Format
    async createFUAFormat(data: { 
        codeName: string; 
        version: string; 
        createdBy: number;
    }) {
        let returnedFUAFormat = null;
        try {
            returnedFUAFormat = await FUAFormat.create(data);
        } catch (error){
            console.error(' Couldnt create FUA Format in database', error);
        }
        

        //Return uuid of the creator user
        const userId = returnedFUAFormat.createdBy;

        try {
            const userFound = await User.findAll({
                attributes: [
                    'uuid'
                ],
                where: {
                    id: userId,
                    active: true
                }
            });

            if (userFound == null) {
                throw new Error("Result is null or undefined");
            }

            if (!Array.isArray(userFound)) {
                throw new Error("Result is not an array");
            }

            if (userFound.length === 0) {
                throw new Error("Result is an empty array");
            }

            if (userFound.length > 1) {
                throw new Error("Result contains more than one object");
            }

        } catch (error) {
            console.error('',error);
        }
        

        console.log(userFound);

        return {
            uuid: returnedFUAFormat.uuid,
            creatorUUID: "xd"
        };
    };
};

export default new FUAFormatService();
