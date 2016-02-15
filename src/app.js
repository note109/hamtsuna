var Botkit = require('botkit');

if (!process.env.TOKEN) {
  console.log('Error: Specify token in environment');
  process.exit(1);
}

var redisStorage = require('../node_modules/botkit/lib/storage/redis_storage.js')({
  url: process.env.REDIS_URL
});

var controller = Botkit.slackbot({
  debug: false,
  log: false,
  storage: redisStorage
});

var bot = controller.spawn({
  token: process.env.TOKEN
}).startRTM(function(err) {
  if (err) {
    throw new Error(err);
  }
});

module.exports = {
  controller: controller,
  bot: bot
}