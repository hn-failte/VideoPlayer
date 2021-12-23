// @ts-nocheck
import { setup } from './auto-advance';

const clearTracks = (player) => {
  const tracks = player.remoteTextTracks();
  let i = (tracks && tracks.length) || 0;

  while (i--) {
    player.removeRemoteTextTrack(tracks[i]);
  }
};

const playItem = (player, item) => {
  const replay = !player.paused() || player.ended();

  player.trigger('beforeplaylistitem', item.originalValue || item);

  if (item.playlistItemId_) {
    player.playlist.currentPlaylistItemId_ = item.playlistItemId_;
  }

  player.poster(item.poster || '');
  player.src(item.sources);
  clearTracks(player);

  player.ready(() => {
    (item.textTracks || []).forEach(player.addRemoteTextTrack.bind(player));
    player.trigger('playlistitem', item.originalValue || item);

    if (replay) {
      const playPromise = player.play();

      if (typeof playPromise !== 'undefined' && typeof playPromise.then === 'function') {
        playPromise.then(null, (_) => {});
      }
    }

    setup(player, player.playlist.autoadvance_.delay);
  });

  return player;
};

export default playItem;
export { clearTracks };
