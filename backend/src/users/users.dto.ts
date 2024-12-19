import { IsEmail, IsNotEmpty, MinLength, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateUserDto {
  readonly name?: string;
  readonly email?: string;
  readonly password?: string;
}

export class SignupDto {
  @IsNotEmpty({ message: 'Name is required' })
  @Transform(({ value }) => value.trim()) // Trim leading/trailing spaces
  name: string;

  @IsEmail({}, { message: 'Email must be a valid email address' })
  @Transform(({ value }) => value.trim().toLowerCase()) // Normalize email to lowercase
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/[A-Za-z]/, { message: 'Password must contain at least 1 letter' })
  @Matches(/\d/, { message: 'Password must contain at least 1 number' })
  @Matches(/[@$!%*?&]/, { message: 'Password must contain at least 1 special character' })
  password: string;
}

export class SigninDto {
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @Transform(({ value }) => value.trim().toLowerCase()) // Normalize email to lowercase
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;
}