import { IsArray, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateSubscriberDto {
  @IsNotEmpty({ message: 'Name không được để trống' })
  name: string;

  @IsEmail({}, { message: 'email phải đúng định dạng' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @IsNotEmpty({ message: 'skills không được để trống' })
  @IsArray({
    message: 'Data không phù hợp định dạng. Vui lòng nhập kiểu array'
  })
  @IsString({ each: true, message: 'skill định dạng string' })
  skills: [];
}
