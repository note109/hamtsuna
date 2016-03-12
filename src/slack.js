// TODO: Appじゃなくす
let App = require('./botkit');
let bot = App.bot;
let controller = App.controller;
let storage = require('./storage');

let Slack = {

  getChannelName: (channelId) => {
    return new Promise((resolve, reject) => {
      this._fetchChannelData().then((channels) => {
        if (channels[channelId]) {
          resolve(channels[channelId]);
        } else {
          this._fetchChannelsDataFromApi().then((data) => {
            resolve(data[channelId]);
          })
        }
      })
    })
  },

  _fetchChannelData: () => {
    return new Promise((resolve, reject) => {
      storage._fetchChannelsData().then((data) => {
        if (data) {
          resolve(data);
        } else {
          this._fetchChannelsDataFromApi().then((data) => {
            resolve(data);
          })
        }
      })
    })
  },

  _fetchChannelsDataFromApi: () => {
    return new Promise((resolve, reject) => {
      bot.api.channels.list({}, (err, response) => {
        let obj = {id: "channels"}
        response.channels.forEach((channel) => {
          obj[channel.id] = channel.name
        })
        controller.storage.teams.save(obj, (err) => { console.log(err) })
        resolve(obj); // id: "channels" が含まれるけどいいや
      })
    })
  }

}

module.exports = Slack;
