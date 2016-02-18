let Botkit = require('botkit');

if (!process.env.TOKEN) {
  console.log('Error: Specify token in environment');
  process.exit(1);
}

let redisStorage = require('../node_modules/botkit/lib/storage/redis_storage.js')({
  url: process.env.REDIS_URL
});

let controller = Botkit.slackbot({
  debug: false,
  log: false,
  storage: redisStorage
});

let bot = controller.spawn({
  token: process.env.TOKEN
}).startRTM((err) => {
  if (err) {
    throw new Error(err);
  }
});

module.exports = {
  controller: controller,
  bot: bot
}