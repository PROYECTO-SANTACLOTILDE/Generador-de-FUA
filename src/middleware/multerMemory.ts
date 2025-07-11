import multer from 'multer';

export const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fieldSize: 5 * 1024 * 1024 ,} // Max 5 MB
});

// Examples
const uploadSingleFile = upload.single('exampleFile');
const uploadArrayOfFiles = upload.array('exampleArrayFile', 12);
const multipleFiles = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'gallery', maxCount: 8 }]);

