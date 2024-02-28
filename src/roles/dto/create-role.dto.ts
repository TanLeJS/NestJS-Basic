import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsMongoId, IsNotEmpty } from 'class-validator';

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

  @IsNotEmpty()
  @IsArray()
  @Type(() => ObjectIdDto)
  permissions: ObjectIdDto[];
}
