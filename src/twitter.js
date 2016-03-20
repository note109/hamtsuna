let Twit = require('twit');
let T = new Twit({
  consumer_key:        process.env.SETTING_TWITTER_CONSUMER_KEY,
  consumer_secret:     process.env.SETTING_TWITTER_CONSUMER_SECRET,
  access_token:        process.env.SETTING_TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.SETTING_TWITTER_ACCESS_TOKEN_SECRET
})

module.exports = T;