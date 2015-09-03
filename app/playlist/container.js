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
            $scope.playAll = playAll;
            
            function playAll (uri) {    
                return Mopidy.execute('tracklist.clear')
                .then(Mopidy.execute('tracklist.add', {uri: $scope.uri}))
                .then(Mopidy.execute('tracklist.shuffle'))
                .then(Mopidy.execute('playback.play'));
            }
        }
    }
}

module.exports = PlaylistContainer;