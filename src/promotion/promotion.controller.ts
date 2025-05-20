import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { UpdateStudentsPromotionDto } from './dto/update-students-promotion.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Promotions')
@Controller('promotions')
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new promotion' })
  @ApiResponse({ status: 201, description: 'Promotion created.' })
  create(@Body() createPromotionDto: CreatePromotionDto) {
    return this.promotionService.create(createPromotionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all promotions' })
  @ApiResponse({ status: 200, description: 'List of promotions.' })
  findAll() {
    return this.promotionService.findAll();
  }

  @Get('/user/:id')
  @ApiOperation({ summary: 'Get all promotions by user ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Promotions for user.' })
  findAllByUser(@Param('id') id: string) {
    return this.promotionService.findAllByUser(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a promotion by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Promotion found.' })
  findOne(@Param('id') id: string) {
    return this.promotionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a promotion by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Promotion updated.' })
  update(@Param('id') id: string, @Body() updatePromotionDto: UpdatePromotionDto) {
    return this.promotionService.update(id, updatePromotionDto);
  }

  @Patch(':id/edit-students')
  @ApiOperation({ summary: 'Edit students in a promotion' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Students edited in promotion.' })
  editStudents(@Param('id') id: string, @Body() updateStudentsPromotionDto: UpdateStudentsPromotionDto) {
    return this.promotionService.editStudents(id, updateStudentsPromotionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a promotion by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Promotion deleted.' })
  remove(@Param('id') id: string) {
    return this.promotionService.remove(id);
  }
}