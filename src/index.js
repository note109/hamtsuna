require('./initialize');

let Botkit = require('./botkit');
let controller = Botkit.controller;
let slack = require('./slack');
let storage = require('./storage');

require('./wunderlist');
require('./twitter');
console.log("おはもに")

// ---
// 記憶
// ---
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

// ---
// Wunderlist連携
// ---
controller.hears(['^[W|w]under[L|l]ist$', '^ワンダーリスト$'], ['direct_mention', 'mention', 'ambient'], (bot, message) => {

  bot.startConversation(message, (err, convo) => {
    convo.ask('どんとこい！', async (response, convo) => {
      let list = await Wunderlist.findList("#wish") // TODO 他のリストにも対応
      let tasks = response.text.split(/[、|,\s*|\.|\s|\n]/)
      let result = "";
      // TODO: 並列処理にできそう
      for (let task of tasks) {
        let createdTask = await Wunderlist.createTask(list.id, task)
        if (createdTask.title === task) {
          result += ':pencil:'
        } else {
          result += ':no_entry_sign:'
        }
      }
      // FIXME: この書き方にするとエラーになっちゃうので一旦for_of_で逃げた
      // tasks.forEach((task) => {
      //   let createdTask = await Wunderlist.createTask(list.id, task)
      //   if (createdTask.title === response.text) {
      //     result += ':pencil:'
      //   } else {
      //     result += ':no_entry_sign:'
      //   }
      // })
      convo.say(result);
      convo.next();
    });
  });
});
