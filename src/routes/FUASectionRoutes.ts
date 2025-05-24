import express from 'express';

// Importing Controller
import FUASectionController from '../controllers/FUASectionController';

// Creating router
const FUASectionRouter = express.Router();


// Create FUA Format
FUASectionRouter.post('/', FUASectionController.create); 

// Get FUA Format by Id (Id or UUID)
FUASectionRouter.get('/:id', FUASectionController.getById);

// Get All FUA Formats
FUASectionRouter.get('/', FUASectionController.listAll);


export default FUASectionRouter;