import { PartialType } from '@nestjs/swagger';
import { SignUpDto } from 'src/iam/authentication/dto/sign-up.dto';

export class CreateMultipleStudentsDto extends PartialType(SignUpDto) {
    email: string;
    firstName: string;
    lastName: string;
}
