import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Episode } from './entities/episode.entity';
import { Repository } from 'typeorm';
import { EpisodeDto } from './dto/episode.dto';
import { TelegramService } from 'src/telegram/telegram.service';
import { log } from 'console';

@Injectable()
export class EpisodeService {
  constructor(
    @InjectRepository(Episode) private episodeRepository: Repository<Episode>,
    private readonly telegramService: TelegramService,
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

  async update(id: number, released: boolean) {
    const result = await this.episodeRepository.findOne({
      where: { id },
      relations: ['series'],
    });
    if (result.released != released) {
      console.log('telegram');
      await this.telegramService.sendMessage(
        `Сериал: ${result.series.name} 
Эпизод: ${result.title}
Статус: ${released ? 'Вышел' : 'Не вышел'}`,
      );
    }
    return await this.episodeRepository.update(id, { released });
  }
}
