import { Injectable, Inject } from '@nestjs/common';
import * as Minio from 'minio';

@Injectable()
export class MinioService {
  private client: Minio.Client;
  private readonly bucketName = process.env.MINIO_BUCKET_NAME || 'bwt';

  constructor() {
    const minioPort = process.env.MINIO_FIRST_PORT
      ? parseInt(process.env.MINIO_FIRST_PORT, 10)
      : 9000;
    const minioEndpoint = process.env.MINIO_ENDPOINT || 'localhost';
    const minioUseSSL = process.env.MINIO_USE_SSL === 'true';
    const minioAccessKey = process.env.MINIO_ROOT_USER || 'default-access-key';
    const minioSecretKey =
      process.env.MINIO_ROOT_PASSWORD || 'default-secret-key';

    this.client = new Minio.Client({
      endPoint: minioEndpoint,
      port: minioPort,
      useSSL: minioUseSSL,
      accessKey: minioAccessKey,
      secretKey: minioSecretKey,
    });
  }

  async upload(
    bucket: string,
    objectName: string,
    buffer: Buffer,
    size: number,
  ): Promise<string> {
    const exists = await this.client.bucketExists(bucket);
    if (!exists) {
      await this.client.makeBucket(bucket, '');
    }
    await this.client.putObject(bucket, objectName, buffer, size);
    return objectName;
  }

  getPresignedUrl(
    bucket: string,
    objectName: string,
    expirySeconds = 24 * 60 * 60,
  ): Promise<string> {
    return this.client.presignedUrl('GET', bucket, objectName, expirySeconds);
  }

  async download(bucket: string, objectName: string): Promise<Buffer> {
    const stream = await this.client.getObject(bucket, objectName);
    const chunks: Buffer[] = [];
    return new Promise((resolve, reject) => {
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', reject);
    });
  }

  // Ajout d'un getter public pour le nom du bucket
  public getBucketName(): string {
    return this.bucketName;
  }
}