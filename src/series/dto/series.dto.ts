import { ApiProperty } from '@nestjs/swagger';
import { EpisodeDto } from './episode.dto';

export class SeriesDto {
  @ApiProperty({
    example: 'Breaking Bad',
    description: 'The name of the series',
    type: String,
  })
  name: string;

  @ApiProperty({
    example:
      "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family's future.",
    description: 'The description of the series',
    type: String,
  })
  description: string;

  @ApiProperty({
    example: '2008-01-20',
    description: 'The release date of the series',
    type: Date,
  })
  releaseDate: Date;

  @ApiProperty({
    example:
      'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
    description: 'The image URL of the series',
    type: String,
  })
  imageUrl: string;

  @ApiProperty({
    example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    description: 'The trailer URL of the series',
    type: String,
  })
  trailerUrl: string;

  @ApiProperty({
    example: 'genres',
    description: 'The trailer genres of the series',
    type: String,
  })
  genres: string;

  @ApiProperty({
    example: 'Episode',
    description: 'The trailer episodes of the series',
    type: [EpisodeDto],
  })
  episodes: EpisodeDto[];
}
