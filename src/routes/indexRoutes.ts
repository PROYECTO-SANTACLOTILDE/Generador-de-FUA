import express from 'express';

// Import Routes from entities or others
import FUAFormatRouter from './FUAFormatRoutes';
import FUAPageRouter from './FUAPageRoutes';
import FUASectionRouter from './FUASectionRoutes';
import FUAFieldRouter from './FUAFieldRoutes';
import FUAFieldColumnRouter from './FUAFieldColumnRoutes';

const globalRouter = express.Router();

globalRouter.use('/FUAFormat', FUAFormatRouter);
globalRouter.use('/FUAPage', FUAPageRouter);
globalRouter.use('/FUASection', FUASectionRouter);
globalRouter.use('/FUAField', FUAFieldRouter);
globalRouter.use('/FUAFieldColumn', FUAFieldColumnRouter);

export default globalRouter;
