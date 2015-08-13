'use strict';

function States($stateProvider) {
    $stateProvider
        .state('app', {
            url: '/',
            title: 'Mopidy',
            template: '<playlists></playlists><player me="me"></player>',
            controller: AppController,
            resolve: {
                mopidy: getMopidy,
                me: getMe
            }
        })
        .state('reconnect', {
            url: '/reconnect',
            title: 'Reconnect',
            template: '<h1>Mopidy connection error</h1><a ui-sref="app">reconnect</a>'
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
        .catch(loginAndlistenForToken)
        .then(function() {
            return Spotify.getCurrentUser();
        })
    function loginAndlistenForToken() {
        return $q(function(resolve, reject) {
            $window.addEventListener("message", function(event) {
                console.log('got postmessage', event);
                var hash = JSON.parse(event.data);
                if (hash.type == 'access_token') {
                    Spotify.setAuthToken(hash.access_token);
                    localStorage.setItem('spotify-token', hash.access_token);
                    resolve(Spotify);
                }
                reject();
            }, false);
            Spotify.login();
        });
    }
}

module.exports = States;
