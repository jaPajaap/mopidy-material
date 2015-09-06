'use strict';

/**
 * @ngInject
 */
function OnRun($rootScope, $document, $window, $state, AppSettings) {

    // change page title based on state
    $rootScope.$on('$stateChangeSuccess', function(e, toState) {
        $rootScope.pageTitle = '';

        if (toState.title) {
            $rootScope.pageTitle += toState.title;
            $rootScope.pageTitle += ' \u2014 ';
        }

        $rootScope.pageTitle += AppSettings.appTitle;
    });

    $rootScope.$on('$stateChangeError', function(e, toState) {
        console.log(e)
        $state.go('reconnect');
    });


    $document.on('touchmove', function(e) {
        e.preventDefault();
    });






}

module.exports = OnRun;
