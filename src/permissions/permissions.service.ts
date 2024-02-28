import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission, PermissionDocument } from './schema/permission.schema';

@Injectable()
export class PermissionsService {

  constructor(@InjectModel(Permission.name) private permissionModel: SoftDeleteModel<PermissionDocument>) {}

  async create(CreatePermissionDto: CreatePermissionDto, user) {
    const {name, apiPath, method, module} = CreatePermissionDto
    const {email, _id} = user
    const isExist = await this.permissionModel.findOne({apiPath, method})
    if (isExist){
      throw new BadRequestException(`Permisison với apipath ${apiPath}, method ${method} đã tồn tại`)
    }
    const newPermission = await this.permissionModel.create({
        name, apiPath, method, module,
        createdBy: { _id, email},
      }
    )
    return {
      _id: newPermission?._id,
      createdAt: newPermission?.createdAt
    }
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter,sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    const offset = (+currentPage - 1) * (+limit);
    const defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.permissionModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.permissionModel.find(filter)
    .skip(offset)
    .limit(defaultLimit)
    .sort(sort as any)
    .populate(population)
    .exec();

    return {
      meta: {
      current: currentPage, //trang hiện tại
      pageSize: limit, //số lượng bản ghi đã lấy
      pages: totalPages, //tổng số trang với điều kiện query
      total: totalItems // tổng số phần tử (số bản ghi)
      },
      result //kết quả query
      }
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
    return new BadRequestException(`not found company with id = ${id}`)

  return await this.permissionModel.findOne({
      _id: id
    }) //exclude
  }

  async update(_id: string, updatePermissionDto: UpdatePermissionDto, user) {
    if (!mongoose.Types.ObjectId.isValid(_id)){
      throw new BadRequestException("Not found resume")
    }
    return await this.permissionModel.updateOne({_id: _id}, 
      {...updatePermissionDto,
      updatedBy: {
        _id: user._id,
        email: user.email
      }
      })

  }

  async remove(id: string, user) {
    await this.permissionModel.updateOne(
      {_id : id},
       {
      deletedBy : {
        _id : user._id,
        email: user.email
      }})
    return await this.permissionModel.softDelete({_id: id})
  }
}
