import express from 'express';

// Importing Controller
import FUAFieldController from '../controllers/FUAFieldController';

// Creating router
const FUAFieldRouter = express.Router();


// Create FUA Format
FUAFieldRouter.post('/', FUAFieldController.create); 

// Get FUA Format by Id (Id or UUID)
FUAFieldRouter.get('/:id', FUAFieldController.getById);

// Get All FUA Formats
FUAFieldRouter.get('/', FUAFieldController.listAll);

// Get FUA Formats by FUA Format Identifier
//FUAFieldRouter.get('/', FUAFieldController.getListByFUAFormat);


export default FUAFieldRouter;