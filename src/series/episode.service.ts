import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Episode } from './entities/episode.entity';
import { Repository } from 'typeorm';
import { EpisodeDto } from './dto/episode.dto';

@Injectable()
export class EpisodeService {
  constructor(
    @InjectRepository(Episode) private episodeRepository: Repository<Episode>,
  ) {}

  async updateOrCreate(episode: EpisodeDto) {
    const result = await this.episodeRepository.findOneBy({
      title: episode.title,
      releaseDate: episode.releaseDate,
    });
    if (result == null) {
      return await this.episodeRepository.save(episode);
    }
    await this.episodeRepository.update(result.id, episode);
    return await this.episodeRepository.findOneBy({ id: result.id });
  }
}
