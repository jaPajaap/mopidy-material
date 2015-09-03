'use strict';

var template = require('./toolbar.html')

function Toolbar() {
    return {
        restrict: 'E',
        templateUrl: template,
        transclude: true
    }
}

module.exports = Toolbar;