let App = require('./app');
let controller = App.controller;
let slack = require('./slack');
let storage = require('./storage');

require('./twitter');

controller.hears(['覚えて'], 'direct_mention,mention', (bot, message) => {
  let pureText = message.text.replace(/覚えて\s/, "")
  let obj = {id: message.user, memories: pureText}
  controller.storage.users.save(obj, (err) => {
    if (!err) {
      bot.reply(message, "覚えたよ");
    } else {
      console.log(err)
    }
  })
})

controller.hears(['思い出して'], 'direct_mention,mention', (bot, message) => {
  storage._fetchMemories(message.user).then((data) => {
    bot.reply(message, "思い出したよ");
    bot.reply(message, data.memories);
  })
})
