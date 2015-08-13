'use strict';

function Container() {
    return {
        restrict: 'E',
        template: 'mopidy: {{ !!mopidy }} me {{!!me}} <playlists></playlists><player mopidy="mopidy" me="me"></player>',
        controller: function($scope, ConnectMopidy, Spotify, $window, $timeout, $q) {
            $scope.loading = true
            $scope.mopidy
            $scope.me
        }
    }
}

module.exports = Container;
