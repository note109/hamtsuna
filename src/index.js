require('./initialize');

let App = require('./app');
let controller = App.controller;
let slack = require('./slack');
let storage = require('./storage');

require('./wunderlist');
require('./twitter');
console.log("おはもに")
// 記憶

controller.hears(['^覚えて$'], ['direct_mention', 'mention', 'ambient'], (bot, message) => {
  bot.startConversation(message, (err, convo) => {
    convo.ask('何を覚える？', (response, convo) => {
      let saveObj = {id: response.user, memories: response.text}
      controller.storage.users.save(saveObj, (err) => {
        if (!err) {
          convo.say("覚えたよ");
        } else {
          convo.say("エラー");
        }
        convo.next();
      })
    });
  });
});

controller.hears(['^思い出して$'], ['direct_mention', 'mention', 'ambient'], (bot, message) => {
  storage._fetchMemories(message.user).then((data) => {
    bot.reply(message, data.memories);
  })
})
