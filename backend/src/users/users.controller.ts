import { Controller, Get, Post, Put, Delete, Body, Param, HttpStatus, HttpCode, BadRequestException, UnauthorizedException, Logger, UseGuards, Req, Patch } from "@nestjs/common";
import { UsersService } from "./users.service";
import { SignupDto, SigninDto, UpdateUserDto } from "./users.dto";
import { User } from "./users.schema";
import { AuthGuard } from "../auth/auth.guard";
import { AuthService } from "../auth/auth.service";

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService
  ) {}

  @Post('signup')
  @HttpCode(HttpStatus.OK)
  async signUp(@Body() createUserDto: SignupDto) {
    const userExists = await this.userService.findOneByEmail(createUserDto.email);
    if (userExists) {
      this.logger.warn(`User with email ${createUserDto.email} already exists!`);
      throw new BadRequestException('User with this email already exists!');
    }
    try {
      // hash user password
      const hashedPwd = await this.authService.hashPassword(createUserDto.password);
      const newUser = await this.userService.create({ ...createUserDto, password: hashedPwd });
      // get user token
      const token = await this.authService.signin(newUser);
      this.logger.log(`User with email ${createUserDto.email} signed up!`);
      return {
        statusCode: HttpStatus.OK,
        message: 'Successfully signed up!',
        data: { ...newUser, accessToken: token }
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
    const { email, password } = signInUserDto;
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      this.logger.warn(`Invalid credentials while signin for email ${signInUserDto.email}`);
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = await this.authService.signin(user);
    await this.userService.updateLoginInfo(user._id as string);
    this.logger.log(`User with id ${user._id} signed in!`);
    return {
      statusCode: HttpStatus.OK,
      message: 'Signin successful!',
      data: { ...user, accessToken: token },
    };
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  async getProfile(@Req() req) {
    const { user } = req;
    this.logger.log(`User with id ${user.sub} requested profile!`);
    const userDoc = await this.userService.findOne(user.sub);
    delete userDoc.password;
    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
      data: userDoc,
    }
  }

  @Patch('update-profile')
  @UseGuards(AuthGuard)
  async updateProfile(@Req() req) {
    const { user } = req;
    const userDoc = await this.userService.incrementGamesPlayed(user.sub);
    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
      data: userDoc,
    }
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