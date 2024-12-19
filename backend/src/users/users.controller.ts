import { Controller, Get, Post, Put, Delete, Body, Param, HttpStatus, HttpCode, BadRequestException, UnauthorizedException, Logger } from "@nestjs/common";
import { UsersService } from "./users.service";
import { SignupDto, SigninDto, UpdateUserDto } from "./users.dto";
import { User } from "./users.schema";

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly userService: UsersService ) {}

  @Post('signup')
  @HttpCode(HttpStatus.OK)
  async signUp(@Body() createUserDto: SignupDto) {
    const userExists = await this.userService.findOneByEmail(createUserDto.email);
    if (userExists) {
      this.logger.warn(`User with email ${createUserDto.email} already exists!`);
      throw new BadRequestException('User with this email already exists!');
    }
    try {
      const newUser = await this.userService.create(createUserDto);
      this.logger.log(`User with email ${createUserDto.email} signed up!`);
      return {
        statusCode: HttpStatus.OK,
        message: 'Successfully signed up!',
        data: newUser
      };
    } catch (err) {
      this.logger.error(`Error while signing up: ${err?.message}`, err);
      if (err.name === 'ValidationError') {
        throw new BadRequestException('Invalid input!');
      }
      throw new BadRequestException('Something went wrong, please try again!');
    }
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() signInUserDto: SigninDto) {
    const user = await this.userService.signIn(signInUserDto);
    if (!user) {
      this.logger.warn(`Invalid credentials while signin for email ${signInUserDto.email}`);
      throw new UnauthorizedException('Invalid credentials');
    }
    
    this.logger.log(`${user._id} signed in!`);
    return {
      statusCode: HttpStatus.OK,
      message: 'Signin successful!',
      data: user,
    };
  }

  // other CRUD APIs
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