import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from './users.service';
import { User, UserDocument } from './users.schema';
import { SignupDto, UpdateUserDto } from './users.dto';
import * as bcrypt from 'bcryptjs';

const now = new Date();
const mockUser = {
  _id: '1',
  name: 'Test User',
  email: 'test@example.com',
  password: 'hashedPassword',
  noOfLogins: 0,
  gamesPlayed: 0,
  lastLogInAt: now,
  toObject: jest.fn().mockReturnValue({
    _id: '1',
    name: 'Test User',
    email: 'test@example.com',
    noOfLogins: 0,
    gamesPlayed: 0,
    lastLogInAt: now,
  }),
};

class MockUserModel {
  constructor(private data) {}
  static find = jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue([mockUser]),
  });
  static findById = jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(mockUser),
  });
  static findOne = jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(mockUser),
  });
  static findByIdAndUpdate = jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(mockUser),
  });
  static findByIdAndDelete = jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(mockUser),
  });
  save = jest.fn().mockResolvedValue(mockUser);
}

describe('UsersService', () => {
  let service: UsersService;
  let model: jest.Mocked<Model<UserDocument>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: MockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    model = module.get<Model<UserDocument>>(getModelToken(User.name)) as jest.Mocked<Model<UserDocument>>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user with a hashed password', async () => {
    const createUserDto: SignupDto = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password1!',
    };
    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');
    const result = await service.create(createUserDto);
    expect(result).toEqual({
      _id: '1',
      name: 'Test User',
      email: 'test@example.com',
      gamesPlayed: 0,
      lastLogInAt: now,
      noOfLogins: 0,
    });
  });

  it('should find all users', async () => {
    const result = await service.findAll();
    expect(result).toEqual([mockUser]);
  });

  it('should find a user by id', async () => {
    const result = await service.findOne('1');
    expect(result).toEqual(mockUser);
  });

  it('should return null if user not found by id', async () => {
    model.findById.mockReturnValueOnce({
      exec: jest.fn().mockResolvedValue(null),
    } as any);
    const result = await service.findOne('1');
    expect(result).toBe(null);
  });

  it('should find a user by email', async () => {
    const result = await service.findOneByEmail('test@example.com');
    expect(result).toEqual(mockUser);
  });

  it('should return null if user not found by email', async () => {
    model.findOne.mockReturnValueOnce({
      exec: jest.fn().mockResolvedValue(null),
    } as any);
    const result = await service.findOneByEmail('nonexistent@example.com');
    expect(result).toBe(null);
  });

  it('should update a user', async () => {
    const updateUserDto: UpdateUserDto = {
      name: 'Updated User',
    };
    const result = await service.update('1', updateUserDto);
    expect(result).toEqual(mockUser);
  });

  it('should return null if user not found for update', async () => {
    model.findByIdAndUpdate.mockReturnValueOnce({
      exec: jest.fn().mockResolvedValue(null),
    } as any);
    const updateUserDto: UpdateUserDto = {
      name: 'Updated User',
    };
    const result = await service.update('1', updateUserDto);
    expect(result).toBe(null);
  });

  it('should update login info', async () => {
    const result = await service.updateLoginInfo('1');
    expect(result).toEqual(mockUser);
  });

  it('should return null if user not found for updating login info', async () => {
    model.findByIdAndUpdate.mockReturnValueOnce({
      exec: jest.fn().mockResolvedValue(null),
    } as any);
    const result = await service.updateLoginInfo('1');
    expect(result).toBe(null);
  });

  it('should increment games played', async () => {
    const result = await service.incrementGamesPlayed('1');
    expect(result).toEqual({ ...mockUser, toObject: undefined, password: undefined });
  });

  it('should return null if user not found for incrementing games played', async () => {
    model.findByIdAndUpdate.mockReturnValueOnce({
      exec: jest.fn().mockResolvedValue(null),
    } as any);
    const result = await service.incrementGamesPlayed('1');
    expect(result).toBe(null);
  });

  it('should delete a user', async () => {
    const result = await service.remove('1');
    expect(result).toEqual(mockUser);
  });

  it('should return null if user not found for delete', async () => {
    model.findByIdAndDelete.mockReturnValueOnce({
      exec: jest.fn().mockResolvedValue(null),
    } as any);
    const result = await service.remove('1');
    expect(result).toBe(null);
  });
});