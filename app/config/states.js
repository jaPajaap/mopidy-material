'use strict';

function States($urlRouterProvider, $stateProvider, SpotifyProvider) {
    checkToken()

    $urlRouterProvider.otherwise('/playlists')

    $stateProvider
        .state('app', {
            url: '',
            abstract: true,
            template: '<ui-view class="container"></ui-view><player me="me"></player>',
            controller: AppController,
            resolve: {
                mopidy: getMopidy,
                me: getMe
            }
        })
        .state('app.playlists', {
            url: '/playlists',
            name: 'Playlists',
            views: {
                '@app': {
                    template: '<playlists-container></playlists-container>'
                }
            }
        })
            .state('app.playlists.show', {
                url: '/:playlistUri',
                name: 'Playlist',
                views: {
                    '@app': {
                        controller: function($scope, $state) {
                            $scope.playlistUri = $state.params.playlistUri;
                        },
                        template: '<playlist-container uri="{{ playlistUri }}"></playlist-container>'
                    }
                }
            })
        .state('app.settings', {
            url: '/settings',
            template: '<settings></settings>'
        })
        .state('reconnect', {
            url: '/reconnect',
            template: '<h1>Mopidy connection error</h1><a ui-sref="app.playlists">reconnect</a>'
        });

    function checkToken() {
        console.log('hash', location.hash);
        var hash = {};
        location.hash.replace(/^#\/?/, '').split('&').forEach(function(kv) {
            var spl = kv.indexOf('=');
            if (spl != -1) {
                hash[kv.substring(0, spl)] = decodeURIComponent(kv.substring(spl + 1));
            }
        });
        
        console.log('initial hash', hash);
        if (hash.access_token) {
            localStorage.setItem('spotify-token', hash.access_token);
            SpotifyProvider.setAuthToken(hash.access_token);
        }
    }
}



function AppController($scope, mopidy, me) {
    $scope.mopidy = mopidy;
    $scope.me = me;
}

function getMopidy(Mopidy) {
    return Mopidy.connect();
}

function getMe($q, $window, $stateParams, Spotify) {
    return Spotify.getCurrentUser()
        .catch(function() {
            return Spotify.login()
        })
        .then(function() {
            return Spotify.getCurrentUser()
        })
}

module.exports = States;
