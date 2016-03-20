if (!process.env.SETTING_BOTKIT_TOKEN) {
  require('./initialize');
}
let PRIVACY = process.env.PRIVACY ? JSON.parse(process.env.PRIVACY) : require('../config/privacy.json');

let Botkit = require('./botkit');
let controller = Botkit.controller;
let bot = Botkit.bot;

let slack = require('./slack');

let storage = require('./storage');

let Wunderlist = require('./wunderlist');

let Twitter = require('./twitter');
let STATUSES = {}
let stream = Twitter.stream('user', {track: '@notebot109'})

require('./cron')

console.log('おはもに')

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

// ---
// 会話
// ---
controller.hears([''], 'direct_mention, mention', (bot, message) => {
  let tweet = PRIVACY.REPLY_TO + " " + message.text;
  Twitter.post('statuses/update', { status: tweet }, (err, data, response) => {
    STATUSES[data.id_str] = message.channel
    console.log(STATUSES)
  })
})

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

// ---
// レシピ
// ---
controller.hears(['^:rice_ball:$'], ['direct_mention', 'mention', 'ambient'], (bot, message) => {
  Twitter.get('statuses/user_timeline', { screen_name: 'm_kyounoryouri', count: 200 }, (err, data, response) => {
    for (let n of [0, 1, 2]) {
      let index = Math.floor(Math.random() * 199)
      bot.say(
        {
          text: `https://twitter.com/m_kyounoryouri/status/${data[index].id_str}`,
          channel: message.channel
        }
      );
    }
  })
});
