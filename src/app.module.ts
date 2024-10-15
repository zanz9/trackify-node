import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SeriesModule } from './series/series.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'data/database.sqlite', // Укажи путь к файлу базы данных SQLite
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // Автоподключение сущностей
      synchronize: true, // Автосинхронизация — использовать с осторожностью в продакшене
    }),
    SeriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
