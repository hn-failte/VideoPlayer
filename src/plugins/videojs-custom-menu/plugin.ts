// @ts-nocheck
import videojs from 'video.js';
import './plugin.less';

const MenuButton = videojs.getComponent('MenuButton');
const Menu = videojs.getComponent('Menu');
const MenuItem = videojs.getComponent('MenuItem');
const registerPlugin = videojs.registerPlugin || videojs.plugin;

const onPlayerReady = (player, props = {}) => {
  player.controlBar.customMenuButton = player.controlBar.addChild(
    'CustomMenuButton',
    {
      function: 'custom',
      ...props,
    },
    13
  );
};

const plugin: VideojsCustomMenuPlugin = function (
  props: VideojsCustomMenuPluginParams | null | undefined
) {
  this.ready(() => {
    onPlayerReady(this, props || {});
  });
};

class CustomMenuButton extends MenuButton {
  constructor(player, props: { function: string; customMenu: CustomMenu }) {
    super(player, props);
    if (this.options_.function === 'custom') {
      this.controlText(this.localize('custom'));
    }
  }

  createMenu() {
    const menu = new Menu(this.player_);
    menu.addClass('vjs-custom-menu-container');
    menu.width(60);
    const { customMenu, data } = this.options_;
    if (Array.isArray(customMenu) && customMenu.length) {
      customMenu.forEach((item) => {
        const menuItem = new MenuItem(this.player_, item);
        menuItem.addClass('vjs-custom-menu-item');
        menuItem.on('click', (_) => {
          item.action && item.action(data);
        });
        menu.addItem(menuItem);
      });
    }
    return menu;
  }

  buildCSSClass() {
    return `vjs-custom-menu ${this.options_.function}-menu ${super.buildCSSClass()}`;
  }
}

videojs.registerComponent('CustomMenuButton', CustomMenuButton);

registerPlugin('customMenuPlugin', plugin);

export type CustomMenuItem = {
  key: string;
  name: string;
};

export type VideojsCustomMenuPluginParams = { customMenu: CustomMenu; data };

export type CustomMenu = CustomMenuItem[];

export type VideojsCustomMenuPluginParams = { customMenu: CustomMenu; data: any };

export type VideojsCustomMenuPlugin = (params: VideojsCustomMenuPluginParams) => void;

export default plugin;
