import { Request, Response} from 'express';
import BaseEntityVersionService from '../services/BaseEntityVersionService';


const BaseEntityVersionController = {

    async getVersionsByIdOrUUID (req: Request, res: Response): Promise<void>{
        const payload = {
            uuid: req.body.uuid, 
            type: req.body.type
        };

        let searchedBaseEntityVersions = null;

        try {
            searchedBaseEntityVersions = await BaseEntityVersionService.listVersions(payload);

            // In case nothing was found 
            if(searchedBaseEntityVersions === null){
                res.status(404).json({
                    error: `Base Entity Version by UUID '${payload.uuid}' couldnt be found. `,
                });
                return;
            }
            res.status(200).json(searchedBaseEntityVersions);
        } catch (err: any) {
            res.status(500).json({
                error: 'Failed to get Base Entity Version. (Controller)', 
                message: (err as (Error)).message,
                details: (err as any).details ?? null, 
            });
        }
    }

};

export default BaseEntityVersionController;