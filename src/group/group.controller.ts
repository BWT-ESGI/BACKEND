import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { ApiTags } from '@nestjs/swagger';
import { Group } from './entities/group.entity';
import { SaveGroupDto } from './dto/save-groups.dto';
import { SaveGroupService } from './saveGroup.service';

@ApiTags('Groups')
@Controller('groups')
export class GroupController {
  constructor(
    private readonly groupService: GroupService,
    private readonly saveGroupService: SaveGroupService,
  ) {}

  @Post()
  create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupService.create(createGroupDto);
  }

  @Get()
  findAll() {
    return this.groupService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupService.update(id, updateGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupService.remove(id);
  }

  @Delete(':idGroup/students/:id/leave')
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