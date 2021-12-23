import type { VideoJsPlayer, VideoJsPlayerOptions } from 'video.js';
import type { CustomMenu } from '../plugins/videojs-custom-menu/plugin';

export type PlayerEvents = {
  onReady?: Function;
  onPlayStart?: Function;
  onPlayPause?: Function;
  onPlayEnd?: Function;
};

export type Hooks = {
  beforesetup?: (el: HTMLElement, options) => VideoJsPlayerOptions;
  setup?: (player: VideoJsPlayer) => void;
  beforeerror?: (player: VideoJsPlayer, err) => Error;
  error?: (player, err) => void;
};

export type VideoPlayerParams = {
  events?: PlayerEvents;
  hooks?: Hooks;
  customMenu?: CustomMenu;
};

export type PlayerMethods = {
  getCurrentTime: () => number;
  destroy: () => void;
  pause: () => void;
  reset: () => void;
  setSource: (
    src: string | string[] | { src: string; type: string } | { src: string; type: string }[]
  ) => void;
  setCustomMenu: (customMenu: CustomMenu, data: any) => void;
};

let model;

let playerEvent: PlayerEvents = {};

let hooks: Hooks | {} = {};

let customMenu: CustomMenu = [];

const register = (instance) => {
  model = instance.getPlayerRef();
  model.setEvents(playerEvent);
  if (hooks) model.setHooks(hooks);
  if (Array.isArray(customMenu) && customMenu.length) model.setCustomMenu(customMenu);
  model.init();
};

const methods: PlayerMethods = {
  getCurrentTime: () => model.currentTime(),
  destroy: () => model.destroy(),
  pause: () => model.pause(),
  reset: () => model.reset(),
  setSource: (src) => model.setSource(src),
  setCustomMenu: (customMenu, data) => model.setCustomMenu(customMenu, data),
};

export default (params?: VideoPlayerParams): [(instance) => void, PlayerMethods] => {
  if (params?.events) playerEvent = params?.events;
  if (params?.hooks) hooks = params?.hooks;
  if (params?.customMenu) customMenu = params?.customMenu;
  return [register, methods];
};
