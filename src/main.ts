
import './main.css';
import popup from './components/popup/popup';
import video from './components/video/video'

let listItem = document.querySelectorAll('#list li');

for (let i = 0; i < listItem.length; i++) {
  listItem[i].addEventListener('click', function() {

    let url = this.dataset.url;
    let title = this.dataset.title;

    console.log(url, title);

    popup({
      width : '880px',
      height : '556px',
      title,
      pos : 'center',
      content(elem) {
        video({
          url,
          elem,
          autoplay: true
        })
      }
    })
  })
}