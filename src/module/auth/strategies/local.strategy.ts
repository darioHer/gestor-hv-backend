import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly auth: AuthService) {
        super({ usernameField: 'usuario' }); 
    }

    async validate(usuario: string, password: string) {
        const user = await this.auth.validateUser(usuario, password);
        return { id: user.id, usuario: user.usuario, rol: user.rol };
    }
}
