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

@Controller('api/defense')
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
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDefenseDto,
  ) {
    return this.defenseService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.defenseService.remove(id);
  }
}
