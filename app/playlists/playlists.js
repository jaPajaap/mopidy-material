'use strict';

var template = require('./playlists.html')

function Playlists(Mopidy) {
    return {
        restrict: 'E',
        templateUrl: template,
        controller: function($scope) {
            $scope.playlists = [];
            $scope.addAndPlay = addAndPlay;
            
            getPlaylists();

            function getPlaylists() {
                return Mopidy.execute('playlists.getPlaylists')
                .then(function setPlaylists(playlists) {
                    $scope.playlists = playlists;
                });
            }
            
            
            function addAndPlay (uri) {    
                return Mopidy.execute('tracklist.clear')
                .then(Mopidy.execute('tracklist.add', {uri: uri}))
                .then(Mopidy.execute('tracklist.shuffle'))
                .then(Mopidy.execute('playback.play'));
            }

        }
    }
}

module.exports = Playlists;