import express from 'express';


// Importing Controller
import { authenticate } from '../middleware/authentication';
import BaseEntityVersionController from '../controllers/BaseEntityVersionController';

// Creating router
const BaseEntityVersionRouter = express.Router();


// Get Base Entity Version by Id (Id or UUID) // id or uuid string
BaseEntityVersionRouter.get(
    '/', 
    authenticate,
    BaseEntityVersionController.getVersionsByIdOrUUID
);

// TODO: Implement Pagination
// Read Base Enitity Versions
/* BaseEntityVersionRouter.get(
    '/', 
    authenticate,
    BaseEntityVersionController.listAll
); */

export default BaseEntityVersionRouter;