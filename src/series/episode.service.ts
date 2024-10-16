import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Episode } from './entities/episode.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EpisodeService {
  constructor(
    @InjectRepository(Episode) private episodeRepository: Repository<Episode>,
  ) {}

  async updateOrCreate(episode: Episode) {
    const result = await this.episodeRepository.findOneBy({
      series: episode.series,
      numberEpisode: episode.numberEpisode,
    });
    if (result == null) {
      return await this.episodeRepository.save(episode);
    }
    if (
      result.title != episode.title ||
      result.releaseDate != episode.releaseDate ||
      result.released != episode.released
    ) {
      await this.episodeRepository.update(result.id, episode);
    }
    if (result.released != episode.released) {
      //TODO: telegram
    }
    return await this.episodeRepository.findOneBy({ id: result.id });
  }
}
