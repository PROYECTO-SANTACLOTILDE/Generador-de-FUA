import express from 'express';

// Importing Controller
import FUAFromVisitController from '../controllers/FUAFromVisitController';

// Creating router
const FUAFromVisitRouter = express.Router();


// Create FUA Format
FUAFromVisitRouter.post('/', FUAFromVisitController.create); 

// Get FUA Format by Id (Id or UUID)
FUAFromVisitRouter.get('/:id', FUAFromVisitController.getById);

// Get All FUA Formats
FUAFromVisitRouter.get('/', FUAFromVisitController.listAll);


export default FUAFromVisitRouter;