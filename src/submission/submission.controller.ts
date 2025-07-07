import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Res, NotFoundException } from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { Response } from 'express';
import { MinioService } from '@/minio/minio.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Submission } from './entities/submission.entity';

@ApiTags('Submissions')
@Controller('submissions')
export class SubmissionController {
  constructor(
    private readonly submissionService: SubmissionService,
    private readonly minioService: MinioService,
  ) { }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Create a new submission' })
  @ApiResponse({ status: 201, description: 'Submission created successfully.' })
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateSubmissionDto,
  ) {
    try {
      const result = await this.submissionService.create(
        dto,
        file?.buffer,
        file?.originalname,
        file?.size,
      );
      return { message: 'Soumission créée', submission: result };
    } catch (err) {
      console.error('Erreur lors de la création de la soumission:', err);
      return {
        error: 'Erreur lors de la création de la soumission',
        details: err?.message || err,
      };
    }
  }

  @Get('getAll')
  @ApiOperation({ summary: 'Get all submissions' })
  @ApiResponse({ status: 200, description: 'List of submissions.' })
  findAll() {
    return this.submissionService.findAll();
  }

  @Get('getByGroupId/:groupId')
  @ApiOperation({ summary: 'Get a submission by ID' })
  @ApiParam({ name: 'groupId', type: String })
  @ApiResponse({ status: 200, description: 'Submission found.' })
  async findByGroup(
    @Param('groupId') groupId: string,
  ): Promise<Submission[]> {
    const subs = await this.submissionService.findByGroupId(groupId);
    return subs;
  }

  @Get('deliverable/:id')
  @ApiOperation({ summary: 'Get submissions by deliverable ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Submissions for the deliverable.' })
  findByDeliverable(@Param('id') id: string) {
    return this.submissionService.findByDeliverable(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a submission by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Submission updated.' })
  update(@Param('id') id: string, @Body() dto: UpdateSubmissionDto) {
    return this.submissionService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a submission by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Submission deleted.' })
  remove(@Param('id') id: string) {
    return this.submissionService.remove(id);
  }

  @Get('download/:id')
  @ApiOperation({ summary: 'Download the archive file for a submission' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Archive file downloaded.' })
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