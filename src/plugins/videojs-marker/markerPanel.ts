// @ts-nocheck
import videojs from 'video.js';

const Component = videojs.getComponent('Component');

class MarkerPanel extends Component {
  static build(player, options) {
    if (!(options.markers instanceof Array)) {
      options.markers = [];
    }

    return new MarkerPanel(player, { markers: options.markers });
  }

  constructor(player, options) {
    super(player, options);

    const markerItemList = [];
    const len = options.markers.length;

    for (let i = 0; i < len; i++) {
      const markerOption = options.markers[i];

      markerItemList.push(this.createMarkerItem(markerOption.offset, markerOption.data));
    }

    this.markerList = videojs.dom.createEl(
      'div',
      { className: 'vjs-markers-panel-list' },
      {},
      markerItemList
    );

    this.el_.appendChild(
      videojs.dom.createEl('div', { className: 'vjs-markers-panel-title' }, {}, '打点记录')
    );
    this.el_.appendChild(
      videojs.dom.createEl(
        'div',
        { className: 'vjs-markers-panel-subtitle' },
        {},
        '点击快速跳转至视频打点处'
      )
    );
    this.el_.appendChild(this.markerList);
  }

  createEl() {
    return videojs.dom.createEl('div', {
      className: 'vjs-markers-panel',
    });
  }

  createMarkerItem(offset, data) {
    const timeDOM = videojs.dom.createEl(
      'div',
      { className: 'vjs-markers-panel-item-time' },
      { 'data-offset': offset },
      videojs.formatTime(offset, 600)
    );
    const contentDOM = videojs.dom.createEl(
      'div',
      { className: 'vjs-markers-panel-item-content' },
      { 'data-offset': offset },
      (data && data.content) || ''
    );
    const itemDOM = videojs.dom.createEl(
      'div',
      { className: 'vjs-markers-panel-list-item' },
      { 'data-offset': offset },
      [timeDOM, contentDOM]
    );

    itemDOM.addEventListener(
      'click',
      (ev) => {
        const dom = ev.target;

        this.player_.currentTime(dom.dataset.offset);
      },
      false
    );

    return itemDOM;
  }
}

export { MarkerPanel };
