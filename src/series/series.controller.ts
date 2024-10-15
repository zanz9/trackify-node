import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SeriesService } from './series.service';
import { CreateSeriesDto } from './dto/create-series.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('series')
@Controller('series')
export class SeriesController {
  constructor(private readonly seriesService: SeriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new series' })
  @ApiResponse({
    status: 201,
    description: 'The series has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  create(@Body() createSeriesDto: CreateSeriesDto) {
    return this.seriesService.create(createSeriesDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all series' })
  @ApiResponse({
    status: 200,
    description: 'The series has been successfully retrieved.',
  })
  @ApiResponse({ status: 404, description: 'Series not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  findAll() {
    return this.seriesService.findAll();
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

  @Patch(':id')
  @ApiOperation({ summary: 'Update a series by ID' })
  @ApiResponse({
    status: 200,
    description: 'The series has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Series not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  update(@Param('id') id: string, @Body() updateSeriesDto: UpdateSeriesDto) {
    return this.seriesService.update(+id, updateSeriesDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a series by ID' })
  @ApiResponse({
    status: 200,
    description: 'The series has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Series not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  remove(@Param('id') id: string) {
    return this.seriesService.remove(+id);
  }
}
