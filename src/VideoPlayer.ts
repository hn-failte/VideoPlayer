import type { VideoJsPlayer, VideoJsPlayerOptions } from 'video.js';
import type { VideojsScreenshotPlugin } from './plugins/videojs-screenshot/plugin';
import type { VideojsCustomMenuPlugin, CustomMenu } from './plugins/videojs-custom-menu/plugin';
import type { PlaylistPlugin, PlayItem } from './plugins/videojs-playlist/plugin';
import type { MarkerPlugin, MarkerOptions } from './plugins/videojs-marker/plugin';
import videojs from 'video.js';

type VideoPlayerParams = {
  el: HTMLElement | undefined | null;
  alert: (msg: any) => any | undefined | null;
  options: VideoJsPlayerOptions;
  playList: PlayItem[] | undefined | null;
  source: PlayItem | PlayItem[] | undefined | null;
  customMenu: CustomMenu | undefined | null;
  hooks: (() => void)[];
  onReady: () => void;
  onPlayStart: () => void;
  onPlayPause: () => void;
  onPlayEnd: () => void;
  onDispose: () => void;
};

export default class VideoPlayer {
  player!: VideoJsPlayer &
    Partial<{
      markerPlugin: MarkerPlugin & ((options?: Partial<MarkerOptions>) => MarkerPlugin);
      screenshotPlugin: VideojsScreenshotPlugin;
      customMenuPlugin: VideojsCustomMenuPlugin;
      playlist: PlaylistPlugin;
      isInPictureInPicture: boolean;
      disablePictureInPicture: Function;
      requestPictureInPicture: Function;
      exitPictureInPicture: Function;
      alert: (msg: any) => any | undefined | null;
    }>;
  el: HTMLElement | undefined | null;
  alert: (msg: any) => any | undefined | null = window.alert;
  ready = false;
  playList: PlayItem[] | undefined | null = void 0;
  source: PlayItem | PlayItem[] | undefined | null = void 0;
  customMenu: CustomMenu | undefined | null = void 0;
  onReady: Function = () => {
    videojs.log('player is ready');
  };
  onPlayStart: Function = () => {
    videojs.log('play start');
  };
  onPlayPause: Function = () => {
    videojs.log('play pause');
  };
  onPlayEnd: Function = () => {
    videojs.log('play ended');
  };
  onDispose: Function = () => {
    console.log('player will dispose');
  };
  options: VideoJsPlayerOptions = {
    poster: '',
    autoplay: true,
    controls: true,
    muted: true,
    language: 'zh-CN',
    preload: 'auto',
    width: 1100,
    plugins: {},
    html5: {
      nativeCaptions: false,
      dash: {
        setLimitBitrateByPortal: false,
      },
    },
    fluid: false,
  };
  hooks = {
    beforesetup(_: HTMLElement, options) {
      // 可以在该钩子内进行配置
      console.log('beforesetup: options', options);
      return options;
    },
    setup(player) {
      // 该钩子内能获取到注册的插件
      console.log('setup', player);
    },
    beforeerror(_: VideoJsPlayer, err) {
      if (err) console.error(err);
      return err;
    },
    error(player, err) {
      // 调用 play.error 会触发该钩子
      console.log(`player ${player.id()} has errored out with code ${err.code} ${err.message}`);
    },
  };
  constructor(params?: Partial<VideoPlayerParams>) {
    const {
      el,
      options,
      alert,
      playList,
      source,
      customMenu,
      hooks,
      onReady,
      onPlayStart,
      onPlayPause,
      onPlayEnd,
      onDispose,
    } = params || {};
    if (hooks) this.hooks = { ...this.hooks, ...hooks };
    if (alert) this.alert = alert;
    this.listenHooks();
    this.el = el || document.getElementById('video-player');
    if (options) {
      this.options = videojs.mergeOptions(this.options, options);
    }
    if (customMenu) this.customMenu = customMenu;
    if (playList) this.playList = playList;
    if (!this.playList) this.source = source;
    if (onReady) this.onReady = onReady;
    if (onPlayStart) this.onPlayStart = onPlayStart;
    if (onPlayPause) this.onPlayPause = onPlayPause;
    if (onPlayEnd) this.onPlayEnd = onPlayEnd;
    if (onDispose) this.onDispose = onDispose;
  }
  /**
   * 初始化
   */
  init() {
    this.el?.setAttribute('crossorigin', 'anonymous');
    (this.el as HTMLElement).style.width = '100%';
    this.player = videojs(this.el as HTMLElement, this.options, () => {
      this.player.alert = this.alert;
      this.listenPlayEvent();
      this.setSource();
      this.setPlayList();
      this.setCustomMenu();

      this.check();
      if (this.player.markerPlugin) {
        this.player.markerPlugin({ panel: false });
      }
      if (this.player.screenshotPlugin) this.player.screenshotPlugin();
      this.onReady();
      this.ready = true;
      this.player.trigger('player-ready');
    });
  }
  setOptions(options) {
    this.options = videojs.mergeOptions(this.options, options);
  }
  setHooks({ beforesetup, setup, beforeerror, error }) {
    this.hooks.beforesetup = beforesetup;
    this.hooks.setup = setup;
    this.hooks.beforeerror = beforeerror;
    this.hooks.error = error;
  }
  listenHooks() {
    videojs.hook('beforesetup', this.hooks.beforesetup);
    videojs.hook('setup', this.hooks.setup);
    videojs.hook('beforeerror' as any, this.hooks.beforeerror as any);
    videojs.hook('error' as any, this.hooks.error as any);
  }
  setEvents({ onReady, onPlayStart, onPlayPause, onPlayEnd }) {
    if (onReady) this.onReady = onReady;
    if (onPlayStart) this.onPlayStart = onPlayStart;
    if (onPlayPause) this.onPlayPause = onPlayPause;
    if (onPlayEnd) this.onPlayEnd = onPlayEnd;
  }
  registerPlugin(Plugin) {
    videojs.registerPlugin(Plugin.name, Plugin.install);
  }
  listenPlayEvent() {
    this.player.on('play', this.onPlayStart.bind(this));
    this.player.on('pause', this.onPlayPause.bind(this));
    this.player.on('ended', this.onPlayEnd.bind(this));
    this.player.on('dispose', this.onDispose.bind(this));
  }
  check() {
    // check autoplay
    if (this.options.autoplay && !this.options.muted)
      this.player.error('autoplay will not worked on muted ');
  }
  currentTime() {
    return Math.floor(this.player.currentTime());
  }
  /**
   * 动态修改 src
   * 单个源形式可以是字符串，用于普通的无需声明视频类型的源: 'http://120.24.93.182:9000/111/15b8279a-36a0-47bd-85bd-9562efadf3f4.mp4'
   * 单个源形式也可以是对象，用于特殊的需要手动声明视频类型的源: { src: 'http://mm-dev.zegonetwork.com:9000/111/dash/dash.mpd',　type: 'application/dash+xml' }
   * 可以是多个src: [{ src: 'http://mm-dev.zegonetwork.com:9000/111/dash/dash.mpd',　type: 'application/dash+xml' }]
   * 存在 playlist 时，不执行该方法
   */
  setSource(_source?: any) {
    if (this.playList) return;
    if (!this.ready && _source) {
      this.player.one('player-ready', () => {
        this.setSource(_source);
      });
      return;
    }
    const source = _source || this.source;
    if (source) {
      this.player.src(source);
    }
  }
  setPlayList(list?: any) {
    if (Array.isArray(list) && this.player.playlist) {
      this.player.playlist(list);
      this.player.playlist.autoadvance(0);
    } else {
      if (this.playList) {
        this.setPlayList(this.playList);
      }
    }
  }
  getMarkerOptions() {
    if (this.player.markerPlugin) {
      return this.player.markerPlugin().options;
    }
  }
  markPoint(_markers) {
    const options = this.getMarkerOptions();
    const markers =
      Array.isArray(_markers) && _markers.length
        ? _markers
        : [
            ...(options.markers || []),
            {
              offset: this.currentTime(),
              type: 'text',
            },
          ];
    if (this.player.markerPlugin) {
      this.player.markerPlugin().updateOptions({
        markers,
      });
    }
    return markers;
  }
  toggleMarkPanel(panel = true) {
    if (this.player.markerPlugin) {
      this.player.markerPlugin().updateOptions({
        panel,
      });
    }
    return panel;
  }
  setCustomMenu(_customMenu?: CustomMenu, data?: any) {
    if (!this.player.customMenuPlugin) return;
    if (!this.ready && _customMenu) {
      this.player.one('player-ready', () => {
        this.setCustomMenu(_customMenu, data);
      });
      return;
    }
    const customMenu = _customMenu || this.customMenu;
    if (Array.isArray(customMenu) && customMenu.length) {
      this.player.customMenuPlugin({
        customMenu: customMenu,
        data,
      });
    }
  }
  exitPictureInPicture() {
    if (this.player.isInPictureInPicture && this.player.exitPictureInPicture)
      this.player.exitPictureInPicture();
  }
  play() {
    this.player.play();
  }
  pause() {
    this.player.pause();
  }
  reset() {
    this.player.reset();
  }
  dispose() {
    this.player && this.player.dispose();
  }
}
