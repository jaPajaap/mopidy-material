'use strict';

/**
 * @ngInject
 */
function OnConfig($locationProvider, AppSettings, SpotifyProvider) {
    SpotifyProvider.setClientId(AppSettings.spotifyClientId);
    SpotifyProvider.setScope('user-read-private playlist-modify-public playlist-modify-private');
    SpotifyProvider.setRedirectUri(AppSettings.appUrl);
    SpotifyProvider.setAuthToken(localStorage.getItem('spotify-token'));
}


module.exports = OnConfig;
