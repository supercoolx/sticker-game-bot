module.exports = async (ctx, next) => {
    const member = await ctx.telegram.getChatMember(process.env.GROUP_ID, ctx.from.id);
    if (member.status === 'member') {
        return next();
    } else {
        console.log(`❌ ${ctx.from.first_name}#${ctx.from.id}(${member.status}) tried member action.`);
    }
};