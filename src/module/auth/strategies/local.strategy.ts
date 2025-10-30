import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private auth: AuthService) {
        super({ usernameField: 'usuario' }); // login con "usuario"
    }
    async validate(usuario: string, password: string) {
        const user = await this.auth.validateUser(usuario, password);
        if (!user) throw new UnauthorizedException('Credenciales inválidas');
        return user;
    }
}
