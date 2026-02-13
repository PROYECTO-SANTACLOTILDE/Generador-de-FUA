import { Request, Response, NextFunction } from 'express';
import multer, { MulterError } from 'multer';
import { inspect } from "util";
import { loggerInstance } from '../middleware/logger/models/typescript/Logger';
import { Logger_LogLevel } from './logger/models/typescript/LogLevel';
import { Logger_SecurityLevel } from './logger/models/typescript/SecurityLevel';
import { Logger_LogType } from './logger/models/typescript/LogType';
import { Log } from './logger/models/typescript/Log';


export const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fieldSize: 5 * 1024 * 1024 ,} // Max 5 MB
});

// Examples
const uploadSingleFile = upload.single('exampleFile');
const uploadArrayOfFiles = upload.array('exampleArrayFile', 12);
const multipleFiles = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'gallery', maxCount: 8 }]);

// Error handler for Multer
export function multerErrorHandler(
  uploader: ReturnType<typeof upload.single> | ReturnType<typeof upload.array> | ReturnType<typeof upload.fields>,
  routeSource : string
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    uploader(req, res, (err: any) => {
      if (err instanceof MulterError) {
        const auxLog = new Log({
          timeStamp: new Date(),
          logLevel: Logger_LogLevel.ERROR,
          securityLevel: Logger_SecurityLevel.Admin,
          logType: Logger_LogType.CREATE,
          environmentType: loggerInstance.enviroment.toString(),
          description: `[${routeSource}] MulterError: ${err.message}\n${inspect(err, { depth: 100, colors: false })}`
        });
        loggerInstance.printLog(auxLog, [
          { name: "terminal" },
          { name: "file", file: "logs/auxLog.log"},
          { name: "database" }
        ]);
        return res.status(400).json({ 
            error: `Error in Multer: ${routeSource}. (Route): Multer Error`, 
            message: err.message,
            details: inspect(err, { depth: 100, colors: false }), 
        });
      } else if (err) {
        const auxLog = new Log({
          timeStamp: new Date(),
          logLevel: Logger_LogLevel.ERROR,
          securityLevel: Logger_SecurityLevel.Admin,
          logType: Logger_LogType.CREATE,
          environmentType: loggerInstance.enviroment.toString(),
          description: `[${routeSource}] Unexpected error: ${err.message ?? ''}\n${err.details ?? ''}`
        });
        loggerInstance.printLog(auxLog, [
          { name: "terminal" },
          { name: "file", file: "logs/auxLog.log"},
          { name: "database" }
        ]);
        return res.status(500).json({ 
            error: " Routes: unexpected error.", 
            details: err.message 
        });
      }
      next();
    });
  };
}