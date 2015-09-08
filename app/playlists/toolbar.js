'use strict';

var template = require('./toolbar.html')

function PlaylistsToolbar($state, Mopidy) {
    return {
        restrict: 'E',
        templateUrl: template,
        scope: {
            onSearch: '&',
            onClearSearch: '&',
            isLoading: '='
        },
        link: function($scope) {
            $scope.vm = {};
            $scope.vm.clear = function clear() {
                $scope.vm.term = '';
                $scope.onClearSearch({state: true});
            }

            $scope.$watch('vm.term', _.debounce(function(term) {
                // This code will be invoked after 200ms from last search
                $scope.$apply(function() {
                    if(term && term.length > 1) {
                        $scope.onSearch({term: term});
                    }
                });
            }, 200))
        }
    }
}

module.exports = PlaylistsToolbar;