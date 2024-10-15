import { Controller, Get } from '@nestjs/common';
import { ParsingService } from './parsing.service';

@Controller('parsing')
export class ParsingController {
  constructor(private readonly parsingService: ParsingService) {}

  @Get()
  async parseHtmlFromUrl() {
    return this.parsingService.parseData();
  }
}
