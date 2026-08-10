import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { Payload } from '@nestjs/microservices/decorators/payload.decorator';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) { }

  @MessagePattern('favorites.create')
  create(@Payload() createFavoriteDto: CreateFavoriteDto) {
    return this.favoriteService.create(createFavoriteDto.userId, createFavoriteDto);
  }

  @MessagePattern('favorites.findAllByUser')
  findAllByUser(@Payload('userId', ParseUUIDPipe) userId: string) {
    return this.favoriteService.findAllByUser(userId);
  }

  @MessagePattern('favorites.findOne')
  findOne(@Payload('userId', ParseUUIDPipe) userId: string, @Payload('contentId', ParseUUIDPipe) contentId: string) {
    return this.favoriteService.findOne(userId, contentId);
  }

  @MessagePattern('favorites.remove')
  remove(@Payload('userId', ParseUUIDPipe) userId: string, @Payload('contentId', ParseUUIDPipe) contentId: string) {
    return this.favoriteService.remove(userId, contentId);
  }
}
