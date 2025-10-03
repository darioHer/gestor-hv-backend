import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { RegisterAdminDto } from './dtos/register-admin.dto';

@Controller('auth')
export class AuthController {
    constructor(private auth: AuthService) { }

    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(@Request() req) {
        return this.auth.login(req.user);
    }

    // Registro abierto (sin bloqueos)
    @Post('register')
    async register(@Body() dto: RegisterAdminDto) {
        const user = await this.auth.register(dto);          // retorna un Administrador
        const token = await this.auth.login(user);           // genera JWT con user.id
        return {
            user: { id: user.id, usuario: user.usuario, nombre: user.nombre, rol: user.rol },
            ...token,
        };
    }
}
