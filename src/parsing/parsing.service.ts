import { Injectable, Scope } from '@nestjs/common';
import * as cheerio from 'cheerio';
import axios from 'axios';
import Endpoints from 'src/endpoints/endpoints';
import { Cron } from '@nestjs/schedule';
import { Series } from 'src/series/entities/series.entity';
import { SeriesService } from 'src/series/series.service';
import { SeriesDto } from 'src/series/dto/series.dto';
import { Episode } from 'src/series/entities/episode.entity';
import { EpisodeService } from 'src/series/episode.service';
import { parse } from 'date-fns';
import { ru } from 'date-fns/locale';
import { log } from 'console';
import { EpisodeDto } from 'src/series/dto/episode.dto';

let isCronRunning = false;

@Injectable({ scope: Scope.DEFAULT })
export class ParsingService {
  constructor(
    private readonly seriesService: SeriesService,
    private readonly episodeService: EpisodeService,
  ) {}

  async parseOne(href: string) {
    const data = await this.parseOneSeriesHtml(href);
    const result = new SeriesDto();
    result.name = data.series.name;
    result.description = data.series.description;
    result.releaseDate = data.series.releaseDate;
    result.imageUrl = data.series.imageUrl;
    result.trailerUrl = data.series.trailerUrl;
    result.genres = data.series.genres;
    result.href = data.series.href;

    const createdSeries = await this.seriesService.updateOrCreate(result);
    const episodes = data.episodes.map((e) => {
      const episode = new Episode();
      episode.title = e.title;
      episode.releaseDate = e.releaseDate;
      episode.released = e.released;
      episode.series = createdSeries;
      episode.numberEpisode = e.numberEpisode;
      return episode;
    });
    await Promise.all(
      episodes.map((ep) => this.episodeService.updateOrCreate(ep)),
    );

    return this.seriesService.findOne(createdSeries.id);
  }

  @Cron('0 0 */6 * * *', {
    disabled: process.env.NODE_ENV === 'development',
    timeZone: 'Asia/Almaty',
  })
  async parseData(): Promise<void> {
    if (isCronRunning) {
      console.log('Cron is already running, skipping execution.');
      return;
    }

    isCronRunning = true;
    console.log('service init');

    try {
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
          result.href = s.series.href;

          const createdSeries = await this.seriesService.updateOrCreate(result);
          const episodes = s.episodes.map((e) => {
            const episode = new Episode();
            episode.title = e.title;
            episode.releaseDate = e.releaseDate;
            episode.released = e.released;
            episode.series = createdSeries; // Привязываем к созданной серии
            episode.numberEpisode = e.numberEpisode;
            return episode;
          });

          await Promise.all(
            episodes.map((ep) => this.episodeService.updateOrCreate(ep)),
          );
        }),
      );
    } catch (error) {
      console.error('Error during cron execution:', error);
    } finally {
      isCronRunning = false;
      console.log('service end');
    }
  }

  async parseHtmlFromUrl(): Promise<
    {
      series: Series;
      episodes: EpisodeDto[];
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

    console.log(`Всего ссылок: ${hrefs.length}`);
    const promises = hrefs.map(async (href) => {
      return await this.parseOneSeriesHtml(href);
    });
    const objects = (await Promise.all(promises)).filter(
      (item) => item !== null,
    );
    console.log(`Всего серий: ${objects.length}`);
    return objects;
  }

  async parseOneSeriesHtml(href: string) {
    const { data: data2 } = await axios.get(Endpoints.BASE_URL + href);
    const $2 = cheerio.load(data2, { scriptingEnabled: true });
    const titleElement = $2('#rasp .zagol').children('th')[1];
    const title = $2(titleElement).text();
    if (title === '') return null;

    const letter1Element = $2('#rasp .letter1');
    if (letter1Element.length === 0 || letter1Element.length < 4) return null;

    const tempReleaseDate = $2(letter1Element)
      .first()
      .children('td')
      .last()
      .text();
    const releaseDate = parse(tempReleaseDate, 'd MMMM yyyy', new Date(), {
      locale: ru,
    });

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
    const episodesArray: EpisodeDto[] = [];
    episodes.each((i, element) => {
      var released = false;
      if ($2(element).hasClass('gotov')) {
        released = true;
      }
      const titleEpisode = $2(element).children('td').first().text();
      const tempReleaseDate = $2(element)
        .children('td')
        .last()
        .text()
        .replace(/\s+/g, ' ')
        .trim();
      const releaseDate = parse(tempReleaseDate, 'd MMMM yyyy', new Date(), {
        locale: ru,
      });
      episodesArray.push({
        numberEpisode: i,
        title: titleEpisode,
        releaseDate: releaseDate,
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
    series.href = href;

    return { series, episodes: episodesArray };
  }
}
