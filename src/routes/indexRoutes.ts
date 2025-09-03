import express from 'express';

// Import Routes from entities or others
import FUAFormatRouter from './FUAFormatRoutes';
import FUAPageRouter from './FUAPageRoutes';
import FUASectionRouter from './FUASectionRoutes';
import FUAFieldRouter from './FUAFieldRoutes';
import FUAFieldColumnRouter from './FUAFieldColumnRoutes';
import FUAFieldRowRouter from './FUAFieldRowRoutes';
import FUAFieldCellRouter from './FUAFieldCellRoutes';
import FUAFromVisitRouter from './FUAFromVisitRouter';
import FUAFormatFromSchemaRouter from './FUAFormatFromSchemaRoutes';


const globalRouter = express.Router();

//globalRouter.use('/FUAFormat', FUAFormatRouter);
globalRouter.use('/FUAFormat', FUAFormatFromSchemaRouter);
globalRouter.use('/FUAPage', FUAPageRouter);
globalRouter.use('/FUASection', FUASectionRouter);
globalRouter.use('/FUAField', FUAFieldRouter);
globalRouter.use('/FUAFieldColumn', FUAFieldColumnRouter);
globalRouter.use('/FUAFieldRow', FUAFieldRowRouter);
globalRouter.use('/FUAFieldCell', FUAFieldCellRouter);
globalRouter.use('/FUAFromVisit', FUAFromVisitRouter);


export default globalRouter;
