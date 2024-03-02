import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { Public, ResponseMessage, currentUser } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { SubscribersService } from './subscribers.service';

@Controller('subscribers')
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) {}

  @ResponseMessage("Create a job")
  @Post()
  create(@Body() createJobDto: CreateSubscriberDto, @currentUser() user: IUser) {
    return this.subscribersService.create(createJobDto, user);
  }



  @ResponseMessage("Fetch List Jobs with Paginate")
  @Get("")
  @Public()
  findAll(
    @Query("current") currentPage: string, // const currentPage: string = req.query.page
    @Query("pageSize") limit: string,
    @Query() qs: string
    ) {
    return this.subscribersService.findAll(+currentPage, +limit, qs);
  }

  @ResponseMessage("Fetch a job by id")
  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.subscribersService.findOne(id);
  }


  
  @ResponseMessage("Update a job")
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubscriberDto: UpdateSubscriberDto, @currentUser() user: IUser) {
    return this.subscribersService.update(id, updateSubscriberDto,user);
  }


  @ResponseMessage("Delete a job")
  @Delete(':id')
  remove(@Param('id') id: string, @currentUser() user: IUser) {
    return this.subscribersService.remove(id, user);
  }
}
