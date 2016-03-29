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
  let hour   = getRandomInt(8, 9);
  let minute;
  let second = getRandomInt(0,59);
  if (hour === 8) {
    minute = getRandomInt(30, 59);
  } else if (hour === 9) {
    minute = getRandomInt(0, 9);
  }
  let cronTime  = `${second} ${minute} ${hour} * * *`;

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
      setTimeout(() => {
        setMorningAlerm()
      }, 1000 * 60 * 60)
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