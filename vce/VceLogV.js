import { Vce }      from './Vce.js';

export class VceLogV extends Vce
{
  constructor()
  {
    super();
  }

  static get observedAttributes()
  {
    return ['text'];
  }

  set text(txt)
  {
    this.setAttribute('text', txt);
  }

  get text()
  {
    return this.getAttribute('text') || '';
  }

  attributeChangedCallback(name, oldValue, newValue)
  {
    this.update();
  }

  connectedCallback()
  {
    this.render();
    this.update();
  }

  render()
  {
    const templ = document.querySelector('#vceLogT').content.cloneNode(true);
    this.appendChild(templ);
  }

  update()
  {
    this.querySelector('.widgetLogText').innerHTML = this.text;
  }
}
