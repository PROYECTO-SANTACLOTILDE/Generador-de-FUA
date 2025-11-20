import express from 'express';

import FUAFromVisitPDFController from '../controllers/FUAFromVisitPDFController';
import { authenticate } from '../middleware/authentication';

const FUAFromVisitPDFRouter = express.Router();

FUAFromVisitPDFRouter.get('/', 
    authenticate,
    FUAFromVisitPDFController.listAll);

FUAFromVisitPDFRouter.get('/:id/getPDF', FUAFromVisitPDFController.getPDF);


export default FUAFromVisitPDFRouter;