'use strict';

var template = require('./toolbar.html')

function PlaylistsToolbar($state, Mopidy) {
    return {
        restrict: 'E',
        templateUrl: template,
        scope: {
            onSearch: '&',
            onClearSearch: '&'
        },
        link: function($scope) {
            $scope.vm = {};
            $scope.vm.clear = function clear() {
                $scope.vm.term = '';
                $scope.onClearSearch({state: true});
            }

            $scope.$watch('vm.term', function(term) {
                if(term && term.length > 2) {
                    $scope.onSearch({term: term});
                }
            })
        }
    }
}

module.exports = PlaylistsToolbar;