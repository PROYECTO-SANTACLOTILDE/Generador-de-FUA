import express from 'express';


// Importing Controller
import FUAFormatFromSchemaController from '../controllers/FUAFormatFromSchemaController';
import { upload } from '../middleware/multerMemory';

// Creating router
const FUAFormatFromSchemaRouter = express.Router();

// Create FUA Format
let createUpload = upload.fields([{ name: 'formatPayload', maxCount: 1 }, { name: 'name', maxCount: 1 }, { name: 'token', maxCount: 1}]);
FUAFormatFromSchemaRouter.post('/', createUpload ,FUAFormatFromSchemaController.create); 

// Get FUA Format by Id (Id or UUID)
FUAFormatFromSchemaRouter.get('/:id', FUAFormatFromSchemaController.getById);

// Read All FUA Formats
FUAFormatFromSchemaRouter.get('/', FUAFormatFromSchemaController.listAll);

// ReNnder a FUA Format
//FUAFormatFromSchemaRouter.get('/:id/render', FUAFormatFromSchemaController.render);

export default FUAFormatFromSchemaRouter;