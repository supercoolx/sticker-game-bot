const { Stage } = require('telegraf/scenes');
const adminMiddleware = require('./middlewares/admin');
const dmMiddleware = require('./middlewares/dm');

module.exports = (bot) => {
	bot.command('start', dmMiddleware, adminMiddleware, Stage.enter('start'));

	bot.command('check', dmMiddleware, adminMiddleware, (ctx) => {

	});

	bot.command('membership', adminMiddleware, async (ctx) => {
		const member = await ctx.telegram.getChatMember(process.env.GROUP_ID, ctx.botInfo.id);
		if (member.status === 'member' || member.status === 'administrator') {
			ctx.reply(`My membership is ${member.status}.`);
		} else {
			ctx.reply(`I am not a member of group.`);
		}
	});
}