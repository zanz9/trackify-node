import { Injectable } from '@nestjs/common';
import { CreateSeriesDto } from './dto/create-series.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Series } from './entities/series.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeriesService {
  constructor(
    @InjectRepository(Series) private seriesRepository: Repository<Series>,
  ) {}

  create(createSeriesDto: CreateSeriesDto) {
    return this.seriesRepository.save(createSeriesDto);
  }

  findAll() {
    return this.seriesRepository.find({ order: { id: 'ASC' } });
  }

  findOne(id: number) {
    return this.seriesRepository.findOneBy({ id });
  }

  update(id: number, updateSeriesDto: UpdateSeriesDto) {
    return this.seriesRepository.update(id, updateSeriesDto);
  }

  remove(id: number) {
    return this.seriesRepository.delete(id);
  }
}
