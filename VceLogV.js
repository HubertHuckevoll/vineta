"use strict";

class VceLogV extends VceBaseV
{
  constructor()
  {
    super();
  }

  static get observedAttributes()
  {
    let attrs = super.observedAttributes;
    attrs.push('text');

    return attrs;
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
    super.attributeChangedCallback(name, oldValue, newValue);
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
