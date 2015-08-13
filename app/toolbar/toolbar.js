'use strict';

var template = require('./toolbar.html')

function Toolbar() {
    return {
        restrict: 'E',
        templateUrl: template,
        controller: function($scope, $rootScope) {
            $scope.stateTitle = $rootScope.pageTitle;

        }
    }
}

module.exports = Toolbar;