const cron = require('node-cron');
const Game = require('../models/game');

module.exports = (ctx, startedAt, afterMinute) => {
    
    const now = new Date();
    now.setMinutes(now.getMinutes() + afterMinute);

    const task = cron.schedule(`${now.getMinutes()} ${now.getHours()} * * *`, async () => {
        const game = await Game.findOne({ started_at: startedAt });
        if (!game) {
            console.log('❗Something went wrong. Game is not started but cron job started.');
            return;
        }
        // Find winners
        const winners = game.users.filter(user => user.sticker_id === game.first_sticker_id);

        let message;
        if (winners.length > 0) {
            message = `Game finished!\nWinners: ${ winners.map(winner => winner.first_name).join(', ') }`;
        } else {
            message = 'Nobody shoot the moon';
        }

        await ctx.telegram.sendMessage(process.env.GROUP_ID, message);
        await ctx.telegram.sendSticker(process.env.GROUP_ID, game.first_sticker_id);

        console.log(message);

        task.stop();
    }, { scheduled: true });
}
