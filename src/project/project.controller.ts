import { Controller, Get, Post, Body, Patch, Param, Delete, Req, NotFoundException } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { ApiTags } from '@nestjs/swagger';
import { Project } from './entities/project.entity';
import { AuthType } from '@/iam/authentication/enums/auth-type.enum';
import { Auth } from '@/iam/authentication/decorators/auth.decorator';
import { User } from '@/common/decorators/user.decorator';
import { User as UserEntity } from '@/users/entities/user.entity';

@ApiTags('Projects')
@Controller('projects')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
  ) {}

  @Post()
  @Auth(AuthType.Bearer)
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectService.create(createProjectDto);
  }

  @Get()
  @Auth(AuthType.Bearer)
  findAll(@User() user: UserEntity) {
    return this.projectService.findAll(user);
  }

  @Get(':id')
  @Auth(AuthType.Bearer)
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(id);
  }

  @Patch(':id')
  @Auth(AuthType.Bearer)
  update(@Param('id') id: string, @Body() updateDto: Partial<Project>) {
    return this.projectService.updateProject(id, updateDto);
  }

  @Delete(':id')
  @Auth(AuthType.Bearer)
  remove(@Param('id') id: string) {
    return this.projectService.remove(id);
  }
}