import { Injectable, Logger } from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { User, UserDocument } from "src/users/users.schema";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<Omit<UserDocument, 'password'> | null> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      this.logger.warn(`User with email ${email} not found!`);
      return null;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      this.logger.warn(`Invalid password for user with email ${email}!`);
      return null;
    }
    const { password:_, ...result } = user.toObject();
    return result;
  }

  async signin(user: Omit<User, 'password'>) {
    const payload = { name: user.name, email: user.email, sub: user._id };
    return this.jwtService.signAsync(payload);
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}