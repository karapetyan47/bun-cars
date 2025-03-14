import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

class Aws3 {
  #client: S3Client;

  constructor() {
    this.#client = new S3Client({
      region: 'us-east-1',
      ...(Bun.env.MODE === 'DEVELOPMENT' && {
        endpoint: Bun.env.AWS_ENDPOINT,
        credentials: {
          accessKeyId: Bun.env.AWS_ACCESS_KEY as string,
          secretAccessKey: Bun.env.AWS_SECRET_KEY as string,
        },
        forcePathStyle: true,
      }),
    });
  }

  getFileUrl(path: string): string {
    return `${Bun.env.AWS_ENDPOINT}${path}`;
  }

  private getFilePath(bucket: string, key: string): string {
    return `/${bucket}/${key}`;
  }

  async uploadFile(bucket: string, key: string, file: File): Promise<string> {
    try {
      const fileBuffer = await file.arrayBuffer();
      const uploadParams = {
        Bucket: bucket,
        Key: key,
        Body: Buffer.from(fileBuffer),
        ContentType: file.type,
      };

      await this.#client.send(new PutObjectCommand(uploadParams));

      return this.getFilePath(bucket, key);
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }
}

const Aws3Instance = new Aws3();

export default Aws3Instance;
