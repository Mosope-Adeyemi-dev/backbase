import multer from 'multer';
import fs from 'fs';
import logger from '@/utils/logger';

const diskStorage = multer.diskStorage({
    destination(req, file, callback) {
        fs.mkdir(`bucket/${req.params.collection || "avatars"}`, { recursive: true }, (err) => {
            if (err) {
                logger(err)
                callback(new Error("Unable to upload file. Please try again."), "")
            }
            callback(null, `./bucket/${req.params.collection || "avatars"}`)
        })
    },
    filename(req, file, callback) {
        callback(null, `${crypto.randomUUID()}-${file.originalname}`)
    },
})

const diskUpload = multer({
    limits: {
        fileSize: 5 * 1024 * 1024 //5mb
    },
    fileFilter: (req, file, cb) => {
        // Allowed file types: pdf, png, jpeg
        const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true); // Accept the file
        } else {
            cb(new Error('File not allowed. Please upload a pdf, png, jpeg file.')); // Reject the file
        }
    },
    storage: diskStorage
})

export default diskUpload;