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

  findAll() {
    return this.seriesRepository.find({
      order: { id: 'ASC' },
      relations: ['episodes'],
    });
  }

  findOne(id: number) {
    return this.seriesRepository.findOneBy({ id });
  }

  findByName(name: string) {
    return this.seriesRepository.findOneBy({ name });
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
