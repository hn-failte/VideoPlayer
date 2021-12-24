import { useState, useEffect } from 'react';
import { message } from 'ant-design-vue';
import VideoPlayer from '../VideoPlayer'
import zhCN from 'video.js/dist/lang/zh-CN.json'
import 'video.js/dist/video-js.css'
import '../plugins/videojs-marker/plugin.less'
import '../plugins/videojs-screenshot/plugin.less'
import '../plugins/videojs-custom-menu/plugin.less'
import '../plugins/videojs-playlist/plugin'
import '../plugins/videojs-marker/plugin'
import '../plugins/videojs-screenshot/plugin'
import '../plugins/videojs-custom-menu/plugin'

export default (props: {
  register: (operationpa: { getPlayerRef:  () => VideoPlayer | null }) => void;
  playList: { type: string[] | { src: string; type: string; }[] };
  url: { type: String };
}) => {
  let player: VideoPlayer | null = null
  const [el, setEl] = useState()

  useEffect(() => {
    if (!el.current) return;
    player = new VideoPlayer({
      el,
      alert: message.error,
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
        },
      }
    })
    props.register({
      getPlayerRef: (): VideoPlayer | null => player
    })
    if (props.playList) player.setPlayList(props.playList)
    else if (props.url) player.setSource(props.url)
    return () => {
      player && player.exitPictureInPicture()
      player && player.dispose()
      player = null
    }
  }, [el])

  // const markPoint = () => {
  //   player.markPoint()
  //   console.log(player.getMarkerOptions())
  // }
  // const showPanel = () => {
  //   player.toggleMarkPanel(true)
  // }
  // const hiddenPanel = () => {
  //   player.toggleMarkPanel(false)
  // }

  return (
    <video class="video-js" ref={el => setEl(el)}>
      <p class="vjs-no-js">
        To view this video please enable JavaScript, and consider upgrading to a web browser that
        <a
          href="https://videojs.com/html5-video-support/"
          target="_blank"
        >supports HTML5 video</a>
      </p>
    </video>
  )
}
