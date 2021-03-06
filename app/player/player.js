'use strict';

var template = require('./player.html');

function Player($rootScope, $interval, Util, Spotify, AppSettings, Mopidy, hotkeys) {
    return {
        restrict: 'E',
        templateUrl: template,
        scope: {
            me: '='
        },
        controller: function($scope) {
            var checkPositionTimer;
            $scope.vm = {};

            $scope.state;
            $scope.track;
            $scope.vm.volume;
            $scope.mute;
            $scope.isShownVolume = false;
            $scope.pausePlay = pausePlay;
            $scope.next = next;
            $scope.previous = previous;
            $scope.star = star;
            $scope.trackDesc = trackDesc;
            $scope.Spotify = Spotify;
            $scope.favoritedTracks = []
            $scope.isFavorited = isFavorited;
            $scope.vm.changeVolume = changeVolume;
            $scope.toggleMute = toggleMute;
            $scope.showVolume = showVolume;

            $scope.trackLength;

            $scope.seek = seek;

            $rootScope.$on('mopidy:event:playbackStateChanged', handlePlaybackStateChange)
            $rootScope.$on('mopidy:event:trackPlaybackStarted', handleTrackPlaybackStarted)
            $rootScope.$on('mopidy:event:trackPlaybackResumed', handleTrackPlaybackResumed)
            $rootScope.$on('mopidy:event:trackPlaybackPaused', handleTrackPlaybackPaused)
            $rootScope.$on('mopidy:event:trackPlaybackEnded', handleTrackPlaybackEnded)
            $rootScope.$on('mopidy:event:trackPlaybackEnded', handleTrackPlaybackEnded)
            
            $rootScope.$on('mopidy:event:volumeChanged', handleVolumeChanged)
            $rootScope.$on('mopidy:event:muteChanged', handleMuteChanged)

            hotkeys.add({
                combo: 'space',
                description: 'Pause / Play',
                callback: function() {
                  $scope.pausePlay();
                }
              });

            init()

            function init() {
                getFavorites();
                getVolume()
                    .then(setVolume);
                return getState()
                    .then(setState)
                    .then(getCurrentTrack)
            }

            function getVolume() {
                return Mopidy.execute('mixer.getVolume')
            }

            function setVolume(volume) {
                $scope.vm.volume = volume;
            }

            function changeVolume() {
                Mopidy.execute('playback.setVolume', {
                    volume: $scope.vm.volume
                })
            }

            function showVolume() {
                $scope.isShownVolume = !$scope.isShownVolume
            }

            function setMute(mute) {
                $scope.mute = mute;
            }

            function toggleMute() {
                return Mopidy.execute('playback.setMute', {
                    mute: !$scope.mute
                })
            }

            function getState() {
                return Mopidy.execute('playback.getState')
            }

            function handleTrackPlaybackResumed (e, args) {
                console.log('handleTrackPlaybackResumed');
            }

            function handleTrackPlaybackStarted (e, args) {
                console.log('handleTrackPlaybackResumed');
                setTrack(args.tl_track.track);
            }

            function handleTrackPlaybackPaused (e, args) {
                console.log('handleTrackPlaybackPaused');
            }


            function handleTrackPlaybackEnded (e, args) {
                console.log('handleTrackPlaybackEnded');
                setTrack(args.tl_track.track);
                resetTimePosition();
            }

            function handlePlaybackStateChange(e, args) {
                console.log('handlePlaybackStateChange');
                setState(args.new_state);
            }

            function handleVolumeChanged(e, args) {
                console.log('handleVolumeChanged', args);
                return $scope.$apply(function() {
                    return setVolume(args.volume);
                });
            }

            function handleMuteChanged(e, args) {
                return $scope.$apply(function() {
                    $scope.mute = args.mute;
                });
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
                checkPositionTimer = $interval(getTimePosition, 1000);
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

            function storeTimePosition(timePosition) {
                if ($scope.track.length > 0 && timePosition > 0) {
                    $scope.currentTimePosition = (timePosition / $scope.track.length) * 100;
                    $scope.currentTrackPosition = Util.timeFromMilliSeconds(timePosition);
                } else {
                    resetTimePosition()
                }
            }

            function seek() {
                // TODO throttle or catch changeEnd event
                stopCheckingTimePosition();
                var timePosition = $scope.currentTimePosition / 100 * $scope.track.length
                return Mopidy.execute('playback.seek', {time_position: timePosition})
                    .then(startCheckingTimePosition);
                
            }

            function getTimePosition() {
                if ($scope.state === 'playing') {
                    Mopidy.execute('playback.getTimePosition')
                        .then(storeTimePosition);
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