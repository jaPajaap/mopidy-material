'use strict';

var template = require('./playlists.html')

function Playlists($state, Mopidy) {
    return {
        restrict: 'E',
        templateUrl: template,
        scope: {
            playlists: '='
        },
        controller: function($scope) {
            $scope.addAndPlay = addAndPlay;
            $scope.showPlaylist = showPlaylist;

            function addAndPlay (uri) {    
                return Mopidy.execute('tracklist.clear')
                .then(Mopidy.execute('tracklist.add', {uri: uri}))
                .then(Mopidy.execute('tracklist.shuffle'))
                .then(Mopidy.execute('playback.play'))
            }

            function showPlaylist (uri) {
                return $state.go('.show', {playlistUri: uri});
            }

        }
    }
}

module.exports = Playlists;