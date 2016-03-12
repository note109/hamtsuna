// TODO: Appじゃなくす
let App = require('./botkit');
let controller = App.controller;

let Storage = {

  _fetchChannelsData: () => {
    return new Promise((resolve, reject) => {
      controller.storage.teams.get("channels", (err, data) => {
        resolve(data);
      })
    })
  },

  _fetchMemories: (userId) => {
    return new Promise((resolve, reject) => {
      controller.storage.users.get(userId, (err, data) => {
        resolve(data);
      })
    })
  }

}

module.exports = Storage;
