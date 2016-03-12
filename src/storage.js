let Botkit = require('./botkit');
let controller = Botkit.controller;

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
