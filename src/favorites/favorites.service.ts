import { Injectable } from '@nestjs/common';
import { FavoriteDto } from './dto/favorite.dto';
import { Repository } from 'typeorm';
import { Favorite } from './entities/favorite.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>,
  ) {}
  create(createFavoriteDto: FavoriteDto) {
    return this.favoriteRepository.save(createFavoriteDto);
  }

  findAll(userId: number) {
    return this.favoriteRepository.find({ where: { userId } });
  }

  findOne(userId: number, seriesId: number) {
    return this.favoriteRepository.findOne({
      where: { userId, seriesId },
    });
  }

  update(id: number, updateFavoriteDto: FavoriteDto) {
    return this.favoriteRepository.update(id, updateFavoriteDto);
  }

  remove(id: number) {
    return this.favoriteRepository.delete(id);
  }
}
