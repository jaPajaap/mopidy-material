'use strict'

var template = require('./playlist.html')

function Playlist($state, Mopidy) {
    return {
        restrict: 'E',
        templateUrl: template,
        scope: {
            uri: '@'
        },
        controller: function($scope) {
            $scope.playlist = 'jaap'
            $scope.items = [];
            $scope.play = play;

            $scope.$watch('uri', getPlaylist);

            function getPlaylist(uri) {
                if(!uri) {
                    return;
                }
                return Mopidy.execute('library.lookup', {uri: uri})
                    .then(function(items) {
                        $scope.items = items;
                    })
            }

            function play(uri) {    
                return Mopidy.execute('tracklist.clear')
                    .then(Mopidy.execute('tracklist.add', {uri: uri}))
                    .then(Mopidy.execute('playback.play'));
            }

        }
    }
}

module.exports = Playlist