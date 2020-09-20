let styles = require('./video.css');

interface Ivideo {
  url : string;
  elem : string | HTMLElement;
  width? : string;
  height? : string;
  autoplay? : boolean;
}

interface Icomponent {
  tempContaniner : HTMLElement;
  init : () => void;
  template : () => void;
  handle : () => void;
}

function video(options : Ivideo) {
  return new Video(options);
}

class Video implements Icomponent {
  tempContaniner;
  constructor(private settings : Ivideo) {
    this.settings = Object.assign({
      width : '100%',
      height : '100%',
      autoplay : false
    }, this.settings);
    this.init();
  }
  init() {
    this.template();
    this.handle();
  }
  template() {
    this.tempContaniner = document.createElement('div');
    this.tempContaniner.className = styles.video;
    this.tempContaniner.style.width = this.settings.width;
    this.tempContaniner.style.height = this.settings.height;
    this.tempContaniner.innerHTML = `
      <video class="${styles['video-content']}" src="${this.settings.url}"></video>
      <div class="${styles['video-controls']}">
        <div class="${styles['video-progress']}">
          <div class="${styles['video-progress-now']}"></div>
          <div class="${styles['video-progress-suc']}"></div>
          <div class="${styles['video-progress-bar']}"></div>
        </div>
        <div class="${styles['video-play']}">
          <i class="iconfont icon-bofang"></i>
        </div>
        <div class="${styles['video-time']}">
          <span>00:00</span> / <span>00:00</span>
        </div>
        <div class="${styles['video-full']}">
          <i class="iconfont iconfull"></i>          
        </div>
        <div class="${styles['video-volume']}">
          <i class="iconfont iconvolume"></i>
          <div class="${styles['video-volprogress']}">
            <div class="${styles['video-volprogress-now']}"></div>
            <div class="${styles['video-volprogress-bar']}"></div>
          </div>
        </div>
      </div>
    `;

    if (typeof this.settings.elem === 'object') {
      this.settings.elem.appendChild(this.tempContaniner);
    }
    else {
      document.querySelector(`${this.settings.elem}`).appendChild(this.tempContaniner)
    }
  }
  handle() {
    let videoContent : HTMLVideoElement  = this.tempContaniner.querySelector(`.${styles['video-content']}`);
    let videoControls = this.tempContaniner.querySelector(`.${styles['video-controls']}`);
    let videoPlay = this.tempContaniner.querySelector(`.${styles['video-play']} i`);
    let videoTimes = this.tempContaniner.querySelectorAll(`.${styles['video-time']} span`);
    let timer;
    let videoFull= this.tempContaniner.querySelector(`.${styles['video-full']} i`);
    let videoProgress = this.tempContaniner.querySelectorAll(`.${styles['video-progress']} div`);
    let videoVolProgress = this.tempContaniner.querySelectorAll(`.${styles['video-volprogress']} div`);
    // 视频的音量 0~1
    videoContent.volume = 0.5;

    if (this.settings.autoplay) {
      timer = setInterval(playing, 1000);
      videoContent.play();
    }

    this.tempContaniner.addEventListener('mouseenter', function() {
      // mouseenter 不会让子元素触发，不会有事件冒泡行为
      videoControls.style.bottom = 0;
    });
    this.tempContaniner.addEventListener('mouseleave', function() {
      videoControls.style.bottom = '-50px';
    })
    // 视频是否加载完毕
    videoContent.addEventListener('canplay', () => {
      videoTimes[1].innerHTML = formatTime(videoContent.duration);
    });
    // 视频播放事件
    videoContent.addEventListener('play', () => {
      videoPlay.className = 'iconfont iconzanting';
      timer = setInterval(playing, 1000);
    });
    // 视频暂停事件
    videoContent.addEventListener('pause', () => {
      videoPlay.className = 'iconfont icon-bofang';
      clearInterval(timer);
    });
    // 播放与暂停
    videoPlay.addEventListener('click', () => {
      if (videoContent.paused) {
        videoContent.play();
      }
      else {
        videoContent.pause();
      }
    })

    // 全屏播放
    videoFull.addEventListener('click', () => {
      videoContent.requestFullscreen();
    });
    // 拖拽，改变播放进度
    videoProgress[2].addEventListener('mousedown', function(ev : MouseEvent) {
      let downX = ev.pageX; // 按下点的坐标
      let downL = this.offsetLeft; // 到当前有定位的组件节点的左偏移
      document.onmousemove = (ev:MouseEvent) => {
        let scale = (ev.pageX - downX + downL + 8) / this.parentNode.offsetWidth;
        scale < 0 && (scale = 0);
        scale > 1 && (scale = 1);

        videoProgress[0].style.width = scale * 100 + '%';
        videoProgress[1].style.width = scale * 100 + '%';
        this.style.left = scale * 100 + '%';

        videoContent.currentTime = scale * videoContent.duration;
      };
      document.onmouseup = () => {
        document.onmousemove = document.onmouseup = null;
      };
      ev.preventDefault();
    })
    // 拖拽，改变播放音量
    videoVolProgress[1].addEventListener('mousedown', function(ev : MouseEvent) {
      let downX = ev.pageX; // 按下点的坐标
      let downL = this.offsetLeft; // 到当前有定位的组件节点的左偏移
      document.onmousemove = (ev : MouseEvent) => {
        let scale = (ev.pageX - downX + downL + 8) / this.parentNode.offsetWidth;
        scale < 0 && (scale = 0);
        scale > 1 && (scale = 1);
        videoVolProgress[0].style.width = scale * 100 + "%";
        this.style.left = scale * 100 + '%';
        videoContent.volume = scale;
      };
      document.onmouseup = () => {
        document.onmousemove = document.onmouseup = null;
      };
      ev.preventDefault();
    });
    // 播放中...
    function playing() {
      let scale = videoContent.currentTime / videoContent.duration;
      let scaleSuc = videoContent.buffered.end(0) / videoContent.duration;
      videoTimes[0].innerHTML = formatTime(videoContent.currentTime);
      videoProgress[0].style.width = scale * 100 + '%';
      videoProgress[1].style.width = scaleSuc * 100 + '%';
      videoProgress[2].style.left = scale * 100 + '%';
    }

    function formatTime(number : number) : string {
      number = Math.round(number);
      let min = Math.floor(number / 60);
      let sec = Math.floor(number % 60);
      return setZero(min) + ':' + setZero(sec);
    }

    function setZero(number : number) : string {
      if (number < 10) {
        return '0' + number;
      }
      return '' + number;
    }
  }
}

export default video;