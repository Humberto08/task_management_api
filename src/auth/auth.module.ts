import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [JwtModule, registerAsync({
    global: true,
    imports: [],
    useFactory: async (confiService: ConfigService) => ({
      secret: confiService.get<string>('JWT_SECRET'),
      signOptions: {
        expiresIn: +confiService.get<number>('JWT_EXPIRATION_TIME'),
      }
    }),
    inject: [ConfigService]
  })],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
