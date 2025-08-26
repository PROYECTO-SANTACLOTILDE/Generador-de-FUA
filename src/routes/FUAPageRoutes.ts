import express from 'express';

// Importing Controller
import FUAPageController from '../controllers/FUAPageController';

// Creating router
const FUAPageRouter = express.Router();


// Create FUA Format
FUAPageRouter.post('/', FUAPageController.createFUAPage); 

// Get FUA Format by Id (Id or UUID)
FUAPageRouter.get('/:id', FUAPageController.getFUAPageById);

// Get All FUA Formats
FUAPageRouter.get('/', FUAPageController.listAllFUAPages);

export default FUAPageRouter;