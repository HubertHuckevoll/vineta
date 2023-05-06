import { Vce }      from './Vce.js';

export class VceLocationV extends Vce
{
  constructor()
  {
    super();
  }

  static get observedAttributes()
  {
    return ['place', 'desc', 'url'];
  }

  get place()
  {
    return this.getAttribute('place');
  }

  set place(txt)
  {
    this.setAttribute('place', txt);
  }

  get desc()
  {
    return this.getAttribute('desc');
  }

  set desc(txt)
  {
    this.setAttribute('desc', txt);
  }

  get url()
  {
    return this.getAttribute('url');
  }

  set url(txt)
  {
    this.setAttribute('url', txt);
  }

  attributeChangedCallback(name, oldValue, newValue)
  {
    this.render();
  }

  connectedCallback()
  {
    this.render();
  }

  render()
  {
    const templ = document.querySelector('#vceLocationT').content.cloneNode(true);

    templ.querySelector('.widgetLocation__link').innerHTML = this.desc;
    templ.querySelector('.widgetLocation__link').setAttribute('href', this.url);
    templ.querySelector('.widgetLocation__place').innerHTML = this.place;

    this.innerHTML = '';
    this.appendChild(templ);
  }

}
