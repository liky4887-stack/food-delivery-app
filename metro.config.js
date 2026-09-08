const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.watcher = {
  ...config.watcher,
  unstable_disableWatchman: true,
  // Reduce file watcher pressure
  maxWatchers: 50,
};

module.exports = config;
