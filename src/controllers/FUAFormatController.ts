import { Request, Response} from 'express';
import FUAFormatService from '../services/FUAFormatService';


const FUAFormatController = {

    async createFUAFormat  (req: Request, res: Response): Promise<void>  {
        const payload = req.body;
        let newFUAFormat = null;
        try {
            newFUAFormat = await FUAFormatService.createFUAFormat(payload);
            res.status(201).json(newFUAFormat);    
        } catch (err: any) {
            res.status(500).json({
                error: 'Failed to create FUA Format. ', 
                detail: (err as (Error)).message,
            });
        }
            
    },

    // Pending pagination
    async listAllFUAFormats (req: Request, res: Response): Promise<void>  {
        try {
            const listFUAFormats = await FUAFormatService.listAllFUAFormats();
            res.status(201).json(listFUAFormats);
        } catch (err: any) {
            res.status(500).json({
                error: 'Failed to list FUA Formats. ', 
                detail: (err as (Error)).message,
            });
        }    
    },
};

export default FUAFormatController;

