import { Controller, Get, Post, Put, Delete, Body, Param } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto, SignInUserDto, UpdateUserDto } from "./users.dto";
import { User } from "./users.schema";

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService ) {}

  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Post('signin')
  async signIn(@Body() signInUserDto: SignInUserDto): Promise<Partial<User>> {
    return this.userService.signIn(signInUserDto);
  }

  @Get()
  async getAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<User> {
    return this.userService.remove(id);
  }
}