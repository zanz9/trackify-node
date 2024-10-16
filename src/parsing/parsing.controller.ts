import { Controller, Get, Query } from '@nestjs/common';
import { ParsingService } from './parsing.service';

@Controller('parsing')
export class ParsingController {
  constructor(private readonly parsingService: ParsingService) {}

  async parseHtmlFromUrl() {
    return this.parsingService.parseData();
  }

  @Get()
  async parseOne(@Query('href') href: string) {
    return this.parsingService.parseOne(href);
  }
}
