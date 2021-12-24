# VideoPlayer

A Video Player Base on video.js

## scripts

`yarn dev`: Which will build package with video.js, and will watch file to build

`yarn build`: Which will build package, but this package must based on video.js, which means util you introduce video.js, and this package can run normally.

## Usage

1、use in vue3 project, such as `vben` framework

**Nitoce**: useZegoVideoPlayer、ZegoVideoPlayer and ZegoVideoPlayerModal was only provided to vben! You can find demos in `src/vben/*`.

```vue
<template>
  <div>
    <a @click="play">播放</a>
    <ZegoVideoPlayerModal @register="registerZegoVideoPlayerModal" :customMenu="customMenu" />
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

2、use in vue2 project

to be update

3、use in react project

to be update

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
<script src="../dist/umd/videojs-marker-plugin.umd.min.js"></script>
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
