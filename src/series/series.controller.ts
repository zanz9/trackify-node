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
import { SeriesService } from './series.service';
import { SeriesDto } from './dto/series.dto';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('series')
@Controller('series')
export class SeriesController {
  constructor(private readonly seriesService: SeriesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all series' })
  @ApiResponse({
    status: 200,
    description: 'The series has been successfully retrieved.',
  })
  @ApiResponse({ status: 404, description: 'Series not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  findAll(@Query('page') page: number, @Query('limit') limit: number) {
    page = page || 1;
    limit = limit || 10;
    console.log(page, limit);
    return this.seriesService.findAll(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a series by ID' })
  @ApiResponse({
    status: 200,
    description: 'The series has been successfully retrieved.',
  })
  @ApiResponse({ status: 404, description: 'Series not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  findOne(@Param('id') id: string) {
    return this.seriesService.findOne(+id);
  }
}
