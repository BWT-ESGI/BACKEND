import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DeliverableService } from './deliverable.service';
import { CreateDeliverableDto } from './dto/create-deliverable.dto';
import { UpdateDeliverableDto } from './dto/update-deliverable.dto';

@Controller('deliverables')
export class DeliverableController {
  constructor(private readonly deliverableService: DeliverableService) {}

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
}