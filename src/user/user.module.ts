import { UsersService } from './user.service';
import { UsersController } from './user.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { FavoriteModule } from 'src/favorite/favorite.module';
import { WishlistModule } from 'src/wishlist/wishlist.module';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { User } from './entities/user.entity';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [TypeOrmModule.forFeature([UserEntity]), FavoriteModule, WishlistModule],
})
export class UsersModule { }
