'use strict';

var template = require('./searchResults.html')

function searchResults($state, Mopidy) {
    return {
        restrict: 'E',
        templateUrl: template,
        scope: {
            results: '='
        },
        controller: function($scope) {
            $scope.searchTypes = ['artists', 'albums', 'tracks'];
            $scope.noresults = function() {
                return !$scope.results[$scope.searchTypes[0]] && !$scope.results[$scope.searchTypes[1]] && !$scope.results[$scope.searchTypes[2]]
            }
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

module.exports = searchResults;