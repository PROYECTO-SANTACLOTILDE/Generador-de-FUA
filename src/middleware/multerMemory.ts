import { Request, Response, NextFunction } from 'express';
import multer, { MulterError } from 'multer';
import { inspect } from "util";

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
        return res.status(400).json({ 
            error: `Error in Multer: ${routeSource}. (Route): Multer Error`, 
            message: err.message,
            details: inspect(err, { depth: 100, colors: false }), 
        });
      } else if (err) {
        return res.status(500).json({ 
            error: " Routes: unexpected error.", 
            details: err.message 
        });
      }
      next();
    });
  };
}