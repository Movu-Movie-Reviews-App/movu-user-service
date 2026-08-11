import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { UsersService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GetUserPreferencesDto } from './dto/get-user-preferences.dto';
import { CreateUserDto } from './dto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @MessagePattern('users.create')
  create(@Payload() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @MessagePattern('users.findAll')
  findAll() {
    return this.usersService.findAll();
  }

  @MessagePattern('users.findOne')
  findOne(@Payload('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @MessagePattern('users.update')
  update(@Payload() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(updateUserDto.id, updateUserDto);
  }

  @MessagePattern('users.remove')
  remove(@Payload('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }

  @MessagePattern('users.getPreferences')
  getPreferences(@Payload() getUserPreferencesDto: GetUserPreferencesDto) {


  }
}
