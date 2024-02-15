/* eslint-disable @typescript-eslint/no-unused-vars */
// Class = object
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  password: string;
  name: string;
  address: string;
}
