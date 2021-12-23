// @ts-nocheck
import type { VideoJsPlayer } from 'video.js';
import videojs from 'video.js';
import playItem from './play-item';
import * as autoadvance from './auto-advance';

const isItemObject = (value) => {
  return !!value && typeof value === 'object';
};

const transformPrimitiveItems = (arr) => {
  const list = [];
  let tempItem;

  arr.forEach((item) => {
    if (!isItemObject(item)) {
      tempItem = Object(item);
      tempItem.originalValue = item;
    } else {
      tempItem = item;
    }

    list.push(tempItem);
  });

  return list;
};

const generatePlaylistItemId = (arr) => {
  let guid = 1;

  arr.forEach((item) => {
    item.playlistItemId_ = guid++;
  });
};

const indexInPlaylistItemIds = (list, currentItemId) => {
  for (let i = 0; i < list.length; i++) {
    if (list[i].playlistItemId_ === currentItemId) {
      return i;
    }
  }

  return -1;
};

const sourceEquals = (source1, source2) => {
  let src1 = source1;
  let src2 = source2;

  if (typeof source1 === 'object') {
    src1 = source1.src;
  }
  if (typeof source2 === 'object') {
    src2 = source2.src;
  }

  if (/^\/\//.test(src1)) {
    src2 = src2.slice(src2.indexOf('//'));
  }
  if (/^\/\//.test(src2)) {
    src1 = src1.slice(src1.indexOf('//'));
  }

  return src1 === src2;
};

const indexInSources = (arr, src) => {
  for (let i = 0; i < arr.length; i++) {
    const sources = arr[i].sources;

    if (Array.isArray(sources)) {
      for (let j = 0; j < sources.length; j++) {
        const source = sources[j];

        if (source && sourceEquals(source, src)) {
          return i;
        }
      }
    }
  }

  return -1;
};

const randomize = (arr) => {
  let index = -1;
  const lastIndex = arr.length - 1;

  while (++index < arr.length) {
    const rand = index + Math.floor(Math.random() * (lastIndex - index + 1));
    const value = arr[rand];

    arr[rand] = arr[index];
    arr[index] = value;
  }

  return arr;
};

