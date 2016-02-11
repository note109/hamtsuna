var App = require('./app');
var bot = App.bot;
var controller = App.controller;
var storage = require('./storage');

var Slack = {

  getChannelName: function (channelId) {
    var that = this;
    return new Promise(function (resolve, reject) {
      that._fetchChannelData().then(function (channels) {
        if (channels[channelId]) {
          resolve(channels[channelId]);
        } else {
          that._fetchChannelsDataFromApi().then(function (data) {
            resolve(data[channelId]);
          })
        }
      })
    })
  },

  _fetchChannelData: function () {
    var that = this;
    return new Promise(function (resolve, reject) {
      storage._fetchChannelsData().then(function (data) {
        if (data) {
          resolve(data);
        } else {
          that._fetchChannelsDataFromApi().then(function (data) {
            resolve(data);
          })
        }
      })
    })
  },

  _fetchChannelsDataFromApi: function () {
    return new Promise(function (resolve, reject) {
      bot.api.channels.list({}, function(err, response) {
        var obj = {id: "channels"}
        response.channels.forEach(function(channel) {
          obj[channel.id] = channel.name
        })
        controller.storage.teams.save(obj, function (err) { console.log(err) })
        resolve(obj); // id: "channels" が含まれるけどいいや
      })
    })
  }

}

module.exports = Slack;
