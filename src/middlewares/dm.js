module.exports = async (ctx, next) => {
    if (ctx.message.chat.type == 'private') {
        return next();
    } else return;
};