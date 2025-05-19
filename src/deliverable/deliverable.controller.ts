import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res } from '@nestjs/common';
import { DeliverableService } from './deliverable.service';
import { CreateDeliverableDto } from './dto/create-deliverable.dto';
import { UpdateDeliverableDto } from './dto/update-deliverable.dto';
import { MinioService } from '../minio/minio.service';
import { Response } from 'express';

@Controller('deliverables')
export class DeliverableController {
  constructor(
    private readonly deliverableService: DeliverableService,
    private readonly minioService: MinioService,
  ) {}

  @Post()
  create(@Body() createDeliverableDto: CreateDeliverableDto) {
    return this.deliverableService.create(createDeliverableDto);
  }

  @Get()
  findAll() {
    return this.deliverableService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deliverableService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDeliverableDto: UpdateDeliverableDto) {
    return this.deliverableService.update(id, updateDeliverableDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deliverableService.remove(id);
  }

  @Get('download/:objectName')
  async downloadDeliverable(
    @Param('objectName') objectName: string,
    @Res() res: Response,
  ) {
    const buffer = await this.minioService.download(this.minioService.getBucketName(), objectName);
    res.setHeader('Content-Disposition', `attachment; filename="${objectName.split('/').pop()}"`);
    res.send(buffer);
  }

  @Get('presigned-url/:objectName')
  async getPresignedUrl(@Param('objectName') objectName: string, @Query('expires') expires?: string) {
    const expirySeconds = expires ? parseInt(expires, 10) : undefined;
    const url = await this.minioService.getPresignedUrl(this.minioService.getBucketName(), objectName, expirySeconds);
    return { url };
  }
}