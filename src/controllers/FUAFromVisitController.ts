import { Request, Response} from 'express';
import FUASectionService from '../services/FUASectionService';
import FUAFromVisitService from '../services/FUAFromVisitService';



const FUAFromVisitController = {

    async create  (req: Request, res: Response): Promise<void>  {
        const payload = req.body;
        let newFUASection = null;
        try {
            newFUASection = await FUAFromVisitService.create(payload);
            res.status(201).json(newFUASection);    
        } catch (err: any) {
            res.status(500).json({
                error: 'Failed to create FUA From Visit. (Controller)', 
                message: (err as (Error)).message,
                details: (err as any).details ?? null, 
            });
        }
            
    },

    // Pending pagination
    async listAll (req: Request, res: Response): Promise<void>  {
        try {
            const listFUASection = await FUAFromVisitService.listAll();
            res.status(200).json(listFUASection);
        } catch (err: any) {
            res.status(500).json({
                error: 'Failed to list FUA From Visit. (Controller)', 
                message: (err as (Error)).message,
                details: (err as any).details ?? null, 
            });
        }    
    },

    async getById (req: Request, res: Response): Promise<void>  {
        const payload = req.params.id;

        let searchedFUA = null;

        try {
            searchedFUA = await FUAFromVisitService.getByIdOrUUID(payload);
            
            // In case nothing was found 
            if(searchedFUA === null){
                res.status(404).json({
                    error: `FUA From Visit by Id or UUID '${payload}' couldnt be found. `,
                });
                return;
            }

            res.status(200).json(searchedFUA);    
        } catch (err: any) {
            res.status(500).json({
                error: 'Failed to get FUA From Visit. (Controller)', 
                message: (err as (Error)).message,
                details: (err as any).details ?? null, 
            });
        }
            
    },
};

export default FUAFromVisitController;

