import express from 'express';

// Import Routes from entities or others
import FUAFormatRouter from './FUAFormatRoutes';

const globalRouter = express.Router();

globalRouter.use('/FUAFormat', FUAFormatRouter);


export default globalRouter;