export default function factory(player: VideoJsPlayer, initialList, initialIndex = 0) {
  let list = null;
  let changing = false;

  const playlist = (player.playlist = (newList, newIndex = 0) => {
    if (changing) {
      throw new Error('do not call playlist() during a playlist change');
    }

    if (Array.isArray(newList)) {
      const previousPlaylist = Array.isArray(list) ? list.slice() : null;
      const nextPlaylist = newList.slice();

      list = nextPlaylist.slice();

      if (list.filter((item) => isItemObject(item)).length !== list.length) {
        list = transformPrimitiveItems(list);
      }

      generatePlaylistItemId(list);

      changing = true;

      player.trigger({
        type: 'duringplaylistchange',
        nextIndex: newIndex,
        nextPlaylist,
        previousIndex: playlist.currentIndex_,

        previousPlaylist: previousPlaylist || [],
      });

      changing = false;

      if (newIndex !== -1) {
        playlist.currentItem(newIndex);
      }

      if (previousPlaylist) {
        player.setTimeout(() => {
          player.trigger('playlistchange');
        }, 0);
      }
    }

    return list.map((item) => item.originalValue || item).slice();
  });

  player.on('loadstart', () => {
    if (playlist.currentItem() === -1) {
      autoadvance.reset(player);
    }
  });

  playlist.currentIndex_ = -1;
  playlist.player_ = player;
  playlist.autoadvance_ = {};
  playlist.repeat_ = false;
  playlist.currentPlaylistItemId_ = null;

  playlist.currentItem = (index) => {
    if (changing) {
      return playlist.currentIndex_;
    }

    if (
      typeof index === 'number' &&
      playlist.currentIndex_ !== index &&
      index >= 0 &&
      index < list.length
    ) {
      playlist.currentIndex_ = index;
      playItem(playlist.player_, list[playlist.currentIndex_]);

      return playlist.currentIndex_;
    }

    const src = playlist.player_.currentSrc() || '';

    if (playlist.currentPlaylistItemId_) {
      const indexInItemIds = indexInPlaylistItemIds(list, playlist.currentPlaylistItemId_);
      const item = list[indexInItemIds];

      if (item && Array.isArray(item.sources) && indexInSources([item], src) > -1) {
        playlist.currentIndex_ = indexInItemIds;
        return playlist.currentIndex_;
      }

      playlist.currentPlaylistItemId_ = null;
    }

    playlist.currentIndex_ = playlist.indexOf(src);

    return playlist.currentIndex_;
  };

  playlist.contains = (value) => {
    return playlist.indexOf(value) !== -1;
  };

  playlist.indexOf = (value) => {
    if (typeof value === 'string') {
      return indexInSources(list, value);
    }

    const sources = Array.isArray(value) ? value : value.sources;

    for (let i = 0; i < sources.length; i++) {
      const source = sources[i];

      if (typeof source === 'string') {
        return indexInSources(list, source);
      } else if (source.src) {
        return indexInSources(list, source.src);
      }
    }

    return -1;
  };

  playlist.currentIndex = () => playlist.currentItem();

  playlist.lastIndex = () => list.length - 1;

  playlist.nextIndex = () => {
    const current = playlist.currentItem();

    if (current === -1) {
      return -1;
    }

    const lastIndex = playlist.lastIndex();

    if (playlist.repeat_ && current === lastIndex) {
      return 0;
    }

    return Math.min(current + 1, lastIndex);
  };

  playlist.previousIndex = () => {
    const current = playlist.currentItem();

    if (current === -1) {
      return -1;
    }

    if (playlist.repeat_ && current === 0) {
      return playlist.lastIndex();
    }

    return Math.max(current - 1, 0);
  };

  playlist.first = () => {
    if (changing) {
      return;
    }
    const newItem = playlist.currentItem(0);

    if (list.length) {
      return list[newItem].originalValue || list[newItem];
    }

    playlist.currentIndex_ = -1;
  };

  playlist.last = () => {
    if (changing) {
      return;
    }
    const newItem = playlist.currentItem(playlist.lastIndex());

    if (list.length) {
      return list[newItem].originalValue || list[newItem];
    }

    playlist.currentIndex_ = -1;
  };

  playlist.next = () => {
    if (changing) {
      return;
    }

    const index = playlist.nextIndex();

    if (index !== playlist.currentIndex_) {
      const newItem = playlist.currentItem(index);

      return list[newItem].originalValue || list[newItem];
    }
  };

  playlist.previous = () => {
    if (changing) {
      return;
    }

    const index = playlist.previousIndex();

    if (index !== playlist.currentIndex_) {
      const newItem = playlist.currentItem(index);

      return list[newItem].originalValue || list[newItem];
    }
  };

  playlist.autoadvance = (delay) => {
    autoadvance.setup(playlist.player_, delay);
  };

  playlist.repeat = (val) => {
    if (val === undefined) {
      return playlist.repeat_;
    }

    if (typeof val !== 'boolean') {
      videojs.log.error('videojs-playlist: Invalid value for repeat', val);
      return;
    }

    playlist.repeat_ = !!val;
    return playlist.repeat_;
  };

  playlist.sort = (compare) => {
    if (!list.length) {
      return;
    }

    list.sort(compare);

    if (changing) {
      return;
    }

    player.trigger('playlistsorted');
  };

  playlist.reverse = () => {
    if (!list.length) {
      return;
    }

    list.reverse();

    if (changing) {
      return;
    }

    player.trigger('playlistsorted');
  };

  playlist.shuffle = ({ rest } = {}) => {
    let index = 0;
    let arr = list;

    if (rest) {
      index = playlist.currentIndex_ + 1;
      arr = list.slice(index);
    }

    if (arr.length <= 1) {
      return;
    }

    randomize(arr);

    if (rest) {
      list.splice(...[index, arr.length].concat(arr));
    }

    if (changing) {
      return;
    }

    player.trigger('playlistsorted');
  };

  if (Array.isArray(initialList)) {
    playlist(initialList.slice(), initialIndex);
  } else {
    list = [];
  }

  return playlist;
}
