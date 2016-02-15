var App = require('./app');
var controller = App.controller;
var bot = App.bot;
var Twit = require('twit')
var PRIVACY = JSON.parse(process.env.PRIVACY) || require('../config/privacy.json');
var T = new Twit({
  consumer_key:        process.env.CONSUMER_KEY,
  consumer_secret:     process.env.CONSUMER_SECRET,
  access_token:        process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
})
var STATUSES = {}

controller.hears([''], 'direct_mention, mention', function(bot, message) {
  var tweet = PRIVACY.REPLY_TO + " " + message.text;
  T.post('statuses/update', { status: tweet }, function(err, data, response) {
    STATUSES[data.id_str] = message.channel
  })
})

var stream = T.stream('user')

stream.on('tweet', function (tweet) {
  if (!STATUSES[tweet.in_reply_to_status_id_str]) {
    return;
  }
  var channelId = STATUSES[tweet.in_reply_to_status_id_str];
  STATUSES[tweet.in_reply_to_status_id_str] = null;

  var pureReplyText = tweet.text.replace(/@notebot109\s/, "")
  bot.say(
    {
      text: pureReplyText,
      channel: channelId
    }
  );
})
