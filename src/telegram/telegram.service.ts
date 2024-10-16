import { Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';

@Injectable()
export class TelegramService {
  private bot: Telegraf;

  constructor() {
    this.bot = new Telegraf('7897917060:AAFTi4Hq7RwGXalZ-xL8E-7OdhJqTx0R5aQ');
    this.initializeBot();
  }

  private initializeBot() {
    this.bot.start((ctx) => ctx.reply('Welcome! Its Trackify!'));
    // this.bot.on('text', (ctx) => ctx.reply(`You said: ${ctx.message.text}`));

    this.bot
      .launch()
      .catch((err) => console.error('Failed to launch bot', err));
  }

  async sendMessage(message: string) {
    await this.bot.telegram.sendMessage('912418238', message);
  }
}
