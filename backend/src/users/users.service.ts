import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from "bcryptjs";
import { User } from "./users.schema";
import { SignupDto, SigninDto, UpdateUserDto } from "./users.dto";

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: SignupDto): Promise<Partial<User>> {
    const hashedPwd = await bcrypt.hash(createUserDto.password, 10);
    const newUser = new this.userModel({ ...createUserDto, password: hashedPwd });
    const savedUser = (await newUser.save()).toObject();
    delete savedUser.password;
    return savedUser;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      this.logger.warn(`User with ID ${id} not found`);
    }
    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
    if (!updatedUser) {
      this.logger.warn(`User with ID ${id} not found`);
    }
    return updatedUser;
  }

  async remove(id: string): Promise<User> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) {
      this.logger.warn(`User with ID ${id} not found`);
    }
    return deletedUser;
  }

  async signIn({ email, password }: SigninDto): Promise<Partial<User>> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      this.logger.warn(`User with email ${email} not found!`);
      return null;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      this.logger.warn(`Invalid password for User with email ${email}!`);
      return null;
    }
    await this.userModel.updateOne({ email }, { lastLogInAt: new Date() }).exec();
    this.logger.log(`Logged in timestamp updated for user ${user._id}!`);
    return { _id: user._id, name: user.name, email: user.email };
  }
}