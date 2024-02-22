import { OmitType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends OmitType(CreateUserDto, [
  'password'
] as const) {
  @IsNotEmpty({ message: 'Id không được để trống' })
  _id: string;
}
