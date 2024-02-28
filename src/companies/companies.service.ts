import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company, CompanyDocument } from './schema/company.schema';

@Injectable()
export class CompaniesService {
  constructor(@InjectModel(Company.name) private companyModel: SoftDeleteModel<CompanyDocument>) { }

  create(createCompanyDto: CreateCompanyDto, user: IUser) {
    return this.companyModel.create({...createCompanyDto,
    createdBy: {
      _id: user._id,
      email: user.email
    }
    })
  }

    async findAll(currentPage: number, limit: number, qs: string) {
    const { filter,sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    const offset = (+currentPage - 1) * (+limit);
    const defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.companyModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.companyModel.find(filter)
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

    return await this.companyModel.findOne({
        _id: id
      }) //exclude
    }

  async update(id: string, updateCompanyDto: UpdateCompanyDto, user) {
    return await this.companyModel.updateOne(
      {_id : id},
       {...updateCompanyDto,
      updatedBy : {
        _id : user._id,
        email: user.email
      }
      },
       )
  }

  async remove(id: string, user) {
    await this.companyModel.updateOne(
      {_id : id},
       {
      deletedBy : {
        _id : user._id,
        email: user.email
      }})
    return await this.companyModel.softDelete({_id: id})
}
}
