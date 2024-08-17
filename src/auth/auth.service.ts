import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { compareSync as bcryptCompareSync } from 'bcrypt';
import { AuthResponseDTO } from './dto/auth.DTO';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  login(payload: { username: string; sub: string; }) {
    throw new Error('Method not implemented.');
  }
  validateUser(arg0: string, arg1: string) {
    throw new Error('Method not implemented.');
  }
  private jwtExpirationTimeInSeconds: number;
  
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {
    this.jwtExpirationTimeInSeconds = +this.configService.get<number>('JWT_EXPIRATION_TIME');
  }

  async signIn(username: string, password: string): Promise <AuthResponseDTO> {
    const foundUser = await this.usersService.findByUserName(username);

    if (!foundUser || !bcryptCompareSync(password, foundUser.password)) {
      ;

      throw new UnauthorizedException();
    }
    
    const payload = { sub: foundUser.id, username: foundUser.username };

    const token = this.jwtService.sign(payload);
    return { token, expiresIn: this.jwtExpirationTimeInSeconds };
    
  }
}
