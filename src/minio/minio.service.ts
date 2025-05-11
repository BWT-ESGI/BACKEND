import { Injectable, Inject } from '@nestjs/common';
import { Client } from 'minio';

@Injectable()
export class MinioService {
  constructor(@Inject('MINIO_CLIENT') private readonly client: Client) {}

  async upload(
    bucket: string,
    objectName: string,
    buffer: Buffer,
    size: number,
  ): Promise<string> {
    // Crée le bucket si nécessaire
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
}