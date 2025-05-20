import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res } from '@nestjs/common';
import { DeliverableService } from './deliverable.service';
import { CreateDeliverableDto } from './dto/create-deliverable.dto';
import { UpdateDeliverableDto } from './dto/update-deliverable.dto';
import { MinioService } from '../minio/minio.service';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('Deliverables')
@Controller('deliverables')
export class DeliverableController {
  constructor(
    private readonly deliverableService: DeliverableService,
    private readonly minioService: MinioService,
  ) { }

  @Post()
  @ApiOperation({ summary: 'Create a new deliverable' })
  @ApiResponse({ status: 201, description: 'Deliverable created successfully.' })
  create(@Body() createDeliverableDto: CreateDeliverableDto) {
    return this.deliverableService.create(createDeliverableDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all deliverables' })
  @ApiResponse({ status: 200, description: 'List of deliverables.' })
  findAll() {
    return this.deliverableService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a deliverable by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Deliverable found.' })
  findOne(@Param('id') id: string) {
    return this.deliverableService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a deliverable by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Deliverable updated.' })
  update(@Param('id') id: string, @Body() updateDeliverableDto: UpdateDeliverableDto) {
    return this.deliverableService.update(id, updateDeliverableDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a deliverable by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Deliverable deleted.' })
  remove(@Param('id') id: string) {
    return this.deliverableService.remove(id);
  }

  @Get('download/:objectName')
  @ApiOperation({ summary: 'Download a deliverable file from Minio' })
  @ApiParam({ name: 'objectName', type: String })
  @ApiResponse({ status: 200, description: 'File downloaded.' })
  async downloadDeliverable(
    @Param('objectName') objectName: string,
    @Res() res: Response,
  ) {
    const buffer = await this.minioService.download(this.minioService.getBucketName(), objectName);
    res.setHeader('Content-Disposition', `attachment; filename="${objectName.split('/').pop()}"`);
    res.send(buffer);
  }

  @Get('presigned-url/:objectName')
  @ApiOperation({ summary: 'Get a presigned URL for a deliverable file' })
  @ApiParam({ name: 'objectName', type: String })
  @ApiQuery({ name: 'expires', required: false, type: String, description: 'Expiration time in seconds' })
  @ApiResponse({ status: 200, description: 'Presigned URL generated.' })
  async getPresignedUrl(@Param('objectName') objectName: string, @Query('expires') expires?: string) {
    const expirySeconds = expires ? parseInt(expires, 10) : undefined;
    const url = await this.minioService.getPresignedUrl(this.minioService.getBucketName(), objectName, expirySeconds);
    return { url };
  }
}