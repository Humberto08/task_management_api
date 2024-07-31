import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDTO } from './dto/user.DTO';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() user: UserDTO) {
    return this.usersService.create(user);
 
  }
}