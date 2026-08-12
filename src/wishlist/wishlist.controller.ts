import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Payload } from '@nestjs/microservices/decorators/payload.decorator';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) { }

  @MessagePattern('wishlist.create')
  create(@Payload() createWishlistDto: CreateWishlistDto) {
    return this.wishlistService.create(createWishlistDto.userId, createWishlistDto);
  }

  @MessagePattern('wishlist.findAllByUser')
  findAllByUser(@Payload('userId', ParseUUIDPipe) userId: string) {
    return this.wishlistService.findAllByUser(userId);
  }

  @MessagePattern('wishlist.findOne')
  findOne(@Payload('userId', ParseUUIDPipe) userId: string, @Payload('contentId', ParseUUIDPipe) contentId: string) {
    return this.wishlistService.findOne(userId, contentId);
  }

  @MessagePattern('wishlist.remove')
  remove(@Payload('userId', ParseUUIDPipe) userId: string, @Payload('contentId', ParseUUIDPipe) contentId: string) {
    return this.wishlistService.remove(userId, contentId);
  }
}
