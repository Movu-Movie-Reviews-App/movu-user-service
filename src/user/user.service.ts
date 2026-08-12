import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { In, Repository } from 'typeorm';
import { getSearchField } from 'src/common/helpers/search-field.helper';
import { GetUserPreferencesDto } from './dto/get-user-preferences.dto';
import { WishlistService } from 'src/wishlist/wishlist.service';
import { FavoriteService } from 'src/favorite/favorite.service';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly wishlistService: WishlistService,
    private readonly favoriteService: FavoriteService

  ) {
  }


  async create(createUserDto: CreateUserDto) {
    try {
      const user = this.userRepository.create(createUserDto);

      return await this.userRepository.save(user);
    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  async findAll() {

    const users = await this.userRepository.find();

    return users;
  }

  /**
   * Bulk lookup for callers that hold a list of userIds (reviews, for one) and need
   * the display data in a single round trip instead of one call per id.
   */
  async findByIds(ids: string[]) {

    if (!ids.length) {
      return [];
    }

    return this.userRepository.find({ where: { id: In(ids) } });
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

  async getUserPreferences(getUserPreferencesDto: GetUserPreferencesDto) {
    const wishlistedContentIds = this.wishlistService.getWishlistedContentIds
    const favoritedContentIds = this.favoriteService.getFavoritedContentIds

    return {
      wishlistedContentIds,
      favoritedContentIds
    }
  }


  private handleDbErrors(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    console.log(error);
    throw new InternalServerErrorException('Please check server logs.');
  }
}
