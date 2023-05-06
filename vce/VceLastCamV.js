import { Vce }      from './Vce.js';

export class VceLastCamV extends Vce
{
  constructor()
  {
    super();
  }

  static get observedAttributes()
  {
    return ['url', 'idx'];
  }

  get url()
  {
    return this.getAttribute('url') || 'blank.jpg';
  }

  set url(url)
  {
    this.setAttribute('url', url);
  }

  get idx()
  {
    return this.getAttribute('idx') || '';
  }

  set idx(idx)
  {
    this.setAttribute('idx', idx);
  }

  attributeChangedCallback(name, oldValue, newValue)
  {
    if (name == 'url')
    {
      this.render();
    }
  }

  render()
  {
    const templ = document.querySelector('#vceLastCamT').content.cloneNode(true);
    const url = (this.url !== "undefined") ? this.url : '';

    this.innerHTML = '';
    templ.querySelector('.widgetLastCam__image').setAttribute('src', url);
    this.appendChild(templ);
  }
}
