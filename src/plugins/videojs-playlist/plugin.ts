// @ts-nocheck

import videojs from 'video.js';
import playlistMaker from './playlist-maker';

const Button = videojs.getComponent('Button');
const registerPlugin = videojs.registerPlugin || videojs.plugin;

const onPlayerReady = (player) => {
  player.controlBar.nextButton = player.controlBar.addChild(
    'playlistButton',
    {
      function: 'next',
    },
    1
  );
  player.controlBar.lastButton = player.controlBar.addChild(
    'playlistButton',
    {
      function: 'last',
    },
    1
  );
};

class playlistButton extends Button {
  constructor(player, options) {
    super(player, options);
    if (this.options_.function === 'next') {
      this.controlText(this.localize('turn-next'));
    } else if (this.options_.function === 'last') {
      this.controlText(this.localize('turn-last'));
    }
  }

  buildCSSClass() {
    return `vjs-playlist-button turn-${this.options_.function} ${super.buildCSSClass()}`;
  }

  handleClick() {
    const currentIndex = this.player_.playlist.currentIndex();
    if (this.options_.function === 'next') {
      const nextIndex = this.player_.playlist.nextIndex();
      if (nextIndex > currentIndex) this.player_.playlist.next();
      else {
        this.player_.alert('已经是最后一个了');
      }
    } else if (this.options_.function === 'last') {
      const previousIndex = this.player_.playlist.previousIndex();
      if (previousIndex < currentIndex) this.player_.playlist.previous();
      else {
        this.player_.alert('已经是第一个了');
      }
    }
  }
}

videojs.registerComponent('playlistButton', playlistButton);

export type PlayItem =
  | {
      src: string;
      type: string;
    }
  | string;

export type PlaylistPlugin = { autoadvance: Function } & ((
  list: PlayItem[],
  item?: PlayItem
) => void);

const plugin: PlaylistPlugin = function (list, item) {
  this.ready(() => {
    onPlayerReady(this);
  });
  playlistMaker(this, list, item);
};

registerPlugin('playlist', plugin);

export default plugin;
