'use strict'

var template = require('./toolbar.html')

function PlaylistToolbar($state, Mopidy) {
    return {
        restrict: 'E',
        templateUrl: template,
        scope: {
            onPlayAll: '&'
        },
        controller: function($scope, $state) {
            $scope.back = back;

            function back() {
                return $state.go('^')
            }
        }
    }
}

module.exports = PlaylistToolbar