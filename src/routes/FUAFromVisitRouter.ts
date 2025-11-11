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

// Get All FUA Formats
FUAFromVisitRouter.get('/', FUAFromVisitController.listAll);

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


export default FUAFromVisitRouter;