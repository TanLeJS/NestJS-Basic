import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
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
    return await this.jobModel.create({...createJobDto,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    }) ;
  }

  findAll() {
    return `This action returns all jobs`;
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
