// import './popup.css'; // 全局css操作
let styles = require('./popup.css')

interface Ipopup {
  width? : string;
  height? : string;
  title? : string;
  pos? : string;
  mask? : boolean;
  content? : () => void;
}

interface Icomponent {
  tempContainer : HTMLElement;
  init : () => void;
  template: () => void;
  handle : () => void;
}

function popup( options : Ipopup) {
  return new Popup(options)
}

class Popup implements Icomponent {
  tempContainer;
  constructor( private settings : Ipopup) {
    this.settings = Object.assign({
        width : '100%',
        height : '100%',
        title : '',
        pos : 'center',
        mask : true,
        content: function() {}
    }, this.settings);
    this.init();
  }
  // 初始化
  init() {
    this.template();
  }
  // 创建模板
  template() {
    this.tempContainer = document.createElement('div');
    this.tempContainer.style.width = this.settings.width;
    this.tempContainer.style.height = this.settings.height;
    this.tempContainer.className = styles.popup;
    this.tempContainer.innerHTML = `
      <div class="${styles['popup-title']}">
        <h3>${ this.settings.title }</h3>
        <i class="iconfont iconguanbi"></i>
      </div>
      <div class="${styles['popup-content']}"></div>
    `;
    document.body.appendChild(this.tempContainer);
    if (this.settings.pos === 'left') {
      this.tempContainer.style.left = 0;
      this.tempContainer.style.top = (window.innerHeight - this.tempContainer.offsetHeight) + 'px';
    } 
    else if (this.settings.pos === 'right') {
      this.tempContainer.style.right = 0;
      this.tempContainer.style.top = (window.innerHeight - this.tempContainer.offsetHeight) + 'px';
    }
    else {
      this.tempContainer.style.left = (window.innerWidth - this.tempContainer.offsetWidth) / 2 + 'px';
      this.tempContainer.style.top = (window.innerHeight - this.tempContainer.offsetHeight) / 2 + 'px';
    }
  }
  // 事件操作
  handle() {

  }
}

export default popup;