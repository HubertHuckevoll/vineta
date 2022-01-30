"use strict";

class VceLocationV extends WidgetV
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
    this.innerHTML = '<div class="widgetLocation__desc"><a class="widgetLocation__link" href="'+this.url+'" target="_blank">'+this.desc+'</a></div>'+
                     '<div class="widgetLocation__place">'+this.place+'</div>';
  }

}
