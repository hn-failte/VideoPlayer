const validSeconds = (s) => typeof s === 'number' && !isNaN(s) && s >= 0 && s < Infinity;

let reset = (player) => {
  const aa = player.playlist.autoadvance_;

  if (aa.timeout) {
    player.clearTimeout(aa.timeout);
  }

  if (aa.trigger) {
    player.off('ended', aa.trigger);
  }

  aa.timeout = null;
  aa.trigger = null;
};

const setup = (player, delay) => {
  reset(player);

  if (!validSeconds(delay)) {
    player.playlist.autoadvance_.delay = null;
    return;
  }

  player.playlist.autoadvance_.delay = delay;

  player.playlist.autoadvance_.trigger = function () {
    const cancelOnPlay = () => setup(player, delay);

    player.one('play', cancelOnPlay);

    player.playlist.autoadvance_.timeout = player.setTimeout(() => {
      reset(player);
      player.off('play', cancelOnPlay);
      player.playlist.next();
    }, delay * 1000);
  };

  player.one('ended', player.playlist.autoadvance_.trigger);
};

const setReset_ = (fn) => {
  reset = fn;
};

export { setReset_, reset, setup };
