let CronJob = require('cron').CronJob;

let Botkit = require('./botkit');
let controller = Botkit.controller;
let bot = Botkit.bot;

let Wunderlist = require('./wunderlist');

let morning = new CronJob({
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
morning.start();

let reminder = new CronJob({
  cronTime: '00 00 00,03,06,09,12,15,18,21 * * *',
  onTick: Wunderlist.remindTasks,
  start: false,
  timeZone: 'Asia/Tokyo'
});
reminder.start();

