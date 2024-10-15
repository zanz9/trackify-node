import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';
import axios from 'axios';
import Endpoints from 'src/endpoints/endpoints';
import { Cron } from '@nestjs/schedule';
import { Series } from 'src/series/entities/series.entity';
import { SeriesService } from 'src/series/series.service';
import { SeriesDto } from 'src/series/dto/series.dto';
import { Episode } from 'src/series/entities/episode.entity';
import { EpisodeService } from 'src/series/episode.service';

@Injectable()
export class ParsingService {
  constructor(
    private readonly seriesService: SeriesService,
    private readonly episodeService: EpisodeService,
  ) {}

  @Cron('* 12 * * *')
  async parseData(): Promise<void> {
    console.log('service init');
    const series = await this.parseHtmlFromUrl();
    await Promise.all(
      series.map(async (s) => {
        const result = new SeriesDto();
        result.name = s.series.name;
        result.description = s.series.description;
        result.releaseDate = s.series.releaseDate;
        result.imageUrl = s.series.imageUrl;
        result.trailerUrl = s.series.trailerUrl;
        result.genres = s.series.genres;

        const createdSeries = await this.seriesService.updateOrCreate(result);
        console.log('createdSeries');
        const episodes = s.episodes.map((e) => {
          const episode = new Episode();
          episode.title = e.title;
          episode.releaseDate = e.releaseDate;
          episode.released = e.released;
          episode.series = createdSeries; // Привязываем к созданной серии
          return episode;
        });

        await Promise.all(
          episodes.map((ep) => this.episodeService.updateOrCreate(ep)),
        );
        console.log('createdEpisodes');
      }),
    );
  }

  async parseHtmlFromUrl(): Promise<
    {
      series: Series;
      episodes: { title: string; releaseDate: Date; released: boolean }[];
    }[]
  > {
    const { data } = await axios.get(Endpoints.BASE_URL + Endpoints.RASPISANIE);
    const $ = cheerio.load(data);
    const hrefs: string[] = [];

    $('.letter>td>a').each((i, element) => {
      var href = $(element).attr('href');
      if (hrefs.includes(href)) return;
      hrefs.push(href);
    });

    const promises = hrefs.map(async (href) => {
      const { data: data2 } = await axios.get(Endpoints.BASE_URL + href);
      const $2 = cheerio.load(data2, { scriptingEnabled: true });
      const titleElement = $2('#rasp .zagol').children('th')[1];
      const title = $2(titleElement).text();
      if (title === '') return null;

      const letter1Element = $2('#rasp .letter1');
      if (letter1Element.length === 0 || letter1Element.length < 4) return null;

      const releaseDate = $2(letter1Element)
        .first()
        .children('td')
        .last()
        .text();
      const genres = $2(letter1Element).last().children('td').last().text();

      const iframeHtml = $2('.entry-content noscript').last().text();
      const iframe = cheerio.load(iframeHtml);
      const trailerUrl = iframe('iframe').attr('src');

      const iframeHtmlImg = $2('img.aligncenter')
        .first()
        .parent()
        .children('noscript')
        .text();
      const iframeImg = cheerio.load(iframeHtmlImg);
      const imageUrl = iframeImg('img').attr('src');

      const episodes = $2('#rasp>tbody').last().children('tr');
      const episodesArray: {
        title: string;
        releaseDate: Date;
        released: boolean;
      }[] = [];
      episodes.each((i, element) => {
        var released = false;
        if ($2(element).hasClass('gotov')) {
          released = true;
        }
        const title = $2(element).children('td').first().text();
        const releaseDate = $2(element).children('td').last().text();
        episodesArray.push({
          title,
          releaseDate: new Date(releaseDate),
          released,
        });
      });

      const series = new Series();
      series.name = title;
      series.releaseDate = new Date(releaseDate);
      series.genres = genres;
      series.trailerUrl = trailerUrl;
      series.imageUrl = imageUrl;
      series.description = '';

      return { series, episodes: episodesArray };
    });

    const objects = (await Promise.all(promises)).filter(
      (item) => item !== null,
    );

    return objects;
  }
}
