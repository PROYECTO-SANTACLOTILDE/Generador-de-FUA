import express from 'express';

// Importing Controller
import FUAFieldColumnController from '../controllers/FUAFieldColumnController';

// Creating router
const FUAFieldColumnRouter = express.Router();


// Create FUA Field Column
FUAFieldColumnRouter.post('/', FUAFieldColumnController.create); 

// Get FUA Field Column by Id (Id or UUID)
FUAFieldColumnRouter.get('/:id', FUAFieldColumnController.getById);

// Get All FUA Fields Columns
FUAFieldColumnRouter.get('/', FUAFieldColumnController.listAll);


export default FUAFieldColumnRouter;