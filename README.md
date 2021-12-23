# VideoPlayer

A Video Player Base on video.js

## Usage

1、use in vue3 project, such as `vben` framework

nitoce: useZegoVideoPlayer、ZegoVideoPlayer and ZegoVideoPlayerModal was only provided to vben!

```vue
<template>
  <div>
    <a @click="play">播放</a>
    <ZegoVideoPlayerModal @register="registerZegoVideoPlayerModal" :customMenu="customMenu" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useModal } from '/@/components/Modal';
const [registerVideoPlayerModal, { openModal: openVideoPlayerModal }] = useModal();

export default defineComponent({
  setup() {
    const customMenu = [
      {
        label: '下载',
        action(detail) {
          console.log(detail, 'detail');
        },
      },
      {
        label: '移动',
        action(detail) {
          console.log(detail, 'detail');
        },
      },
    ];
    const play = () => {
      openVideoPlayerModal(true, {
        fileId: 'xxx',
        fileDownloadPath: 'xxx.m3u8',
      });
    }
    return {
      customMenu,
      play,
      openVideoPlayerModal,
    }
  }
})
</script>
```

2、use in vue2 project

3、use in react project

4、use in javascript project
