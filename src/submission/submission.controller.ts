import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { Response } from 'express';
import { MinioService } from '@/minio/minio.service';

@Controller('submissions')
export class SubmissionController {
  constructor(
    private readonly submissionService: SubmissionService,
    private readonly minioService: MinioService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('archive'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateSubmissionDto,
  ) {
    return this.submissionService.create(
      dto,
      file?.buffer,
      file?.originalname,
      file?.size,
    );
  }

  @Get()
  findAll() {
    return this.submissionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.submissionService.findOne(id);
  }

  @Get('deliverable/:id')
  findByDeliverable(@Param('id') id: string) {
    return this.submissionService.findByDeliverable(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSubmissionDto) {
    return this.submissionService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.submissionService.remove(id);
  }

  @Get('download/:id')
  async downloadArchive(@Param('id') id: string, @Res() res: Response) {
    const submission = await this.submissionService.findOne(id);
    if (!submission.archiveObjectName) {
      return res.status(404).send('Aucun fichier pour cette soumission');
    }
    const buffer = await this.minioService.download(
      this.minioService.getBucketName(),
      submission.archiveObjectName,
    );
    res.setHeader('Content-Disposition', `attachment; filename="${submission.filename || 'archive'}"`);
    res.send(buffer);
  }
}