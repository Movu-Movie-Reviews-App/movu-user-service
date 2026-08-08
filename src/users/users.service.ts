import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { QueryBuilder, Repository } from 'typeorm';
import { validate as isUUID } from 'uuid';
import { getSearchField } from 'src/common/helpers/search-field.helper';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>) {
  }


  async create(createUserDto: CreateUserDto) {
    try {
      const { ...userData } = this.userRepository.create(createUserDto);
      const user = this.userRepository.create({
        ...userData
      });

      return await this.userRepository.save(user);



    } catch (error) {

      this.handleDbErrors(error);

    }

  }

  async findAll() {

    const users = await this.userRepository.find();

    return users;
  }

  async findOne(term: string) {

    const searchField = getSearchField(term);
    const user = await this.userRepository.findOneBy({ [searchField]: term })

    if (!user) {
      throw new NotFoundException(`User not found with specified ${[searchField]}`);
    }

    return user;

  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    try {

      const { id: __, ...updateData } = updateUserDto;


      const user = await this.userRepository.preload({ id: id, ...updateData });
      if (!user) throw new NotFoundException(`User with ${id} not found`);


      return await this.userRepository.save(user);

    } catch (error) {

      this.handleDbErrors(error);

    }

  }

  //TODO: Remove user
  async remove(id: string) {
    try {
      const user = await this.findOne(id);
      await this.userRepository.delete(id);
      return user;
    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  private handleDbErrors(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    console.log(error);
    throw new InternalServerErrorException('Please check server logs.');
  }
}
