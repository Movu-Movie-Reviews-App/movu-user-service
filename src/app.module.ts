import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envs } from './config/envs';
import { UserEntity } from './user/entities/user.entity';
import { UsersModule } from './user/user.module';
import { FavoriteModule } from './favorite/favorite.module';
import { WishlistModule } from './wishlist/wishlist.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: envs.dbHost,
      port: envs.dbPort,
      username: envs.dbUsername,
      password: envs.dbPassword,
      database: envs.dbName,
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    FavoriteModule,
    WishlistModule
  ],
})
export class AppModule { }
