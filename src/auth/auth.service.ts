import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { compareSync as bcryptCompareSync } from 'bcrypt';
import { AuthResponseDTO } from './dto/auth.DTO';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private jwtExpirationTimeInSeconds: number;
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {
    this.jwtExpirationTimeInSeconds = +this.configService.get<number>('JWT_EXPIRATION_TIME');
  }

  signIn(username: string, password: string): AuthResponseDTO {
    const foundUser = this.usersService.findByUserName(username);

    if (!foundUser || !bcryptCompareSync(password, foundUser.password)) {
      ;

      throw new UnauthorizedException();
    }
    
    const payload = {
      username: foundUser.username,
      sub: foundUser.id,
    };

    const token = this.jwtService.sign(payload);
    
    return { token, expiresIn: this.jwtExpirationTimeInSeconds }
  }
}
