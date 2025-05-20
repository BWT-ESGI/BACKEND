import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Group } from './entities/group.entity';
import { SaveGroupDto } from './dto/save-groups.dto';
import { SaveGroupService } from './saveGroup.service';

@ApiTags('Groups')
@Controller('groups')
export class GroupController {
  constructor(
    private readonly groupService: GroupService,
    private readonly saveGroupService: SaveGroupService,
  ) { }

  @Post()
  @ApiOperation({ summary: 'Create a new group' })
  @ApiResponse({ status: 201, description: 'Group created.' })
  create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupService.create(createGroupDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all groups' })
  @ApiResponse({ status: 200, description: 'List of groups.' })
  findAll() {
    return this.groupService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a group by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Group found.' })
  findOne(@Param('id') id: string) {
    return this.groupService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a group by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Group updated.' })
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupService.update(id, updateGroupDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a group by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Group deleted.' })
  remove(@Param('id') id: string) {
    return this.groupService.remove(id);
  }

  @Delete(':idGroup/students/:id/leave')
  @ApiOperation({ summary: 'Remove a student from a group' })
  @ApiParam({ name: 'idGroup', type: String })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Student removed from group.' })
  async leaveGroup(
    @Param('idGroup') idGroup: string,
    @Param('id') id: string,
  ): Promise<Group> {
    return this.groupService.leaveGroup(idGroup, id);
  }

  @Post(':idGroup/students/:id/join')
  async joinGroup(
    @Param('idGroup') idGroup: string,
    @Param('id') id: string,
  ): Promise<Group> {
    return this.groupService.joinGroup(idGroup, id);
  }

  @Get('by-project/:projectId')
  async findByProject(@Param('projectId') projectId: string): Promise<Group[]> {
    return this.groupService.findByProjectId(projectId);
  }

  @Post('save-for-project/:projectId')
  async saveForProject(
    @Param('projectId') projectId: string,
    @Body() groups: SaveGroupDto[],
  ) {
    return this.saveGroupService.saveGroupsForProject(projectId, groups);
  }

  @Get('by-project/:projectId')
  async findByUser(@Param('projectId') projectId: string): Promise<Group[]> {
    return this.groupService.findWithMembersAndDefenses(projectId);
  }
}