import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { compareSync, genSaltSync, hashSync } from "bcryptjs";
import mongoose from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { IUser } from './users.interface';
@Injectable()
export class UsersService {

  constructor(@InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>) { }

  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash
  }

  async create (createUserDto: CreateUserDto, user: IUser)  {
    const {name, email ,password, age, gender, address, role, company} = createUserDto
    const hashPassword = this.getHashPassword(password)
    const isExist = await this.userModel.findOne({email})
    if (isExist){
      throw new BadRequestException(`Email ${email} đã tồn tại trên hệ thống`)
    }
    const newUser = await this.userModel.create({
      name, email,
      password: hashPassword,
      age, gender, address, role, company,
      createdBy: {
      _id: user._id,
      email: user.email
    }
  }
  )
  return {
    _id: user._id,
    createdAt: newUser?.createdAt
  };
}

  async register(registerUserDto: RegisterUserDto){
    const {name, email ,password, age, gender, address} = registerUserDto
    //add logic check email
    const isExist = await this.userModel.findOne({email})
    if (isExist){
      throw new BadRequestException(`Email ${email} đã tồn tại trên hệ thống`)
    }
    const hashPassword = this.getHashPassword(password)
    const newRegister = await this.userModel.create({
      name,email,
      password:hashPassword,
      age,gender,
      address,
      role: "USER"
    })
    return newRegister
  }

findAll() {
  return `This action returns all users`;
};

findOne(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id))
    return "not found user"

  return this.userModel.findOne({
      _id: id
    });
};

findOnebyUsername(username: string) {
  return this.userModel.findOne({
      email: username
    });
};

isValidPassword(password:string, hash: string) {
  return compareSync(password, hash);
}

async update(updateUserDto: UpdateUserDto, user: IUser) {
   return await this.userModel.updateOne(
    {_id :updateUserDto._id }, 
    {...updateUserDto, updatedBy : {
      _id: user._id,
      name: user.name
    }}
)
};

remove(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id))
    return "not found user"

  return this.userModel.softDelete({
      _id: id
    });}
};
