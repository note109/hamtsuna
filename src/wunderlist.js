const Botkit = require('./botkit');
const controller = Botkit.controller;
const bot = Botkit.bot;
const WunderlistSDK = require('wunderlist');
const wunderlistsdk = new WunderlistSDK({
  accessToken: process.env.SETTING_WUNDERLIST_ACCESS_TOKEN,
  clientID: process.env.SETTING_WUNDERLIST_CLIENT_ID
});

var moment = require('moment');

const Wunderlist = class {
  constructor() {}

  static createTask(listId, title) {
    return new Promise((resolve, reject) => {
      wunderlistsdk.http.tasks.create({
        'list_id': listId,
        'title': title
      }).done((task) => {
        resolve(task)
      }).fail((res) => {
        reject(res)
      });
    })
  }

  static async fetchTasks(listId) {
    return new Promise((resolve, reject) => {
      wunderlistsdk.http.tasks.forList(listId).done((tasks) => {
        resolve(tasks)
      }).fail((res) => {
        reject(res)
      })
    })
  }

  static async findList(title) {
    const lists = await this.fetchLists();
    let result;
    lists.forEach((list) => {
      if (list.title === title) {
        result = list;
      }
    })
    return result;
  }

  // TODO: redisも使う
  static fetchLists() {
    return new Promise((resolve, reject) => {
      wunderlistsdk.http.lists.all().done((lists) => {
        resolve(lists)
      }).fail((res) => {
        reject(res)
      })
    })
  }

  static remindTasks() {
    Wunderlist.fetchTasks('241680663').then(async (tasks) => {
      // TODO: taskListNameからChannelIdを取得する
      let channelId = "C04A8AML1"

      const today = moment();
      let remainedTasks = [];

      tasks.forEach((task) => {
        const taskCreatedAt = moment(task.created_at);
        if (today.diff(taskCreatedAt, 'weeks') >= 1) {
          remainedTasks.push(task.title);
        }
      });

      if (remainedTasks.length > 0) {
        let remainedTasksText = remainedTasks.toString().replace(/\,/gim, '\n');
        bot.say({
          text: `もういらないんじゃない？\n${remainedTasksText}`,
          channel: channelId
        });
      } else {
        console.log("----")
      }

    });
  }
}

module.exports = Wunderlist;