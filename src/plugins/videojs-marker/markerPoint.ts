// @ts-nocheck
import videojs from 'video.js';

const Component = videojs.getComponent('Component');
const TimeTooltip = videojs.getComponent('TimeTooltip');

class MarkerPointTip extends Component {
  constructor(player, options) {
    super(player, options);

    this.options = options;

    this.timeToltip = new TimeTooltip(player);
    this.timeToltip.hide();

    this.addChild(this.timeToltip);
    this.addClass('vjs-marker-point-tip');

    this.timeToltip.el_.innerHTML = `
      <p class="vjs-marker-point-tip-time">${videojs.formatTime(this.options.offset, 600)}</p>
      ${
        this.options.data
          ? '<p class="vjs-marker-point-tip-content">' + this.options.data.content + '</p>'
          : ''
      }
    `;
  }

  updatePosition() {
    this.timeToltip.el_.style.left = `-${this.timeToltip.el_.getBoundingClientRect().width / 2}px`;
  }
}

class MarkerPoint extends Component {
  constructor(player, options) {
    super(player, options);

    this.offset = options.offset;
    this.type = options.type;
    this.data = options.data;

    this.tip = new MarkerPointTip(player, {
      data: this.data,
      offset: this.offset,
    });
    this.mouseDisplay = player.getDescendant([
      'ControlBar',
      'ProgressControl',
      'SeekBar',
      'MouseTimeDisplay',
    ]);

    this.addChild(this.tip);
    this.enableTouchActivity();
    this.on('mouseenter', (_) => {
      this.mouseDisplay.hide();
      this.tip.timeToltip.show();
      this.tip.updatePosition();
    });
    this.on('mouseleave', (_) => {
      this.mouseDisplay.show();
      this.tip.timeToltip.hide();
    });
  }

  createEl() {
    return videojs.dom.createEl('div', {
      className: 'vjs-marker-point',
    });
  }

  updatePosition(duration) {
    this.el_.style.left = (this.offset / duration) * 100 + '%';
  }
}

export { MarkerPoint, MarkerPointTip };
