import { Module } from '@nestjs/common';
import { ParsingService } from './parsing.service';
import { ParsingController } from './parsing.controller';
import { SeriesModule } from 'src/series/series.module';
import { SeriesService } from 'src/series/series.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Series } from 'src/series/entities/series.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Series]), SeriesModule],
  providers: [ParsingService],
  controllers: [ParsingController],
  exports: [ParsingService],
})
export class ParsingModule {}
