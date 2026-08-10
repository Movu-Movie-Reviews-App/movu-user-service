import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FavoriteEntity } from './entities/favorite.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class FavoriteService {

  constructor(
    @InjectRepository(FavoriteEntity)
    private readonly favoriteRepository: Repository<FavoriteEntity>
  ) { }

  async create(userId: string, createFavoriteDto: CreateFavoriteDto) {

    const existingFavorite = await this.findOne(userId, createFavoriteDto.contentId);

    if (existingFavorite) {
      throw new ConflictException('Content already in favorites');
    }

    const { userId: __, ...createFavoriteDtoData } = createFavoriteDto
    const favorite = this.favoriteRepository.create({
      contentId: createFavoriteDto.contentId,
      userId: userId
    });

    return await this.favoriteRepository.save(favorite);
  }

  async findAllByUser(userId: string) {

    const favorites = this.favoriteRepository.find({
      where: {
        userId
      },
    });

    return favorites;
  }

  // Se busca por contenido, no por id de fila: el cliente solo conoce el contentId.
  async findOne(userId: string, contentId: string) {
    const favorite = await this.favoriteRepository.findOne({
      where: { userId, contentId }
    })

    return favorite;
  }

  async remove(userId: string, contentId: string) {

    const favorite = await this.findOne(userId, contentId);

    if (!favorite) {
      throw new NotFoundException(`Content ${contentId} is not in favorites`);
    }

    return await this.favoriteRepository.delete({ id: favorite.id });

  }

  async isContentInFavorites(userId: string, contentId: string): Promise<boolean> {
    const count = await this.favoriteRepository.count({
      where: { userId, contentId }
    });

    return count > 0;
  }

  async getFavoritedContentIds(
    userId: string,
    contentIds: string[],
  ): Promise<Set<string>> {
    if (contentIds.length === 0) {
      return new Set<string>();
    }

    const favorites = await this.favoriteRepository.find({
      where: {
        userId,
        contentId: In(contentIds),
      },
      select: {
        contentId: true,
      },
    });

    return new Set(
      favorites.map((favorite) => favorite.contentId),
    );
  }
}
