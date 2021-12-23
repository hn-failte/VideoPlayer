import type { VideoJsPlayer } from 'video.js';
import videojs from 'video.js';
import './plugin.less';
import { MarkerBar } from './markerBar';
import { MarkerPanel } from './markerPanel';

const Plugin = videojs.getPlugin('plugin');

const defaults = {};

export type MarkerOptions = {
  markers: { offset: number; type: string };
  panel: boolean;
};

export class MarkerPlugin extends Plugin {
  defaultState;
  options;
  markerBar;
  markerPanel;
  constructor(player, options) {
    super(player);

    this.defaultState = {};

    this.options = videojs.mergeOptions(defaults, options);

    this.player.addClass('vjs-marker-plugin');

    this.updateOptions();
  }

  createMarkerBar() {
    this.markerBar = MarkerBar.build(this.player, {
      markers: this.options.markers,
    });
    return this.markerBar;
  }

  createMarkersPanel() {
    this.markerPanel = MarkerPanel.build(this.player, {
      markers: this.options.markers,
    });
    return this.markerPanel;
  }

  updateOptions(options = {}) {
    this.options = videojs.mergeOptions(this.options, options);

    if (this.markerBar) this.markerBar.dispose();
    if (this.markerPanel) this.markerPanel.dispose();

    if (!(this.options.panel === false)) {
      this.player.addChild(this.createMarkersPanel());
    }

    const container = (this.player as VideoJsPlayer & { getDescendant: Function }).getDescendant([
      'ControlBar',
      'ProgressControl',
      'SeekBar',
    ]);
    this.createMarkerBar();

    container.addChild(this.markerBar);
  }
}

videojs.registerPlugin('markerPlugin', MarkerPlugin);

export default MarkerPlugin;
