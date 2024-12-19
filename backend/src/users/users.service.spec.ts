import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from './users.service';
import { User } from './users.schema';
import { SignupDto, SigninDto, UpdateUserDto } from './users.dto';
import * as bcrypt from 'bcryptjs';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

const mockUser = {
  _id: '1',
  name: 'Test User',
  email: 'test@example.com',
  password: 'hashedPassword',
  toObject: jest.fn().mockReturnValue({
    _id: '1',
    name: 'Test User',
    email: 'test@example.com',
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
  static updateOne = jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(mockUser),
  });
  save = jest.fn().mockResolvedValue(mockUser);
}

describe('UsersService', () => {
  let service: UsersService;
  let model: jest.Mocked<Model<User>>;

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
    model = module.get<Model<User>>(getModelToken(User.name)) as jest.Mocked<Model<User>>;
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
    });
    expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
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
    await expect(service.update('1', updateUserDto)).toBe(null);
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

  it('should sign in a user with valid credentials', async () => {
    const signInUserDto: SigninDto = {
      email: 'test@example.com',
      password: 'Password1!',
    };
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
    const result = await service.signIn(signInUserDto);
    expect(result).toEqual({ _id: mockUser._id, name: mockUser.name, email: mockUser.email });
  });

  it('should return null if sign in credentials are invalid', async () => {
    const signInUserDto: SigninDto = {
      email: 'test@example.com',
      password: 'wrongPassword',
    };
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);
    const result = await service.signIn(signInUserDto);
    expect(result).toBe(null);
  });

  it.only('should throw an error if user not found for sign in', async () => {
    model.findOne.mockReturnValueOnce({
      exec: jest.fn().mockResolvedValue(null),
    } as any);
    const signInUserDto: SigninDto = {
      email: 'nonexistent@example.com',
      password: 'Password1!',
    };
    const result = await service.signIn(signInUserDto);
    expect(result).toBe(null);
  });
});