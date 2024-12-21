import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { SignupDto, SigninDto, UpdateUserDto } from './users.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ExecutionContext } from '@nestjs/common';

const mockUser = {
  _id: '1',
  name: 'Test User',
  email: 'test@example.com',
  password: 'hashedPassword',
  noOfLogins: 0,
  gamesPlayed: 0,
  lastLogInAt: new Date(),
};

const mockUsersService = {
  create: jest.fn().mockResolvedValue(mockUser),
  findOneByEmail: jest.fn().mockResolvedValue(mockUser),
  findAll: jest.fn().mockResolvedValue([mockUser]),
  findOne: jest.fn().mockResolvedValue(mockUser),
  update: jest.fn().mockResolvedValue(mockUser),
  remove: jest.fn().mockResolvedValue(mockUser),
  updateLoginInfo: jest.fn().mockResolvedValue(mockUser),
  incrementGamesPlayed: jest.fn().mockResolvedValue(mockUser),
};

const mockAuthService = {
  hashPassword: jest.fn().mockResolvedValue('hashedPassword'),
  validateUser: jest.fn().mockResolvedValue(mockUser),
  signin: jest.fn().mockResolvedValue('token'),
};

const mockAuthGuard = {
  canActivate: jest.fn((context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    req.user = { sub: mockUser._id };
    return true;
  }),
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
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

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
        data: { ...mockUser, accessToken: 'token' },
      });
    });

    it('should throw an error if user already exists', async () => {
      const createUserDto: SignupDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password1!',
      };
      mockUsersService.findOneByEmail.mockResolvedValueOnce(mockUser);
      await expect(controller.signUp(createUserDto)).rejects.toThrow('User with this email already exists!');
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
        data: { ...mockUser, accessToken: 'token' },
      });
    });

    it('should throw an error if credentials are invalid', async () => {
      const signInUserDto: SigninDto = {
        email: 'test@example.com',
        password: 'wrongPassword',
      };
      mockAuthService.validateUser.mockResolvedValueOnce(null);
      await expect(controller.signIn(signInUserDto)).rejects.toThrow('Invalid credentials');
    });
  });

  describe('getProfile', () => {
    it('should return the user profile', async () => {
      const req = { user: { sub: mockUser._id } };
      const result = await controller.getProfile(req);
      expect(result).toEqual({
        statusCode: 200,
        message: 'Success',
        data: mockUser,
      });
    });
  });

  describe('updateProfile', () => {
    it('should increment games played', async () => {
      const req = { user: { sub: mockUser._id } };
      const result = await controller.updateProfile(req);
      expect(result).toEqual({
        statusCode: 200,
        message: 'Success',
        data: mockUser,
      });
    });
  });

  describe('getAll', () => {
    it('should return all users', async () => {
      const result = await controller.getAll();
      expect(result).toEqual([mockUser]);
    });
  });

  describe('getOne', () => {
    it('should return a user by id', async () => {
      const result = await controller.getOne('1');
      expect(result).toEqual(mockUser);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'Updated User',
      };
      const result = await controller.update('1', updateUserDto);
      expect(result).toEqual(mockUser);
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      const result = await controller.remove('1');
      expect(result).toEqual(mockUser);
    });
  });
});