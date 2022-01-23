"use strict";

class VceLastCamV extends FormoBase
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
    this.innerHTML = (this.url !== "undefined") ? '<img class="widgetLastCam__image" src="' + this.url + '">' : '';
  }
}
