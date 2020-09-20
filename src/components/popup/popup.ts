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
    this.tempContainer.innerHTML = `
      <h1 class="${styles.popup}">hello</h1>
    `;
    document.body.appendChild(this.tempContainer);
  }
  // 事件操作
  handle() {

  }
}

export default popup;