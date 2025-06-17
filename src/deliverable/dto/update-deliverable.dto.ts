import { PartialType } from '@nestjs/mapped-types';
import { CreateDeliverableDto } from './create-deliverable.dto';

export class UpdateDeliverableDto extends PartialType(CreateDeliverableDto) {}
// Correction : la validation conditionnelle de maxSize s'applique aussi à l'update