'use strict';

var template = require('./container.html')

function PlaylistContainer($state, Mopidy) {
    return {
        restrict: 'E',
        templateUrl: template,
        scope: {
            uri: '@'
        },
        controller: function($scope) {
            $scope.tracks = [];
            $scope.playAll = playAll;
            $scope.play = play;
            
            function playAll (uri) {    
                return Mopidy.execute('tracklist.clear')
                .then(Mopidy.execute('tracklist.add', {uri: $scope.uri}))
                .then(Mopidy.execute('tracklist.shuffle'))
                .then(Mopidy.execute('playback.play'));
            }

            $scope.$watch('uri', getPlaylist);

            function getPlaylist(uri) {
                if(!uri) {
                    return;
                }
                return Mopidy.execute('library.lookup', {uri: uri})
                    .then(function(res) {
                        $scope.tracks = res;
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

module.exports = PlaylistContainer;