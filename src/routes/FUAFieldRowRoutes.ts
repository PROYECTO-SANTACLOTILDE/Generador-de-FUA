import express from 'express';

// Importing Controller
import FUAFieldRowController from '../controllers/FUAFieldRowController';

// Creating router
const FUAFieldRowRouter = express.Router();


// Create FUA Field Column
FUAFieldRowRouter.post('/', FUAFieldRowController.create); 

// Get FUA Field Column by Id (Id or UUID)
FUAFieldRowRouter.get('/:id', FUAFieldRowController.getById);

// Get All FUA Fields Columns
FUAFieldRowRouter.get('/', FUAFieldRowController.listAll);


export default FUAFieldRowRouter;