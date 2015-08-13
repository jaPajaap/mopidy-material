'use strict';

require('angular');
// angular modules
require('angular-ui-router');
require('angular-spotify');
require('angular-aria');
require('angular-animate');
require('angular-material');

require("./app.scss");

// create and bootstrap application

var requires = [
    'spotify',
    'ui.router',
    'ngMaterial'
];

// mount on window for testing
angular.module('app', requires);

angular.module('app').constant('AppSettings', require('./config/constants'));

angular.module('app').config(require('./config/config'));
angular.module('app').config(require('./config/states'));

angular.module('app').run(require('./config/run'));

angular.module('app').service('Mopidy', require('./services/mopidy.js'));
angular.module('app').service('Util', require('./services/util.js'));

angular.module('app').directive('container', require('./container/container'));
angular.module('app').directive('player', require('./player/player'));
angular.module('app').directive('playlists', require('./playlists/playlists'));
angular.module('app').directive('settings', require('./settings/settings'));
angular.module('app').directive('toolbar', require('./toolbar/toolbar'));


angular.bootstrap(document.body, ['app']);
