angular.module('Falcon')
    .factory('UserManager', function(Mopidy) {
        var manager = {
            playlists: [],
            getPlaylists: getPlaylists
        };

        function getPlaylists() {
            return Mopidy.execute('playlists.getPlaylists')
                .then(function(playlists) {
                    manager.playlists = playlists;
                });
        }
        return manager;
    })

