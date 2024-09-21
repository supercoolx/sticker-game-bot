module.exports = async (ctx, next) => {
    if (ctx.message.chat.id == process.env.GROUP_ID) {
        return next();
    } else return;
};