import { Body, Controller, Param, Patch } from '@nestjs/common';
import { EpisodeService } from './episode.service';
import { Episode } from './entities/episode.entity';
import { EpisodeDto } from './dto/episode.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('episodes')
@Controller('episodes')
export class EpisodeController {
  constructor(private readonly episodeService: EpisodeService) {}

  @Patch(':id')
  updateOrCreate(@Param('id') id: string, @Body() episode: EpisodeDto) {
    return this.episodeService.update(+id, episode);
  }
}
