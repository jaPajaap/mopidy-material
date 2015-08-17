'use strict';

/**
 * @ngInject
 */
function OnConfig(AppSettings, $locationProvider, $urlRouterProvider, SpotifyProvider) {
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');

    SpotifyProvider.setClientId(AppSettings.spotifyClientId);
    SpotifyProvider.setScope('user-read-private playlist-modify-public playlist-modify-private');
    SpotifyProvider.setRedirectUri(AppSettings.appServer +'/callback.html');
    SpotifyProvider.setAuthToken(localStorage.getItem('spotify-token'));


}

module.exports = OnConfig;
