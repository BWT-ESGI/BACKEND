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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/iam/authentication/decorators/auth.decorator';
import { AuthType } from 'src/iam/authentication/enums/auth-type.enum';
import { Roles } from 'src/iam/authorization/decorators/roles.decorator';
import { Role } from './enums/role.enum';

@ApiTags('Users')
@ApiBearerAuth('jwt')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Auth(AuthType.Bearer)
  @Roles(Role.Teacher)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Auth(AuthType.Bearer)
  @Roles(Role.Teacher)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Auth(AuthType.Bearer)
  @Roles(Role.Teacher)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @Auth(AuthType.Bearer)
  @Roles(Role.Teacher)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @Auth(AuthType.Bearer)
  @Roles(Role.Teacher)
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Get('/:id/check-registration')
  @Auth(AuthType.None)
  async checkRegistration(@Param('id') id: string) {
    return this.usersService.checkRegistration(id);
  }

  @Put('/:email')
  @Auth(AuthType.None)
  async updateUserProfile(@Param('email') email: string, @Body() dto: UpdateUserDto) {
    return this.usersService.updateProfile(email, dto);
  }
}
