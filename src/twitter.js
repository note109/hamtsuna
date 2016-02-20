let App = require('./app');
let controller = App.controller;
let bot = App.bot;
let Twit = require('twit');
let PRIVACY = process.env.PRIVACY ? JSON.parse(process.env.PRIVACY) : require('../config/privacy.json');
let T = new Twit({
  consumer_key:        process.env.CONSUMER_KEY,
  consumer_secret:     process.env.CONSUMER_SECRET,
  access_token:        process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
})
let STATUSES = {}

controller.hears([''], 'direct_mention, mention', (bot, message) => {
  let tweet = PRIVACY.REPLY_TO + " " + message.text;
  T.post('statuses/update', { status: tweet }, (err, data, response) => {
    STATUSES[data.id_str] = message.channel
  })
})

let stream = T.stream('user')

stream.on('tweet', (tweet) => {
  if (!STATUSES[tweet.in_reply_to_status_id_str]) {
    return;
  }
  let channelId = STATUSES[tweet.in_reply_to_status_id_str];
  STATUSES[tweet.in_reply_to_status_id_str] = null;

  let pureReplyText = tweet.text.replace(/@notebot109\s/, "")
  bot.say(
    {
      text: pureReplyText,
      channel: channelId
    }
  );
})
