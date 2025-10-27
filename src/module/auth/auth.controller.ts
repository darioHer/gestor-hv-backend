import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';

@Controller('auth')
export class AuthController {
    constructor(private auth: AuthService) { }
    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(@Request() req, @Body() _dto: LoginDto) {
        return this.auth.login(req.user);
    }
    @Post('register')
    async register(@Body() dto: RegisterDto) {
        return this.auth.register(dto);
    }
    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    async me(@Request() req) {
        return this.auth.findById(req.user.id);
    }
}
