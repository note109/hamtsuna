var App = require('./app');
var controller = App.controller;

var Storage = {

  _fetchChannelsData: function () {
    return new Promise(function (resolve, reject) {
      controller.storage.teams.get("channels", function(err, data) {
        resolve(data);
      })
    })
  },

  _fetchMemories: function (userId) {
    return new Promise(function (resolve, reject) {
      controller.storage.users.get(userId, function(err, data) {
        resolve(data);
      })
    })
  }

}

module.exports = Storage;
