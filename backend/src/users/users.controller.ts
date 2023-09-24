import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Patch,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { User } from './entities/user.schema';

import { ParseMongoIdPipe } from '../common/pipes';
import { CreateUserDto } from './dto/create-user.dto';
import { FindAllDto } from '../common/dto';
import { InactivateDto } from '../common/dto/inactivate.dto';

import { ValidRoles } from '../common/interfaces';
import { Auth, GetUser } from '../auth/decorators';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@Auth(ValidRoles.ADMIN)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('')
  findAll(@Query() findAllDto: FindAllDto): Promise<User[]> {
    return this.usersService.findAll(findAllDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Post('inactivate-user')
  inactivateUser(@Body() inactivateDto: InactivateDto) {
    return this.usersService.inactivateUser(inactivateDto);
  }

  @Patch('update/avatar')
  @Auth()
  updateAvatar(
    @GetUser('id', ParseMongoIdPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateAvatar(id, updateUserDto);
  }

  @Delete(':id')
  removeUser(@Param('id', ParseMongoIdPipe) id: string) {
    return this.usersService.removeUser(id);
  }

  @Get('restore-user/:id')
  restoreUser(@Param('id', ParseMongoIdPipe) id: string) {
    return this.usersService.restoreUser(id);
  }
}
