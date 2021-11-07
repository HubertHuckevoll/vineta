"use strict";

class VceLastCamV extends VceBaseV
{
  constructor()
  {
    super();
  }

  static get observedAttributes()
  {
    let attrs = super.observedAttributes;
    attrs.push('url');
    attrs.push('idx');

    return attrs;
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
    super.attributeChangedCallback(name, oldValue, newValue);

    if (name == 'url')
    {
      this.render();
    }
  }

  render()
  {
    this.innerHTML = (this.url !== "undefined") ? '<img src="' + this.url + '">' : '';
  }
}
