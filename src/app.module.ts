import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SeriesModule } from './series/series.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParsingService } from './parsing/parsing.service';
import { ParsingController } from './parsing/parsing.controller';
import { ParsingModule } from './parsing/parsing.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TelegramModule } from './telegram/telegram.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'data/database.sqlite', // Укажи путь к файлу базы данных SQLite
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // Автоподключение сущностей
      synchronize: true, // Автосинхронизация — использовать с осторожностью в продакшене
    }),
    ScheduleModule.forRoot(),
    SeriesModule,
    ParsingModule,
    TelegramModule,
  ],
  controllers: [AppController, ParsingController],
  providers: [AppService, ParsingService],
})
export class AppModule {}
