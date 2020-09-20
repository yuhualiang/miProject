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

  }
}

export default video;