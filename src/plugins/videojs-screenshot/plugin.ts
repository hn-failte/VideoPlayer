// @ts-nocheck
import videojs from 'video.js';
import './plugin.less';

const Button = videojs.getComponent('Button');
const registerPlugin = videojs.registerPlugin || videojs.plugin;

const onPlayerReady = (player) => {
  player.controlBar.scrrenshotButton = player.controlBar.addChild(
    'screenshotButton',
    {
      function: 'screenshot',
    },
    12
  );
};

export type VideojsScreenshotPlugin = () => void;

const plugin: VideojsScreenshotPlugin = function () {
  this.ready(() => {
    onPlayerReady(this);
  });
};

class ScreenshotButton extends Button {
  constructor(player, options) {
    super(player, options);
    if (this.options_.function === 'screenshot') {
      this.controlText(this.localize('screenshot'));
    }
  }

  buildCSSClass() {
    return `vjs-screenshot ${super.buildCSSClass()}`;
  }

  screenshot({ mimeType, quality } = { mimeType: 'image/png', quality: 1 }) {
    if (this.player_.readyState() !== 4) {
      this.player_.alert('播放还未就绪！');
      return;
    }
    const instanceDom = this.player_.el_.firstElementChild;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = instanceDom.videoWidth;
    canvas.height = instanceDom.videoHeight;
    ctx.drawImage(instanceDom, 0, 0, canvas.width, canvas.height);
    const a = document.createElement('a');
    a.href = canvas.toDataURL(mimeType, quality);
    a.download = `screenshot-${Date.now()}`;
    a.click();
    a.remove();
    canvas.remove();
  }

  handleClick() {
    if (this.options_.function === 'screenshot') {
      this.screenshot();
    }
  }
}

videojs.registerComponent('screenshotButton', ScreenshotButton);

registerPlugin('screenshotPlugin', plugin);

export default plugin;
