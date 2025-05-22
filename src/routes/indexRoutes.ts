import express from 'express';

// Import Routes from entities or others
import FUAFormatRouter from './FUAFormatRoutes';
import FUAPageRouter from './FUAPageRoutes';

const globalRouter = express.Router();

globalRouter.use('/FUAFormat', FUAFormatRouter);
globalRouter.use('/FUAPage', FUAPageRouter);

export default globalRouter;
