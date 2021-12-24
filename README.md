# VideoPlayer

A Video Player Base on video.js

## scripts

`yarn dev`: Which will build package with video.js, and will watch file to build

`yarn build`: Which will build package, but this package must based on video.js, which means util you introduce video.js, and this package can run normally.

## install

`yarn add vjs-videoplayer` or `npm i vjs-videoplayer`

## Usage

1、use in vue2 project

```html
<div id="app">
  <video class="video-js" ref="el">
    <p class="vjs-no-js">
      To view this video please enable JavaScript, and consider upgrading to a web browser that
      <a
        href="https://videojs.com/html5-video-support/"
        target="_blank"
      >supports HTML5 video</a>
    </p>
  </video>
</div>
```


```js
import VideoPlayer from 'vjs-videoplayer'
import zhCN from 'video.js/dist/lang/zh-CN.json'
import 'vjs-videoplayer/dist/es/playlist-plugin'
import 'vjs-videoplayer/dist/es/marker-plugin'
import 'vjs-videoplayer/dist/es/screenshot-plugin'
import 'vjs-videoplayer/dist/es/custom-menu-plugin'
import 'video.js/dist/video-js.css'
import 'vjs-videoplayer/dist/es/marker-plugin.css'
import 'vjs-videoplayer/dist/es/screenshot-plugin.css'
import 'vjs-videoplayer/dist/es/custom-menu-plugin.css'

export default {
  name: 'App',
  mounted() {
    new VideoPlayer({
      el: this.$refs.el,
      options: {
        notSupportedMessage: '暂不支持播放该视频',
        // 多语言，videojs 默认为英文，播放器默认为中文，因此需要提供中文翻译
        languages: {
          'zh-CN': {
            ...zhCN,
            'turn-next': '下一个',
            'turn-last': '上一个',
            screenshot: '截图',
            custom: '更多'
          }
        }
      },
      source: 'http://content.jwplatform.com/manifests/vM7nH0Kl.m3u8'
    }).init()
  }
}
```

2、use in vue3 project, such as `vben` framework

Some usage like vue2, functional useage like below.

**Nitoce**: useVideoPlayer、VideoPlayer and VideoPlayerModal was only provided to vben! You can find demos in `src/vben/*` of project [VideoPlayer](https://github.com/hn-failte/VideoPlayer/tree/master/src/vben).

```vue
<template>
  <div>
    <a @click="play">播放</a>
    <VideoPlayerModal @register="registerVideoPlayerModal" :customMenu="customMenu" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useModal } from '/@/components/Modal'
const [registerVideoPlayerModal, { openModal: openVideoPlayerModal }] = useModal()

export default defineComponent({
  setup() {
    const customMenu = [
      {
        label: '下载',
        action(detail) {
          console.log(detail, 'detail')
        }
      },
      {
        label: '移动',
        action(detail) {
          console.log(detail, 'detail')
        }
      }
    ]
    const play = () => {
      openVideoPlayerModal(true, {
        fileId: 'xxx',
        fileDownloadPath: 'xxx.m3u8'
      })
    }
    return {
      customMenu,
      play,
      openVideoPlayerModal
    }
  }
})
</script>
```

3、use in react project

```js
import VideoPlayer from 'vjs-videoplayer'
import zhCN from 'video.js/dist/lang/zh-CN.json'
import 'vjs-videoplayer/dist/es/playlist-plugin'
import 'vjs-videoplayer/dist/es/marker-plugin'
import 'vjs-videoplayer/dist/es/screenshot-plugin'
import 'vjs-videoplayer/dist/es/custom-menu-plugin'
import 'video.js/dist/video-js.css'
import 'vjs-videoplayer/dist/es/marker-plugin.css'
import 'vjs-videoplayer/dist/es/screenshot-plugin.css'
import 'vjs-videoplayer/dist/es/custom-menu-plugin.css'

export default class extends React.Component {
  componentDidMount() {
    new VideoPlayer({
      el: this.refs.el,
      options: {
        notSupportedMessage: '暂不支持播放该视频',
        // 多语言，videojs 默认为英文，播放器默认为中文，因此需要提供中文翻译
        languages: {
          'zh-CN': {
            ...zhCN,
            "turn-next": '下一个',
            "turn-last": '上一个',
            "screenshot": '截图',
            "custom": '更多'
          }
        }
      },
      source: 'http://content.jwplatform.com/manifests/vM7nH0Kl.m3u8'
    }).init()
  }
  render() {
    return (
      <div id="app">
        <video class="video-js" ref="el">
          <p class="vjs-no-js">
            To view this video please enable JavaScript, and consider upgrading to a web browser that
            <a
              href="https://videojs.com/html5-video-support/"
              target="_blank"
            >supports HTML5 video</a>
          </p>
        </video>
      </div>
    )
  }
}
```

4、use in javascript project

add styles in head

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/video.js@7.17.0/dist/video-js.css" />
<link rel="stylesheet" href="../dist/umd/custom-menu-plugin-umd.css" />
<link rel="stylesheet" href="../dist/umd/marker-plugin-umd.css" />
<link rel="stylesheet" href="../dist/umd/screenshot-plugin-umd.css" />
```

create container

```html
<div style="width: 800px; height: 680px;">
  <video id="video-js" class="video-js">
    <p class="vjs-no-js">
      To view this video please enable JavaScript, and consider upgrading to a web browser that
      <a href="https://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a>
    </p>
  </video>
</div>
```

main code

```html
<script src="https://cdn.jsdelivr.net/npm/video.js@7.17.0/dist/video.js"></script>
<script src="../dist/umd/video-player.umd.min.js"></script>
<script src="../dist/umd/playlist-plugin.umd.min.js"></script>
<script src="../dist/umd/custom-menu-plugin.umd.min.js"></script>
<script src="../dist/umd/screenshot-plugin.umd.min.js"></script>
<script src="../dist/umd/marker-plugin.umd.min.js"></script>
<script>
  window.onload = () => {
    let player = new VideoPlayer({
      el: document.getElementById('video-js'),
      options: {
        notSupportedMessage: '暂不支持播放该视频'
      },
      source: 'http://content.jwplatform.com/manifests/vM7nH0Kl.m3u8'
    })
    player.init()
  }
</script>
```
