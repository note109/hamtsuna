let LOCAL_SETTING = require('../config/setting.json');

let assignSettingToEnv = (settings, varNameBase = 'SETTING') => {
  Object.keys(settings).forEach((key) => {
    let value = settings[key];
    if (typeof value === 'object') {
      assignSettingToEnv(value, `${varNameBase}_${key}`);
    } else {
      process.env[`${varNameBase}_${key}`.toUpperCase()] = value
    }
  })
}

if (LOCAL_SETTING) {
  assignSettingToEnv(LOCAL_SETTING)
}
