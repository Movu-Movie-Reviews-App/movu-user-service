import { Module } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { FavoriteController } from './favorite.controller';
import { FavoriteEntity } from './entities/favorite.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [FavoriteController],
  providers: [FavoriteService],
  imports: [TypeOrmModule.forFeature([FavoriteEntity])],
  exports: [FavoriteService],
})
export class FavoriteModule { }
