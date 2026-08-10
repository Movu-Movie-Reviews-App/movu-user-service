import { Module } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { WishlistController } from './wishlist.controller';
import { WishlistEntity } from './entities/wishlist.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [WishlistController],
  providers: [WishlistService],
  imports: [TypeOrmModule.forFeature([WishlistEntity])],
  exports: [WishlistService],
})
export class WishlistModule { }
