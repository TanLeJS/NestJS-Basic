import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { PermissionDocument } from 'src/permissions/schema/permission.schema';
import { RoleDocument } from 'src/roles/schema/role.schema';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class DatabasesService implements OnModuleInit {
  constructor(
    @InjectModel(User.name) 
    private userModel: SoftDeleteModel<UserDocument>,

    @InjectModel(User.name) 
    private permissionModel: SoftDeleteModel<PermissionDocument>,

    @InjectModel(User.name) 
    private roleModel: SoftDeleteModel<RoleDocument>,

    private configService: ConfigService,
    private userService: UsersService

    
    ) { }
  onModuleInit() {
    console.log(`The module has been initialized.`);
  }
}
