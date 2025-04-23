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
import { DefenseService } from './defense.service';
import { CreateDefenseDto } from './dto/create-defense.dto';
import { UpdateDefenseDto } from './dto/update-defense.dto';

@Controller('defenses')
export class DefenseController {
  constructor(private readonly defenseService: DefenseService) {}

  @Post(':groupId')
  create(
    @Param('groupId') groupId: string,
    @Body() dto: CreateDefenseDto,
  ) {
    return this.defenseService.create(groupId, dto);
  }

  @Get(':groupId')
  findAll(@Param('groupId') groupId: string) {
    return this.defenseService.findAllByGroup(groupId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateDefenseDto,
  ) {
    return this.defenseService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.defenseService.remove(id);
  }

  @Get('findByActiveGroups/:projectId')
  findByActiveGroups(@Param('projectId') projectId: string) {
    return this.defenseService.findByActiveGroups(projectId);
  }
}
