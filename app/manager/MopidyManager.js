angular.module('Falcon')
    .factory('MopidyManager', function(Mopidy) {
        var manager = {
            playlists: [],
            tracks: [],
            getPlaylists: getPlaylists
        };

        function getPlaylists() {
            return Mopidy.execute('playlists.getPlaylists')
        };
        return manager;
    })

