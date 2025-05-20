import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Auth } from 'src/iam/authentication/decorators/auth.decorator';
import { AuthType } from 'src/iam/authentication/enums/auth-type.enum';
import { Roles } from 'src/iam/authorization/decorators/roles.decorator';
import { Role } from './enums/role.enum';
import { CreateMultipleStudentsDto } from './dto/create-multiple-students';

@ApiTags('Users')
@ApiBearerAuth('jwt')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @Auth(AuthType.Bearer)
  @Roles(Role.Teacher)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created.' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('add-multiple-students')
  @Auth(AuthType.Bearer)
  @Roles(Role.Teacher)
  @ApiOperation({ summary: 'Add multiple students' })
  @ApiResponse({ status: 201, description: 'Multiple students created.' })
  createMultipleStudents(@Body() createUserDto: CreateMultipleStudentsDto[]) {
    return this.usersService.createMultipleStudents(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of users.' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get('students')
  @Auth(AuthType.Bearer)
  @Roles(Role.Teacher)
  @ApiOperation({ summary: 'Get all students' })
  @ApiResponse({ status: 200, description: 'List of students.' })
  findAllStudents() {
    return this.usersService.findAllStudents();
  }

  @Get(':id')
  @Auth(AuthType.Bearer)
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'User found.' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Auth(AuthType.Bearer)
  @Roles(Role.Teacher)
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'User updated.' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Auth(AuthType.Bearer)
  @Roles(Role.Teacher)
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'User deleted.' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Get('/:id/check-registration')
  @Auth(AuthType.None)
  @ApiOperation({ summary: 'Check user registration' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Registration status.' })
  async checkRegistration(@Param('id') id: string) {
    return this.usersService.checkRegistration(id);
  }

  @Put('/:email')
  @Auth(AuthType.None)
  @ApiOperation({ summary: 'Update user profile by email' })
  @ApiParam({ name: 'email', type: String })
  @ApiResponse({ status: 200, description: 'User profile updated.' })
  async updateUserProfile(@Param('email') email: string, @Body() dto: UpdateUserDto) {
    return this.usersService.updateProfile(email, dto);
  }
}
