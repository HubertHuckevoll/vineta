"use strict";

class VceLocationV extends VceBaseV
{
  constructor()
  {
    super();
  }

  static get observedAttributes()
  {
    let attrs = super.observedAttributes;
    attrs.push('place');
    attrs.push('desc');
    attrs.push('url');

    return attrs;
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
    super.attributeChangedCallback(name, oldValue, newValue);
    this.render();
  }

  connectedCallback()
  {
    this.render();
  }

  render()
  {
    this.innerHTML = '<div class="widgetLocationDesc"><a href="'+this.url+'" target="_blank">'+this.desc+'</a></div>'+
                     '<div class="widgetLocationPlace">'+this.place+'</div>';
  }

}
