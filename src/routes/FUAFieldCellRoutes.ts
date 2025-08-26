import express from 'express';

// Importing Controller
import FUAFieldCellController from '../controllers/FUAFieldRowController';

// Creating router
const FUAFieldCellRouter = express.Router();


// Create FUA Field Cell
FUAFieldCellRouter.post('/', FUAFieldCellController.create); 

// Get FUA Field Cell by Id (Id or UUID)
FUAFieldCellRouter.get('/:id', FUAFieldCellController.getById);

// Get All FUA Fields Cells
FUAFieldCellRouter.get('/', FUAFieldCellController.listAll);


export default FUAFieldCellRouter;