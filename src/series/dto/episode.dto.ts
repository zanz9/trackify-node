import { ApiProperty } from '@nestjs/swagger';

export class EpisodeDto {
  @ApiProperty({
    example: 1,
    description: 'The number of the episode',
    type: Number,
  })
  numberEpisode: number;

  @ApiProperty({
    example: '3 серия',
    description: 'The title of the episode',
    type: String,
  })
  title: string;

  @ApiProperty({
    example: '2024-10-17T19:00:00.000Z',
    description: 'The release date of the episode',
    type: Date,
  })
  releaseDate: Date;

  @ApiProperty({
    example: true,
    description: 'The status of the episode',
    type: Boolean,
  })
  released: boolean;
}
