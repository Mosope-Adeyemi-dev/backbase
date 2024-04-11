import { S3Client } from '@aws-sdk/client-s3'
import multer from 'multer'
import multerS3 from 'multer-s3'
import path from 'path'

const s3Config = new S3Client({
    region: 'us-east-2',
    credentials: {
        accessKeyId: `${process.env.AWS_ACCESS_KEY}`,
        secretAccessKey: `${process.env.AWS_SECRET_ACCESS_KEY}`
    }
})
const bucketName = `${process.env.AWS_BUCKET}`

const s3Upload = multer({
    storage: multerS3({
        s3: s3Config,
        bucket: bucketName,
        metadata(req, file, callback) {
            callback(null, { fieldName: file.filename })
        },
        key(req, file, callback) {
            callback(null, Date.now().toString())
        },
    })
})




export default s3Upload