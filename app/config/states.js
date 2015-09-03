'use strict';

function States($urlRouterProvider, $stateProvider) {

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
}

function AppController($scope, mopidy, me) {
    $scope.mopidy = mopidy;
    $scope.me = me;
}

function getMopidy(Mopidy) {
    return Mopidy.connect();
}

function getMe($q, $window, Spotify) {
    return Spotify.getCurrentUser()
        .catch(function() {
            return Spotify.login()
        })
        .then(function() {
            return Spotify.getCurrentUser()
        })
}
    // function loginAndlistenForToken() {
    //     return $q(function(resolve, reject) {
    //         $window.addEventListener("message", function(event) {
    //             console.log('got postmessage', event);
    //             var hash = JSON.parse(event.data);
    //             if (hash.type == 'access_token') {
    //                 Spotify.setAuthToken(hash.access_token);
    //                 localStorage.setItem('spotify-token', hash.access_token);
    //                 resolve(Spotify);
    //             }
    //             reject();
    //         }, false);
    //         Spotify.login();
    //     });
    // }

module.exports = States;
