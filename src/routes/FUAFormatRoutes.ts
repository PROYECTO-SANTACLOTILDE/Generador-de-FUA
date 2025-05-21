import express from 'express';

// Importing Controller
import FUAFormatController from "../controllers/FUAFormatController";

// Creating router
const FUAFormatRouter = express.Router();


// Create FUA Format
FUAFormatRouter.post('/', FUAFormatController.createFUAFormat); 

// Read All FUA Formats
FUAFormatRouter.get('/', FUAFormatController.listAllFUAFormats);

export default FUAFormatRouter;