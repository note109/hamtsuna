let CronJob = require('cron').CronJob;

let Botkit = require('./botkit');
let controller = Botkit.controller;
let bot = Botkit.bot;

let Wunderlist = require('./wunderlist');

let getRandomInt = (min, max) => {
  return Math.floor( Math.random() * (max - min + 1) ) + min;
}

let setMorningAlerm; // let しておかないと onComplete で再帰的に呼び出せない。。なぜ。。
setMorningAlerm = () => {
  let cronTime  = `${getRandomInt(0,59)} ${getRandomInt(0,30)} ${getRandomInt(8,9)} * * *`;
  let wakeUpJob = new CronJob({
    cronTime: cronTime,
    onTick: () => {
      bot.say({
        text: 'おはもに',
        channel: 'C0RN7K5LK'
      });
      wakeUpJob.stop();
    },
    onComplete: () => {
      setMorningAlerm()
    },
    start: true,
    timeZone: 'Asia/Tokyo'
  });
}
setMorningAlerm();

let reminder = new CronJob({
  cronTime: '00 00 00,03,06,09,12,15,18,21 * * *',
  onTick: Wunderlist.remindTasks,
  start: false,
  timeZone: 'Asia/Tokyo'
});
reminder.start();

