import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public, ResponseMessage, SkipCheckPermission, currentUser } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { SubscribersService } from './subscribers.service';

@ApiTags('subscribers')
@Controller('subscribers')
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) {}

  @ResponseMessage("Create a subscriber")
  @Post()
  create(@Body() createSubscriberDto: CreateSubscriberDto, @currentUser() user: IUser) {
    return this.subscribersService.create(createSubscriberDto, user);
  }

  @Post("skills")
  @ResponseMessage("Get a subscibers skills")
  @SkipCheckPermission()
  getUserSkills(@currentUser() user: IUser){
    return this.subscribersService.getSkills(user)
  }

  @ResponseMessage("Fetch List Subscriber with Paginate")
  @Get("")
  @Public()
  findAll(
    @Query("current") currentPage: string, // const currentPage: string = req.query.page
    @Query("pageSize") limit: string,
    @Query() qs: string
    ) {
    return this.subscribersService.findAll(+currentPage, +limit, qs);
  }

  @ResponseMessage("Fetch a subscribe by id")
  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.subscribersService.findOne(id);
  }


  @Patch()
  @SkipCheckPermission()
  @ResponseMessage("Update a subscriber")
  update(@Body() updateSubscriberDto: UpdateSubscriberDto, @currentUser() user: IUser) {
    return this.subscribersService.update(updateSubscriberDto,user);
  }




  @ResponseMessage("Delete a subscriber")
  @Delete(':id')
  remove(@Param('id') id: string, @currentUser() user: IUser) {
    return this.subscribersService.remove(id, user);
  }
}
