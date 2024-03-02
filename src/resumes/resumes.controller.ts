import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { Public, ResponseMessage, currentUser } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { CreateUserCvDto } from './dto/create-resume.dto';
import { ResumesService } from './resumes.service';

@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Post()
  @ResponseMessage("Create a new resume")
  create(@Body() createUserCvDto: CreateUserCvDto, @currentUser() user: IUser) {
    return this.resumesService.create(createUserCvDto, user);
  }

  @Post("by-user")
  @ResponseMessage("Get Resume by User")
  getResumesByUser(@currentUser() user: IUser){
    return this.resumesService.findByUsers(user)
  }

  @ResponseMessage("Fetch List with Paginate")
  @Get("")
  @Public()
  findAll(
    @Query("current") currentPage: string, // const currentPage: string = req.query.page
    @Query("pageSize") limit: string,
    @Query() qs: string
    ) {
    return this.resumesService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @ResponseMessage("Get resume by Id")
  findOne(@Param('id') id: string) {
    return this.resumesService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage("Update a resume")
  update(@Param('id') id: string, @Body("status") status: string, @currentUser() user:IUser) {
    return this.resumesService.update(id, status, user);
  }

  @Delete(':id')
  @ResponseMessage("Delete resume by Id")
  remove(@Param('id') id: string, @currentUser() user:IUser) {
    return this.resumesService.remove(id, user);
  }
}
