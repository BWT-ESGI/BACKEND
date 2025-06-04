import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { DefenseService } from './defense.service';
import { CreateDefenseDto } from './dto/create-defense.dto';
import { UpdateDefenseDto } from './dto/update-defense.dto';

@ApiTags('Defenses')
@Controller('defenses')
export class DefenseController {
  constructor(private readonly defenseService: DefenseService) { }

  @Post(':groupId')
  @ApiOperation({ summary: 'Create a new defense for a group' })
  @ApiParam({ name: 'groupId', type: String })
  @ApiResponse({ status: 201, description: 'Defense created.' })
  create(
    @Param('groupId') groupId: string,
    @Body() dto: CreateDefenseDto,
  ) {
    return this.defenseService.create(groupId, dto);
  }

  @Get(':groupId')
  @ApiOperation({ summary: 'Get all defenses for a group' })
  @ApiParam({ name: 'groupId', type: String })
  @ApiResponse({ status: 200, description: 'List of defenses.' })
  findAll(@Param('groupId') groupId: string) {
    return this.defenseService.findAllByGroup(groupId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a defense by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Defense updated.' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateDefenseDto,
  ) {
    return this.defenseService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a defense by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Defense deleted.' })
  remove(@Param('id') id: string) {
    return this.defenseService.remove(id);
  }

  @Get('findByActiveGroups/:projectId')
  @ApiOperation({ summary: 'Get defenses by active groups for a project' })
  @ApiParam({ name: 'projectId', type: String })
  @ApiResponse({ status: 200, description: 'Defenses for active groups.' })
  findByActiveGroups(@Param('projectId') projectId: string) {
    return this.defenseService.findByActiveGroups(projectId);
  }

  @Get('byProject/:projectId')
  @ApiOperation({ summary: 'Get all defenses for a project' })
  @ApiParam({ name: 'projectId', type: String })
  @ApiResponse({ status: 200, description: 'List of defenses for the project.' })
  findAllByProject(@Param('projectId') projectId: string) {
    return this.defenseService.findAllByProject(projectId);
  }
}
