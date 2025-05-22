import express from 'express';

// Importing Controller
import FUAFormatController from "../controllers/FUAFormatController";

// Creating router
const FUAFormatRouter = express.Router();


// Create FUA Format
FUAFormatRouter.post('/', FUAFormatController.createFUAFormat); 

// Get FUA Format by Id (Id or UUID)
FUAFormatRouter.get('/:id', FUAFormatController.getFUAFormatById);

// Read All FUA Formats
FUAFormatRouter.get('/', FUAFormatController.listAllFUAFormats);

export default FUAFormatRouter;