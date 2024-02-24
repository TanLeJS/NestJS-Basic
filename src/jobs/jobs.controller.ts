import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ResponseMessage, currentUser } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobsService } from './jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @ResponseMessage("Create a job")
  @Post()
  create(@Body() createJobDto: CreateJobDto, @currentUser() user: IUser) {
    return this.jobsService.create(createJobDto, user);
  }



  @ResponseMessage("Fetch List Users with Paginate")
  @Get("")
  findAll(
    @Query("current") currentPage: string, // const currentPage: string = req.query.page
    @Query("pageSize") limit: string,
    @Query() qs: string
    ) {
    return this.jobsService.findAll(+currentPage, +limit, qs);
  }

  @ResponseMessage("Fetch a job by id")
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }


  
  @ResponseMessage("Update a job")
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto, @currentUser() user: IUser) {
    return this.jobsService.update(id, updateJobDto,user);
  }


  @ResponseMessage("Delete a job")
  @Delete(':id')
  remove(@Param('id') id: string, @currentUser() user: IUser) {
    return this.jobsService.remove(id, user);
  }
}
