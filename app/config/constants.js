'use strict';

var mopidyHost = '192.168.1.103:6680';
var hostname = window.location.hostname;
var host = window.location.host;

var appUrl = hostname === 'localhost' ? 'http://' + host : mopidyHost + '/material';
var mopidyUrl = hostname === 'localhost' ? '127.0.0.1:6680' : mopidyHost;
console.log(appUrl, mopidyUrl);

var AppSettings = {
  appTitle: 'Mopidy',
  starredPlaylistId: '45AW0U4mHoXBA7GEKeE5Jq',
  spotifyClientId: '453d62ba1a244e8780eb53e3fcc4ccac',
  appUrl: appUrl,
  mopidyServer: mopidyUrl
};

module.exports = AppSettings;