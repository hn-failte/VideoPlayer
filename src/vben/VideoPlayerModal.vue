<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerVideoPlayerModal"
    :canFullscreen="false"
    :showOkBtn="false"
    :showCancelBtn="false"
    width="55%"
    title="播放"
    @visible-change="onVisibleChange"
  >
    <VideoPlayer v-if="visible" class="video-player" @register="registerVideoPlayer" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import type { CustomMenu } from '../plugins/videojs-custom-menu/plugin';
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import VideoPlayer from './VideoPlayer.vue';
  import useVideoPlayer from './useVideoPlayer';

  const props = defineProps({
    customMenu: Array,
  });

  defineEmits(['register']);

  const visible = ref(false);
  const [registerVideoPlayer, { setSource, setCustomMenu }] = useVideoPlayer({
    events: {
      onReady: () => {
        console.log('onReady');
      },
      onPlayStart: () => {
        console.log('onPlayStart');
      },
      onPlayPause: () => {
        console.log('onPlayPause');
      },
      onPlayEnd: () => {
        console.log('onPlayEnd');
      },
    },
  });
  const [registerVideoPlayerModal, { setModalProps }] = useModalInner((data) => {
    setModalProps({
      title: data.fileName,
    });
    if (data.fileDownloadPath) setSource(data.fileDownloadPath);
    if (props.customMenu) setCustomMenu(props.customMenu as CustomMenu, data);
  });
  const onVisibleChange = (_visible) => {
    visible.value = _visible;
  };
</script>

<style scoped lang="less">
  .video-player {
    height: 580px;
  }
</style>
