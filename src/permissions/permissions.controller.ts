import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { Public, ResponseMessage, currentUser } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PermissionsService } from './permissions.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('permissions')
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  create(@Body() createPermissionDto: CreatePermissionDto, @currentUser() user:IUser) {
    return this.permissionsService.create(createPermissionDto, user);
  }

  @Get()
  @Public()
  @ResponseMessage("Fetch List Company with Paginate")
  findAll(
    @Query("current") currentPage: string, // const currentPage: string = req.query.page
    @Query("pageSize") limit: string,
    @Query() qs: string
    ) {
    return this.permissionsService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto, @currentUser() user: IUser) {
    return this.permissionsService.update(id, updatePermissionDto,user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @currentUser() user: IUser) {
    return this.permissionsService.remove(id, user);
  }
}
