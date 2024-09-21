const { Scenes, Markup } = require('telegraf');
const Game = require('../models/game');
const runResultJob = require('../jobs/result');

const start = new Scenes.WizardScene('start',
    async (ctx) => {
        // Check if ongoing game is exist
        const now = Date.now();
        const game = await Game.findOne({
            started_at: { $lte: now },
            closed_at: { $gte: now }
        });
        if (game) {
            await ctx.reply(`Game is already running. It will finished in ${ Math.floor((game.closed_at - now) / 60000) } minutes.`);
            await ctx.scene.leave();
            return;
        }
        // Main start
        await ctx.reply("You want to start game? Then send me sticker.");
        ctx.scene.session.game = { started_by: ctx.from.id };
        await ctx.wizard.next();
    },
    async (ctx) => {
        // Check message is valid sticker
        if (!ctx.message.sticker) return ctx.reply('Please send me sticker.');
        const sticker = ctx.message.sticker;
        ctx.scene.session.game.first_sticker_id = sticker.file_id;
        // Create game
        const now = Date.now();
        await Game.create({
            started_at: now,
            closed_at: now + 60 * 60 * 1000,
            ...ctx.scene.session.game
        });
        console.log(`✅Game created by ${ctx.from.first_name}#${ctx.from.id}`);
        // Send result and leave scene
        await ctx.reply(`You selected sticker "${ sticker.set_name }". Game started.`);
        await ctx.telegram.sendMessage(process.env.GROUP_ID, `Game started.\nSelect one of the sticker set below.\nhttps://t.me/addstickers/${ sticker.set_name }`);
        await ctx.scene.leave();
        // Start cron job that show result
        runResultJob(ctx, now, 10);
    }
);

module.exports = start;