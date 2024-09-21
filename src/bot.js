require('dotenv').config();
const { Telegraf, Scenes, session }  = require('telegraf');
const rateLimit = require('telegraf-ratelimit');

const attachCommandEvent = require('./bot.command');
const attachStickerEvent = require('./bot.sticker');
const attachStage = require('./bot.stage');
const connectDB = require('./bot.db');

const bot = new Telegraf(process.env.BOT_TOKEN);

const limitConfig = {
    window: 3000,
    limit: 1,
    onLimitExceeded: (ctx, next) => ctx.reply('❗❗❗ Rate limited')
}
bot.use(rateLimit(limitConfig));
bot.use(session());

attachStage(bot);
attachCommandEvent(bot);
attachStickerEvent(bot);

bot.catch((err) => {
    console.error('❗Ooops!', err);
});

connectDB().then(() => bot.launch());