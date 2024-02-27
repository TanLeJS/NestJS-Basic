import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Job, JobDocument } from './schemas/job.schema';

@Injectable()
export class JobsService {
  constructor(@InjectModel(Job.name) private jobModel: SoftDeleteModel<JobDocument>) { }

  async create(createJobDto: CreateJobDto, user: IUser) {
    const {name, skills, company, salary, quantity,level,
          description, startDate,endDate,isActive,location} = createJobDto
    let newJob = this.jobModel.create({name, skills, company, salary, quantity,level,
      description, startDate,endDate,isActive,location,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })
    return newJob ;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter,sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    const offset = (+currentPage - 1) * (+limit);
    const defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.jobModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.jobModel.find(filter)
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
      return "not found user"

  return await this.jobModel.findOne({
      _id: id
    }) //exclude
  }

   async update(id: string, updateJobDto: UpdateJobDto, user) {
    return await this.jobModel.updateOne(
      {_id: id},
      {
        ...updateJobDto,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      } 
      )
  }

  async remove(id: string, user) {
    await this.jobModel.updateOne(
      {_id : id},
       {
      deletedBy : {
        _id : user._id,
        email: user.email
      }})
    return await this.jobModel.softDelete({_id: id})
  }
}
