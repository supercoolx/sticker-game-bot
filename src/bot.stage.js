const { Stage }  = require('telegraf/scenes');
const start = require('./scenes/start');

const stage = new Stage([]);

stage.register(start);

module.exports = (bot) => {
    bot.use(stage.middleware());
};