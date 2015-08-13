'use strict';

var Mopidy = require('mopidy');
var _ = require('lodash');

function ConnectMopidy($window, $q, $rootScope) {
    var mopidy;
    return {
        execute: function(method, args) {
            
            return $q(function(resolve, reject) {
                console.log(method, args);
                if(!args) {
                    return _.get(mopidy, method)()
                        .then(resolve);
                }
                    return _.get(mopidy, method)(args)
                        .then(resolve);
            });
            function resolve() {
                var args = arguments;
                resolve(args), reject(args)
            }
        },
        connect: function() {

            return $q(function(resolve, reject) {
                mopidy = new Mopidy({
                    callingConvention: 'by-position-or-by-name',
                    webSocketUrl: 'ws://192.168.1.103:6680/mopidy/ws/'
                });

                // Convert Mopidy events to Angular events
                mopidy.on(function(ev, args) {
                    $rootScope.$broadcast('mopidy:' + ev, args);
                });

                // mopidy.on(console.log.bind(console));  // Log all events

                mopidy.on('state:online', function() {
                    mopidy.off('websocket:error');
                    resolve(mopidy);
                });

                mopidy.on('websocket:error', function() {
                    mopidy.close();
                    mopidy.off();
                    reject('websocket error');
                });

            });
        }
    }
}

module.exports = ConnectMopidy;
