'use strict'

function Scrollable($state, Mopidy) {
    return {
        restrict: 'A',
        link: function($scope, $el) {
            var el = $el[0];
            $el.on('touchstart', function() {

                var top = el.scrollTop,
                    totalScroll = el.scrollHeight,
                    currentScroll = top + el.offsetHeight;

                if (top === 0) {
                    el.scrollTop = 1;
                } else if (currentScroll === totalScroll) {
                    el.scrollTop = top - 1;
                }

            });
            $el.on('touchmove', function(e) {
               e.stopPropagation();
            });
        }

    }
}

module.exports = Scrollable
