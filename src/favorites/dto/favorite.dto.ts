import { ApiProperty } from '@nestjs/swagger';

export class FavoriteDto {
  @ApiProperty({ example: 1, description: 'The id of the user', type: Number })
  userId: number;

  @ApiProperty({
    example: 1,
    description: 'The id of the series',
    type: Number,
  })
  seriesId: number;
}
