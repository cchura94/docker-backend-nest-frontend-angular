import { HttpException, Injectable } from '@nestjs/common';
import { UsersService } from '../admin/users/users.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { hash, compare } from "bcrypt"

@Injectable()
export class AuthService {

    constructor(
        private userService: UsersService,
        private jwtService: JwtService
    ){}

    async login(credenciales: LoginAuthDto){
        const { email, password } = credenciales;
        
        // buscar usuario por email
        const usuario = await this.userService.findOneByEmail(email);
        if(!usuario){
            return new HttpException('Usuario no encontrado', 404);
        }

        // verificar contraseña (asignar la comparación con bcrypt)
        const verificarPass = await compare(password, usuario.password);
        if(!verificarPass){
            throw new HttpException('Contraseña incorrecta', 401);
        }

        // genarar JWT
        const payload = {email: email, id: usuario.id};

        const token = await this.jwtService.sign(payload);

        return {access_token: token, user:usuario}

    }

}
