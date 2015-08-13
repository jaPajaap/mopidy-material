'use strict';

var template = require('./player.html');

function Player($rootScope, $interval, Util, Spotify, AppSettings, Mopidy) {
    return {
        restrict: 'E',
        templateUrl: template,
        scope: {
            me: '='
        },
        controller: function($scope) {
            var checkPositionTimer;
            $scope.state;
            $scope.track;
            $scope.pausePlay = pausePlay;
            $scope.next = next;
            $scope.previous = previous;
            $scope.star = star;
            $scope.trackDesc = trackDesc;
            $scope.Spotify = Spotify;
            $scope.favoritedTracks = []
            $scope.isFavorited = isFavorited;

            $scope.trackLength;

            $rootScope.$on('mopidy:event:playbackStateChanged', handlePlaybackStateChange)
            $rootScope.$on('mopidy:event:trackPlaybackStarted', handleTrackPlaybackStarted)
            $rootScope.$on('mopidy:event:trackPlaybackResumed', handleTrackPlaybackResumed)
            $rootScope.$on('mopidy:event:trackPlaybackPaused', handleTrackPlaybackPaused)
            $rootScope.$on('mopidy:event:trackPlaybackEnded', handleTrackPlaybackEnded)

            init()

            function init() {
                getFavorites();
                return getState()
                    .then(setState)
                    .then(getCurrentTrack)
            }

            function getState() {
                return Mopidy.execute('playback.getState')
            }

            function handleTrackPlaybackResumed (e, args) {
                console.log('handleTrackPlaybackResumed');
                // setTrack(e.tl_track.track);
                // setTimePosition(e.time_position);
            }

            function handleTrackPlaybackStarted (e, args) {
                console.log('handleTrackPlaybackResumed');
                setTrack(args.tl_track.track);
                // setTimePosition(args.time_position);
            }

            function handleTrackPlaybackPaused (e, args) {
                console.log('handleTrackPlaybackPaused');
                // setTrack(args.tl_track.track);
                // setTimePosition(args.time_position);
            }


            function handleTrackPlaybackEnded (e, args) {
                console.log('handleTrackPlaybackEnded');
                setTrack(args.tl_track.track);
                resetTimePosition();
            }

            function handlePlaybackStateChange(e, args) {
                setState(args.new_state);
            }

            function setState(state) {
                $scope.state = state;
                var states = {
                    playing: function() {
                        startCheckingTimePosition();
                        return $scope.state;
                        
                    },
                    paused: function() {
                        stopCheckingTimePosition();
                        return $scope.state;
                    },
                    stopped: function() {
                        stopCheckingTimePosition();
                        resetTimePosition();
                        return $scope.state;
                    }
                }
                return states[state]();
            }

            function startCheckingTimePosition() {
                checkPositionTimer = $interval(checkTimePosition, 1000);
            }

            function stopCheckingTimePosition() {
                if (angular.isDefined(checkPositionTimer)) {
                    $interval.cancel(checkPositionTimer);
                    checkPositionTimer = undefined;
                }
            }

            function resetTimePosition() {
                $scope.currentTimePosition = 0;
                $scope.currentTrackPosition = Util.timeFromMilliSeconds(0);
            }

            function setTimePosition(timePosition) {
                if ($scope.track.length > 0 && timePosition > 0) {
                    $scope.currentTimePosition = (timePosition / $scope.track.length) * 100;
                    $scope.currentTrackPosition = Util.timeFromMilliSeconds(timePosition);
                } else {
                    resetTimePosition()
                }
            }

            function checkTimePosition() {
                if ($scope.state === 'playing') {
                    Mopidy.execute('playback.getTimePosition')
                        .then(setTimePosition);
                }
                return;
            }


            
            function play() {
                return Mopidy.execute('playback.play')
            }

            function next() {
                return Mopidy.execute('playback.next')
            };

            function previous() {
                return Mopidy.execute('playback.previous')
            }

            function pausePlay() {
                if ($scope.state === 'playing') {
                    return Mopidy.execute('playback.pause')
                }
                return Mopidy.execute('playback.play')
            }

            function star() {
                return Spotify.addPlaylistTracks($scope.me.id, AppSettings.starredPlaylistId, $scope.track.uri)
                    .then(function() {
                        $scope.favoritedTracks.push($scope.track.uri);
                    }) 
            }

            function setTrack(track) {
                if (!track) {
                    return $scope.track = {};
                }
                $scope.track = track;
                $scope.trackLength = Util.timeFromMilliSeconds(track.length);
                return track;
            }

            function getCurrentTrack() {
                return Mopidy.execute('playback.getCurrentTrack')
                    .then(setTrack);
            }

            function trackDesc(track) {
                if (!track) {
                    return;
                }
                return track.name + " by " + track.artists[0].name +
                    " from " + track.album.name;
            }

            function isFavorited() {
                if(angular.isUndefined($scope.track)) {
                    return false;
                }
                return $scope.favoritedTracks.indexOf($scope.track.uri) !== -1;
            }

            function getFavorites() {
                Spotify.getPlaylistTracks($scope.me.id, AppSettings.starredPlaylistId)
                    .then(function(res) {
                        $scope.favoritedTracks = _.map(res.items, function(item) {
                            return item.track.uri;
                        });
                    })
            };
        }
    }
}

module.exports = Player;