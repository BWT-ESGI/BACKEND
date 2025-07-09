import { Controller, Get, Post, Body, Patch, Param, Delete, Req, NotFoundException } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
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
    
  ) { }

  @Patch('/comparison-result/:id')
  @Auth(AuthType.None)
  @ApiOperation({ summary: 'Met à jour le résultat de comparaison d’un projet' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Champ comparisonResult mis à jour.' })
  async updateComparisonResult(
    @Param('id') id: string,
    @Body('comparisonResult') comparisonResult: any,
  ) {
    return this.projectService.updateProject(id, { comparisonResult });
  }

  @Post()
  @Auth(AuthType.Bearer)
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: 201, description: 'Project created.' })
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectService.create(createProjectDto);
  }

  @Get()
  @Auth(AuthType.Bearer)
  @ApiOperation({ summary: 'Get all projects for the user' })
  @ApiResponse({ status: 200, description: 'List of projects.' })
  findAll(@User() user: UserEntity) {
    return this.projectService.findAll(user);
  }

  @Get(':id')
  @Auth(AuthType.Bearer)
  @ApiOperation({ summary: 'Get a project by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Project found.' })
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(id);
  }

  @Patch(':id')
  @Auth(AuthType.Bearer)
  @ApiOperation({ summary: 'Update a project by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Project updated.' })
  update(@Param('id') id: string, @Body() updateDto: Partial<Project>) {
    return this.projectService.updateProject(id, updateDto);
  }

  @Delete(':id')
  @Auth(AuthType.Bearer)
  @ApiOperation({ summary: 'Delete a project by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Project deleted.' })
  remove(@Param('id') id: string) {
    return this.projectService.remove(id);
  }

  @Post('/callCompareService/:id')
  @Auth(AuthType.Bearer)
  @ApiOperation({ summary: 'Trigger la comparaison des fichiers pour un projet' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 202, description: 'Comparaison déclenchée.' })
  triggerComparison(@Param('id') id: string) {
    return this.projectService.triggerProjectComparison(id);
  }
}