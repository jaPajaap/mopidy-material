'use strict';

var template = require('./settings.html')

function Settings() {
    return {
        restrict: 'E',
        templateUrl: template,
        controller: function($scope, AppSettings) {
            $scope.settings = AppSettings;
        }
    }
}

module.exports = Settings;