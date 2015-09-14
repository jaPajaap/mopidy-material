'use strict';

var template = require('./tracklist.html')
        
function Tracklist($state, Mopidy) {
    return {
        restrict: 'E',
        templateUrl: template,
        scope: {
            tracks: '=',
            onPlay: '&'
        },
        link: function($scope, $el) {
            console.log('hoi');
        }

    }
}

module.exports = Tracklist
