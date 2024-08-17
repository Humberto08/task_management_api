import { ConflictException, Injectable } from '@nestjs/common';
import { UserDTO } from './dto/user.DTO';
import { v4 as uuid } from 'uuid';
import { hashSync as bcryptHashSync } from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/db/entities/user.entity';


@Injectable()
export class UsersService {

  constructor(@InjectRepository(UserEntity)
  private readonly usersRepository: Repository<UserEntity>) {
    
  } 


  async create(newUser: UserDTO) {
    const userAlreadyRegistered = await this.findByUserName(newUser.username);

    if (userAlreadyRegistered) {
      throw new ConflictException(
        `User '${newUser.username}' already registered`,
      );
    }

    const dbUser = new UserEntity();
    dbUser.username = newUser.username;
    dbUser.passwordHash = bcryptHashSync(newUser.password, 10);

    const { id, username } = await this.usersRepository.save(dbUser);
    return { id, username };

  }

  async findByUserName(username: string): Promise<UserDTO | null> {
    const userFound = await this.usersRepository.findOne({
      where: { username },
    })

    if (!userFound) {
      return null;
    }

    return {
      id: userFound.id,
      username: userFound.username,
      password: userFound.passwordHash,
    }
  }

}