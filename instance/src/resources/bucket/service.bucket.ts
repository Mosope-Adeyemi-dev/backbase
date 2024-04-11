import translateError from "@/utils/mongodb.helper";
import logger from "@/utils/logger";
import fs from 'fs';
import path from 'path';

class BucketService {
    public async getFile(bucketName: string, filename: string): Promise<any> {
        try {
            const filePath = path.join('./bucket', bucketName, filename)
            logger(filePath)
            if (!fs.existsSync(filePath)) throw new Error(`File not found.`)

            return filePath;
        } catch (error: any) {
            logger(error)
            throw new Error(translateError(error)[0] || 'Unable to retrieve data')
        }
    }

    public async getContentType(filename: string ): Promise<string> {
        const ext = path.extname(filename);
        switch (ext.toLowerCase()) {
          case '.pdf':
            return 'application/pdf';
          case '.png':
            return 'image/png';
          case '.jpg':
          case '.jpeg':
            return 'image/jpeg';
          default:
            return 'application/octet-stream';
        }
      }
}

export default BucketService