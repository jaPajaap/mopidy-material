'use strict';

/**
 * @ngInject
 */
function OnConfig($locationProvider, $urlRouterProvider, SpotifyProvider) {
    $locationProvider.html5Mode(true);

    SpotifyProvider.setClientId('453d62ba1a244e8780eb53e3fcc4ccac');
    SpotifyProvider.setScope('user-read-private playlist-modify-public playlist-modify-private');
    SpotifyProvider.setRedirectUri('http://localhost:8080/callback.html');
    // If you already have an auth token
    SpotifyProvider.setAuthToken(localStorage.getItem('spotify-token'));

    $urlRouterProvider.otherwise('/');

}

module.exports = OnConfig;
