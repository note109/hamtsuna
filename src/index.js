var App = require('./app');
var controller = App.controller;
var slack = require('./slack');
var storage = require('./storage');

controller.hears(['覚えて'], 'direct_mention,mention', function(bot, message) {
  var pureText = message.text.replace(/覚えて\s/, "")
  var obj = {id: message.user, memories: pureText}
  controller.storage.users.save(obj, function (err) {
    if (!err) {
      bot.reply(message, "覚えたよ");
    } else {
      console.log(err)
    }
  })
})

controller.hears(['思い出して'], 'direct_mention,mention', function(bot, message) {
  storage._fetchMemories(message.user).then(function (data) {
    bot.reply(message, "思い出したよ");
    bot.reply(message, data.memories);
  })
})
