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

            function clearResults() {
                debugger;
                $scope.results = undefined;
            }

            function search(term) {
                Mopidy.execute('library.search', {
                    any: [term]
                })
                .then(function(res) {
                    $scope.results = res[0];
                })
            }
        }
    }
}

module.exports = PlaylistsContainer;