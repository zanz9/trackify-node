import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoriteDto } from './dto/favorite.dto';
import { ApiResponse, ApiOperation, ApiTags, ApiQuery } from '@nestjs/swagger';

@ApiTags('favorites')
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new favorite' })
  @ApiResponse({
    status: 201,
    description: 'The favorite has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  create(@Body() createFavoriteDto: FavoriteDto) {
    return this.favoritesService.create(createFavoriteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all favorites' })
  @ApiResponse({
    status: 200,
    description: 'The favorites have been successfully retrieved.',
  })
  @ApiResponse({ status: 404, description: 'Favorites not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiQuery({ name: 'userId', type: Number, required: true })
  findAll(@Query('userId') userId: number) {
    return this.favoritesService.findAll(+userId);
  }

  @Get('check')
  @ApiOperation({
    summary: 'Check if a favorite exists by UserId and SeriesId',
  })
  @ApiResponse({
    status: 200,
    description: 'The favorite has been successfully retrieved.',
  })
  @ApiResponse({ status: 404, description: 'Favorite not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiQuery({ name: 'userId', type: Number, required: true })
  @ApiQuery({ name: 'seriesId', type: Number, required: true })
  async findOne(
    @Query('userId') userId: number,
    @Query('seriesId') seriesId: number,
  ) {
    const favorite = await this.favoritesService.findOne(+userId, +seriesId);
    return favorite ? true : false;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a favorite by ID' })
  @ApiResponse({
    status: 200,
    description: 'The favorite has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Favorite not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  remove(@Param('id') id: string) {
    return this.favoritesService.remove(+id);
  }
}
