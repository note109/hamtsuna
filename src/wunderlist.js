let Botkit = require('./botkit');
let controller = Botkit.controller;
let bot = Botkit.bot;
let WunderlistSDK = require('wunderlist');
let wunderlistsdk = new WunderlistSDK({
  accessToken: process.env.SETTING_WUNDERLIST_ACCESS_TOKEN,
  clientID: process.env.SETTING_WUNDERLIST_CLIENT_ID
});

let Wunderlist = class {
  constructor() {}

  static createTask(listId, title) {
    return new Promise((resolve, reject) => {
      wunderlistsdk.http.tasks.create({
        'list_id': listId,
        'title': title
      }).done(function (task) {
        resolve(task)
      }).fail(function (res) {
        reject(res)
      });
    })
  }

  static async findList(title) {
    const lists = await this.fetchList();
    let result;
    lists.forEach((list) => {
      if (list.title === title) {
        result = list;
      }
    })
    return result;
  }

  static fetchList() {
    return new Promise((resolve, reject) => {
      wunderlistsdk.http.lists.all().done((lists) => {
        resolve(lists)
      }).fail((res) => {
        reject(res)
      })
    })
  }

}