import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { In, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from '../roles/entities/role.entity';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private userRepository:Repository<User>,
    @InjectRepository(Role)
    private roleRepository:Repository<Role>
  ){
    
  }

  async create(createUserDto: CreateUserDto) {

    const { email, username, role_ids } = createUserDto;

    // verificar su yta existe el username
    const existeUsername = await this.userRepository.findOne({where: {username: username}});
    if(existeUsername){
      throw new BadRequestException(`El username "${username}" ya esta en uso`);
    }

    // verificar su yta existe el email
    const existeEmail = await this.userRepository.findOne({where: {email: email}});
    if(existeEmail){
      throw new BadRequestException(`El email "${email}" ya está en uso`);
    }

    // roles
    let roles: Role[] = [];
    if(role_ids?.length){
      roles = await this.roleRepository.find({where: {id: In(role_ids)}});
      if(roles.length !== role_ids.length){
        throw new BadRequestException('Uno o más roles no son válidos');
      }
    }

    // encriptar la contraseña
    const hashPassword = await bcrypt.hash(createUserDto.password, 12);

    const newUser = this.userRepository.create({
      username,
      email,
      password: hashPassword,
      roles
    });

    this.userRepository.save(newUser);
    const { password, ...resto_datos } = newUser;

    return resto_datos;
  }

  async findAll(page:number = 1, limit: number=10, search:string = '') {

    const queryBuilder = this.userRepository.createQueryBuilder('user')
        .leftJoinAndSelect('user.roles', 'role')
        .where('user.username LIKE :search OR user.email LIKE :search', {search: `%${search}%`})

        queryBuilder.skip((page - 1)*limit).take(limit);

        const [users, total] = await queryBuilder.getManyAndCount();

        const totalPages = Math.ceil(total/limit);

    return {
      data: users,
      total,
      page,
      limit,
      totalPages,
      search
    };
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOneBy({id: id});
    if(!user){
      throw new NotFoundException(`User con ID ${id} No existe`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    // encriptar la contraseña
    const hashPassword = await bcrypt.hash(updateUserDto.password, 12);

    user.password = hashPassword;

    Object.assign(user, updateUserDto);

    let result = this.userRepository.save(user);

    const {password, ...resto_datos} = user;
    return resto_datos;
  }

  async remove(id: string) {
    const result = await this.userRepository.delete(id);

    if(result.affected === 0){
      throw new NotFoundException(`User con ID ${id} Not Found`);
    }

  }

  // para el login
  async findOneByEmail(email: string){
    const user = await this.userRepository.findOneBy({email: email});
    if(!user) throw new NotFoundException(`El usuario con email: ${email} no existe`);
    return user;
  }
}
