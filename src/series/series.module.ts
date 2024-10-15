import { Module } from '@nestjs/common';
import { SeriesService } from './series.service';
import { SeriesController } from './series.controller';
import { Series } from './entities/series.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Episode } from './entities/episode.entity';
import { EpisodeService } from './episode.service';

@Module({
  imports: [TypeOrmModule.forFeature([Series, Episode])],
  controllers: [SeriesController],
  providers: [SeriesService, EpisodeService],
  exports: [SeriesService, EpisodeService],
})
export class SeriesModule {}
