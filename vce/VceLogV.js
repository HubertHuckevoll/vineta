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
    this.render();
  }

  connectedCallback()
  {
    this.render();
  }

  render()
  {
    this.innerHTML = '<span class="widgetLogText">'+this.text+'</span>';
  }

}
