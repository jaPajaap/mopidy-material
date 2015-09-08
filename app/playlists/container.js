'use strict';

var template = require('./container.html')

function PlaylistsContainer($state, Mopidy) {
    return {
        restrict: 'E',
        templateUrl: template,
        controller: function($scope) {
            $scope.search = search;
            $scope.results;
            $scope.clearResults = clearResults;
            $scope.playlists = []
            $scope.isLoading = false

            getPlaylists();

            function getPlaylists() {
                $scope.isLoading = true;
                return Mopidy.execute('playlists.getPlaylists')
                    .then(function setPlaylists(playlists) {
                        $scope.isLoading = false;
                        $scope.playlists = playlists;
                    });
            }

            function clearResults() {
                $scope.results = undefined;
            }

            function search(term) {
                $scope.isLoadingSearch = true;
                Mopidy.execute('library.search', {
                    any: [term]
                })
                    .then(function(res) {
                        var idx = _.findIndex(res, { uri: 'spotify:search:' + encodeURI(term) });
                        $scope.isLoadingSearch = false;
                        $scope.results = res[idx];
                    })
            }
        }
    }
}

module.exports = PlaylistsContainer;