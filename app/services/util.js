'use strict';

function Util($window) {
    return {
        timeFromMilliSeconds: function(length) {
            if (length === undefined) {
                return '';
            }
            var d = Number(length / 1000);
            var h = Math.floor(d / 3600);
            var m = Math.floor(d % 3600 / 60);
            var s = Math.floor(d % 3600 % 60);

            return ((h > 0 ? h + ":" : "") + (m > 0 ? (h > 0 && m < 10 ? "0" : "") + m + ":" : "0:") + (s < 10 ? "0" : "") + s);

        }
    }
}

module.exports = Util;