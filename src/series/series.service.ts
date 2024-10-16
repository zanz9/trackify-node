import { Injectable } from '@nestjs/common';
import { SeriesDto } from './dto/series.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Series } from './entities/series.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeriesService {
  constructor(
    @InjectRepository(Series) private seriesRepository: Repository<Series>,
  ) {}

  create(createSeriesDto: SeriesDto) {
    return this.seriesRepository.save(createSeriesDto);
  }

  async findAll(page: number, limit: number) {
    const [series, total] = await this.seriesRepository
      .createQueryBuilder('series')
      .leftJoinAndSelect('series.episodes', 'episodes')
      .orderBy('series.id', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    series.forEach((serial) => {
      serial.episodes.sort((a, b) => a.numberEpisode - b.numberEpisode);
    });

    return {
      data: series,
      count: total,
    };
  }

  findOne(id: number) {
    return this.seriesRepository.findOne({
      where: { id },
      relations: ['episodes'],
      order: { episodes: { numberEpisode: 'ASC' } },
    });
  }

  findByName(name: string) {
    return this.seriesRepository.findOne({
      where: { name },
      relations: ['episodes'],
      order: { episodes: { numberEpisode: 'ASC' } },
    });
  }

  update(id: number, updateSeriesDto: SeriesDto) {
    return this.seriesRepository.update(id, updateSeriesDto);
  }

  async updateOrCreate(seriesDto: SeriesDto) {
    const result = await this.seriesRepository.findOneBy({
      name: seriesDto.name,
    });
    if (result == null) {
      return await this.seriesRepository.save(seriesDto);
    }
    await this.seriesRepository.update(result.id, seriesDto);
    return await this.seriesRepository.findOneBy({ id: result.id });
  }

  remove(id: number) {
    return this.seriesRepository.delete(id);
  }
}
