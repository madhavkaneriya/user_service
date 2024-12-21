import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "./users.schema";
import { SignupDto, UpdateUserDto } from "./users.dto";

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: SignupDto): Promise<Omit<UserDocument, 'password'>> {
    const newUser = new this.userModel(createUserDto);
    const savedUser = (await newUser.save()).toObject();
    delete savedUser.password;
    return savedUser;
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      this.logger.warn(`User with ID ${id} not found`);
    }
    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDocument> {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
    if (!updatedUser) {
      this.logger.warn(`User with ID ${id} not found`);
    }
    return updatedUser;
  }

  async updateLoginInfo(id: string): Promise<UserDocument> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      { lastLogInAt: new Date(), $inc: { noOfLogins: 1 } },
      { new: true }
    ).exec();
    if (!updatedUser) {
      this.logger.warn(`User with ID ${id} not found`);
    }
    return updatedUser;
  }

  async incrementGamesPlayed(id: string): Promise<UserDocument> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      { $inc: { gamesPlayed: 1 } },
      { new: true, projection: { password: 0 } }
    ).exec();
    if (!updatedUser) {
      return null;
    }
    const userObj = updatedUser.toObject();
    return userObj;
  }

  async remove(id: string): Promise<UserDocument> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) {
      this.logger.warn(`User with ID ${id} not found`);
    }
    return deletedUser;
  }
}