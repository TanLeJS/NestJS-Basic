import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';
import { compareSync, genSaltSync, hashSync } from "bcryptjs";
import mongoose from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { USER_ROLE } from 'src/databases/sample';
import { Role, RoleDocument } from 'src/roles/schema/role.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { IUser } from './users.interface';
@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User.name) 
    private userModel: SoftDeleteModel<UserDocument>,
    @InjectModel(Role.name) 
    private roleModel: SoftDeleteModel<RoleDocument>
    ) { }

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
    _id: newUser?._id,
    createdAt: newUser?.createdAt
  }
}

  async register(registerUserDto: RegisterUserDto){
    const {name, email ,password, age, gender, address} = registerUserDto
    //add logic check email
    const isExist = await this.userModel.findOne({email})
    if (isExist){
      throw new BadRequestException(`Email ${email} đã tồn tại trên hệ thống`)
    }

    // fetch userRole
    const userRole = await this.roleModel.findOne({name: USER_ROLE})

    const hashPassword = this.getHashPassword(password)
    const newRegister = await this.userModel.create({
      name,email,
      password:hashPassword,
      age,gender,
      address,
      role: userRole?._id
    })
    return newRegister
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter,sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    const offset = (+currentPage - 1) * (+limit);
    const defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.userModel.find(filter)
    .skip(offset)
    .limit(defaultLimit)
    .sort(sort as any)
    .select("-password")
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

findOne(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id))
    return "not found user"

  return this.userModel.findOne({
      _id: id
    }).select("-password")     //exclude
      .populate({path: "role", select: {name : 1, _id: 1}})
};

findOnebyUsername(username: string) {
  return this.userModel.findOne({
      email: username
    }).populate({path: "role", select: {name : 1}})
};
// .populate({
//   path: "permissions",
//   select: { _id: 1, apiPath: 1, name: 1, method: 1, module: 1 }
// });

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

async remove(id: string, user) {
  if (!mongoose.Types.ObjectId.isValid(id))
    return "not found user"
  const foundUser = await this.userModel.findById(id)
  if (foundUser && foundUser.email === "admin@gmail.com") {
    throw new BadRequestException("không thể xoá tài khoản admin@gmail.com")
  }
  await this.userModel.updateOne(
    {_id : id},
     {
    deletedBy : {
      _id : user._id,
      email: user.email
    }})
  return await this.userModel.softDelete({_id: id})
}

updateUserToken = async (refresh_token: string, _id: string) => {
  return await this.userModel.updateOne(
    {_id},
     {refresh_token}
     )
}

findUserByToken = async (refresh_token: string) => {
  return await this.userModel.findOne({refresh_token}).populate({path: "role", select: {name : 1}})
}
};
