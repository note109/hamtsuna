let CronJob = require('cron').CronJob;

let Botkit = require('./botkit');
let controller = Botkit.controller;
let bot = Botkit.bot;

let job = new CronJob({
  cronTime: '00 00 09 * * *',
  onTick: () => {
    bot.say(
      {
        text: 'おはもに',
        channel: 'C0RN7K5LK'
      }
    );
  },
  start: false,
  timeZone: 'Asia/Tokyo'
});

job.start();