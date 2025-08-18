import express from 'express';


// Importing Controller
import FUAFormatFromSchemaController from '../controllers/FUAFormatFromSchemaController';
import { upload } from '../middleware/multerMemory';
import { authenticate } from '../middleware/authentication';

// Creating router
const FUAFormatFromSchemaRouter = express.Router();

// Create FUA Format
let createUpload = upload.fields([{ name: 'formatPayload', maxCount: 1 }, { name: 'name', maxCount: 1 }, { name: 'token', maxCount: 1}]);
FUAFormatFromSchemaRouter.post(
    '/', 
    authenticate,
    createUpload,    
    FUAFormatFromSchemaController.create
); 

// Get FUA Format by Id (Id or UUID)
FUAFormatFromSchemaRouter.get(
    '/:id', 
    authenticate,
    FUAFormatFromSchemaController.getById
);

// Read All FUA Formats
FUAFormatFromSchemaRouter.get(
    '/', 
    authenticate,
    FUAFormatFromSchemaController.listAll
);

// Render a FUA Format
FUAFormatFromSchemaRouter.get(
    '/:id/render',
    authenticate, 
    FUAFormatFromSchemaController.render
);

// Edit FUA Format
let edit = upload.fields([{ name: 'formatPayload', maxCount: 1 }, { name: 'name', maxCount: 1 }, { name: 'token', maxCount: 1}]);
FUAFormatFromSchemaRouter.put(
    '/:id',
    authenticate,
    edit,    
    FUAFormatFromSchemaController.edit
); 

export default FUAFormatFromSchemaRouter;