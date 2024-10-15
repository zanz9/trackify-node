import { Module } from '@nestjs/common';
import { SeriesService } from './series.service';
import { SeriesController } from './series.controller';
import { Series } from './entities/series.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Series])],
  controllers: [SeriesController],
  providers: [SeriesService],
})
export class SeriesModule {}
