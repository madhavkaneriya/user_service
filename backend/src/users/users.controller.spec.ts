import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SignupDto, SigninDto } from './users.dto';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

const mockUser = {
  _id: '1',
  name: 'Test User',
  email: 'test@example.com',
  password: 'hashedPassword',
};

const mockUsersService = {
  create: jest.fn().mockResolvedValue(mockUser),
  findOneByEmail: jest.fn().mockResolvedValue(null),
  signIn: jest.fn().mockResolvedValue({ name: mockUser.name, email: mockUser.email }),
};

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signUp', () => {
    it('should create a new user', async () => {
      const createUserDto: SignupDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password1!',
      };
      mockUsersService.findOneByEmail.mockResolvedValueOnce(null);
      const result = await controller.signUp(createUserDto);
      expect(result).toEqual({
        statusCode: 200,
        message: 'Successfully signed up!',
        data: mockUser,
      });
    });

    it('should throw an error if user already exists', async () => {
      const createUserDto: SignupDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password1!',
      };
      mockUsersService.findOneByEmail.mockResolvedValueOnce(mockUser);
      await expect(controller.signUp(createUserDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('signIn', () => {
    it('should sign in a user with valid credentials', async () => {
      const signInUserDto: SigninDto = {
        email: 'test@example.com',
        password: 'Password1!',
      };
      const result = await controller.signIn(signInUserDto);
      expect(result).toEqual({
        statusCode: 200,
        message: 'Signin successful!',
        data: { name: mockUser.name, email: mockUser.email },
      });
    });

    it('should throw an error if sign in credentials are invalid', async () => {
      const signInUserDto: SigninDto = {
        email: 'test@example.com',
        password: 'wrongPassword',
      };
      mockUsersService.signIn.mockRejectedValueOnce(new UnauthorizedException('Invalid credentials'));
      await expect(controller.signIn(signInUserDto)).rejects.toThrow(UnauthorizedException);
    });
  });
});