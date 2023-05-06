import { Vce }      from './Vce.js';

export class VceControlsV extends Vce
{
  constructor()
  {
    super();
  }

  static get observedAttributes()
  {
    return ['caption'];
  }

  get caption()
  {
    return this.getAttribute('caption') || 'Caption';
  }

  set caption(txt)
  {
    this.setAttribute('caption', txt);
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
    const templ = document.querySelector('#vceControlsT').content.cloneNode(true);

    templ.querySelector('.widgetControls__startStopButton').innerHTML = this.caption;
    this.innerHTML = '';
    this.appendChild(templ);
  }

}
