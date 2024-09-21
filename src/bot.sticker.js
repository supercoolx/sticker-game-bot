const Game = require('./models/game');
const memberMiddleware = require('./middlewares/member');
const groupMiddleware = require('./middlewares/group');

module.exports = (bot) => {
	bot.on('sticker', groupMiddleware, memberMiddleware, async (ctx) => {
        if ((ctx.message.chat.type === 'group' || ctx.message.chat.type === 'supergroup') && ctx.message.chat.id == process.env.GROUP_ID) {
            const now = Date.now();
            
            const game = await Game.findOne({
                started_at: { $lte: now },
                closed_at: { $gte: now }
            });

            if (!game) return;

            const user = {
                id: ctx.from.id,
                username: ctx.from.username,
                first_name: ctx.from.first_name,
                last_name: ctx.from.last_name,
                sticker_id: ctx.message.sticker.file_id
            };

            const userIndex = game.users.findIndex(u => u.id === user.id);

            if (userIndex !== -1) game.users[userIndex] = user;
            else game.users.push(user);

            await game.save();
            console.log(`${ctx.from.first_name}#${ctx.from.id} selected ${ctx.message.sticker.emoji}`);
        }
    });
}