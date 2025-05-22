import { Request, Response} from 'express';
import FUAPageService from '../services/FUAPageService';
import FUAFormatService from '../services/FUAFormatService';



const FUAPageController = {

    async createFUAPage  (req: Request, res: Response): Promise<void>  {
        const payload = req.body;
        let newFUAPage = null;
        try {
            newFUAPage = await FUAPageService.create(payload);
            res.status(201).json(newFUAPage);    
        } catch (err: any) {
            res.status(500).json({
                error: 'Failed to create FUA Page. (Controller)', 
                message: (err as (Error)).message,
                details: (err as any).details ?? null, 
            });
        }
            
    },

    // Pending pagination
    async listAllFUAPages (req: Request, res: Response): Promise<void>  {
        try {
            const listFUAFormats = await FUAPageService.listAll();
            res.status(200).json(listFUAFormats);
        } catch (err: any) {
            res.status(500).json({
                error: 'Failed to list FUA Formats. (Controller)', 
                message: (err as (Error)).message,
                details: (err as any).details ?? null, 
            });
        }    
    },

    async getFUAPageById (req: Request, res: Response): Promise<void>  {
        const payload = req.params.id;

        let searchedFUAFormat = null;

        try {
            searchedFUAFormat = await FUAFormatService.getByIdOrUUID(payload);
            
            // In case nothing was found 
            if(searchedFUAFormat === null){
                res.status(404).json({
                    error: `FUA Page by Id or UUID '${payload}' couldnt be found. `,
                });
                return;
            }

            res.status(200).json(searchedFUAFormat);    
        } catch (err: any) {
            res.status(500).json({
                error: 'Failed to get FUA Page. (Controller)', 
                message: (err as (Error)).message,
                details: (err as any).details ?? null, 
            });
        }
            
    },
};

export default FUAPageController;

