import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested
} from 'class-validator';
import mongoose from 'mongoose';

class Company {
  @IsNotEmpty()
  _id: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  name: string;
}

export class CreateJobDto {
  @IsNotEmpty({ message: 'Name không được để trống' })
  name: string;

  @IsArray({
    message: 'Data không phù hợp định dạng. Vui lòng nhập kiểu array'
  })
  skills: [];

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Company)
  company: Company;

  @IsNotEmpty({ message: 'Location không được để trống' })
  @IsString({ message: 'vui lòng nhập định dạng string' })
  location: string;

  @IsNotEmpty({ message: 'Salary không được để trống' })
  @IsNumber()
  salary: number;

  @IsNotEmpty({ message: 'quantity không được để trống' })
  @IsNumber()
  quantity: number;

  @IsNotEmpty({ message: 'Level không được để trống' })
  @IsString({ message: 'vui lòng nhập định dạng string' })
  level: string;

  @IsNotEmpty({ message: 'Description không được để trống' })
  @IsString({ message: 'vui lòng nhập định dạng string' })
  description: string;

  @IsNotEmpty()
  @IsDate()
  startDate: Date;

  @IsNotEmpty()
  @IsDate()
  endDate: Date;

  @IsNotEmpty()
  @IsBoolean()
  isActive: Date;
}
