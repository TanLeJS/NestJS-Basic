import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  ValidateNested
} from 'class-validator';

class ObjectIdDto {
  @IsMongoId({ each: true, message: 'Each element must be a valid ObjectID' })
  id: string;
}

export class CreateRoleDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ObjectIdDto)
  permission: ObjectIdDto[];
}
