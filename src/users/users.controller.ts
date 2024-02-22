import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ResponseMessage, currentUser } from 'src/decorator/customize';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUser } from './users.interface';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(
    @Body() createUserDTO: CreateUserDto, @currentUser() user: IUser
    )
    {
    return this.usersService.create(createUserDTO,user)
  }


  @Get()
  @ResponseMessage("Fetch List Users with Paginate")
  findAll(
    @Query("page") currentPage: string, // const currentPage: string = req.query.page
    @Query("limit") limit: string,
    @Query() qs: string
    ) {
    return this.usersService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @ResponseMessage("Fetch User by ID")
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(id); // +: convert string to number
  }

  @Patch()
  @ResponseMessage("Update a user")
  async update(@Body() updateUserDto: UpdateUserDto, @currentUser() user: IUser) {
    return await this.usersService.update(updateUserDto, user);
  }

  @Delete(':id')
  @ResponseMessage("Delete a user")
  async remove(@Param('id') id: string, @currentUser() user: IUser) {
    return await this.usersService.remove(id,user);
  }
}
