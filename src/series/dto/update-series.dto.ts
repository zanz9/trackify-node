import { PartialType } from '@nestjs/mapped-types';
import { CreateSeriesDto } from './create-series.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSeriesDto extends PartialType(CreateSeriesDto) {
  @ApiProperty({
    example: 'Breaking Bad',
    description: 'The name of the series',
  })
  name: string;

  @ApiProperty({
    example:
      "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family's future.",
    description: 'The description of the series',
  })
  description: string;

  @ApiProperty({
    example: '2008-01-20',
    description: 'The release date of the series',
  })
  releaseDate: Date;

  @ApiProperty({
    example:
      'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
    description: 'The image URL of the series',
  })
  imageUrl: string;

  @ApiProperty({
    example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    description: 'The trailer URL of the series',
  })
  trailerUrl: string;

  @ApiProperty({
    example: '1 hour 20 minutes',
    description: 'The time for the next episode of the series',
  })
  timeForNextEpisode: string;
}
