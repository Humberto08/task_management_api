import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthResponseDTO } from './dto/auth.DTO';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(
        @Body("username") username: string,
        @Body("password") password: string,
    ): AuthResponseDTO {
        return this.authService.signIn(username, password);
    }
}
