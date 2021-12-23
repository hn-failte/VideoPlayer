// @ts-nocheck
import videojs from 'video.js';
import { MarkerPoint } from './markerPoint';

const Component = videojs.getComponent('Component');

class MarkerBar extends Component {
  static build(player, options) {
    if (!(options.markers instanceof Array)) {
      options.markers = [];
    }

    const markers = [];

    for (let i = options.markers.length; i--; ) {
      markers.push(new MarkerPoint(player, options.markers[i]));
    }

    return new MarkerBar(player, { markers, barName: 'markerPoint' });
  }

  constructor(player, options) {
    super(player, options);

    options.markers.forEach((marker) => this.addChild(marker));

    const updateMarkersPosition = () => {
      const duration = player.duration();

      options.markers.forEach((marker) => {
        if (!marker.isDisposed()) {
          marker.updatePosition(duration);
        }
      });
    };

    if (player.readyState() > 0) {
      updateMarkersPosition();
    }

    player.one('loadedmetadata', updateMarkersPosition);
  }

  createEl() {
    return videojs.dom.createEl('div', {
      className: 'vjs-marker-bar',
    });
  }
}

videojs.registerComponent('MarkerBar', MarkerBar);

export { MarkerBar };
