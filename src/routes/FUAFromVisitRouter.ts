import express from 'express';

// Importing Controller
import FUAFromVisitController from '../controllers/FUAFromVisitController';
import { upload } from '../middleware/multerMemory';
import { authenticate } from '../middleware/authentication';

// Creating router
const FUAFromVisitRouter = express.Router();


// Create FUA Format
FUAFromVisitRouter.post('/', FUAFromVisitController.create); 

// Get FUA Format by Id (Id or UUID)
FUAFromVisitRouter.get('/:id', FUAFromVisitController.getById);

FUAFromVisitRouter.get('/:id/addFUAinQueueFromDatabase', FUAFromVisitController.addFUAinQueueFromDatabase);

// Get All FUA Formats
FUAFromVisitRouter.get('/',
  authenticate, 
  FUAFromVisitController.listAll);

const uploadPdf = upload.fields([{ name: 'pdf', maxCount: 1 }]);
FUAFromVisitRouter.post(
  '/hashSignatureVerification',
  authenticate,
  uploadPdf,
  FUAFromVisitController.hashSignatureVerification
);

FUAFromVisitRouter.post(
  '/generateSignedPdf',
  authenticate,
  FUAFromVisitController.generateSignedPdf
);

FUAFromVisitRouter.post(
  '/addFUAinQueue',
  authenticate,
  FUAFromVisitController.addFUAinQueue
);

FUAFromVisitRouter.post(
  '/removeFUAFromQueue',
  authenticate,
  FUAFromVisitController.removeFUAFromQueue
);




export default FUAFromVisitRouter;