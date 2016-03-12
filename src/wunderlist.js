let WunderlistSDK = require('wunderlist');
let wunderlist = new WunderlistSDK({
  accessToken: process.env.SETTING_WUNDERLIST_ACCESS_TOKEN,
  clientID: process.env.SETTING_WUNDERLIST_CLIENT_ID
});

console.log("wunderlist")
wunderlist.http.lists.all().done((lists) => {
  console.log(lists)
}).fail((lists) => {
  console.log("miss", lists)
})
