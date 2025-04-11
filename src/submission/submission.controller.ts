import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';

@Controller('submissions')
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @Post()
  create(@Body() dto: CreateSubmissionDto) {
    return this.submissionService.create(dto);
  }

  @Get()
  findAll() {
    return this.submissionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.submissionService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSubmissionDto) {
    return this.submissionService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.submissionService.remove(id);
  }
}