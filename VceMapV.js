"use strict";

class VceMapV extends WidgetV
{
  constructor()
  {
    super();
    this.isVisible = null;
    this.transparentGIF = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    this.render();
  }

  static get observedAttributes()
  {
    return ['place'];
  }

  get place()
  {
    return this.getAttribute('place');
  }

  set place(txt)
  {
    this.setAttribute('place', txt);
  }

  showElement(opacity)
  {
    this.isVisible = true;
    this.fetchMap();
    super.showElement(opacity);
  }

  hideElement(opacity)
  {
    this.isVisible = false;
    super.hideElement(opacity);
  }

  render()
  {
    this.innerHTML = '<img class="widgetMap__image" src="'+this.transparentGIF+'">';
  }

  attributeChangedCallback(name, oldValue, newValue)
  {
    if ((name == 'place') && (this.isVisible == true))
    {
      this.fetchMap();
    }
  }

  async fetchMap()
  {
    if (this.place !== '')
    {
      this.setSpinner();
      try
      {
        const response = await fetch('https://nominatim.openstreetmap.org/search?format=json&polygon=0&q='+encodeURIComponent(this.place));
        const loc = await response.json();
        var mapUrl = 'https://static-maps.yandex.ru/1.x/?lang=de_DE&ll='+loc[0].lon+','+loc[0].lat+'&size=350,350&z=10&l=map&pt='+loc[0].lon+','+loc[0].lat+',vkgrm';
        this.setImage(mapUrl);
      }
      catch(err)
      {
        let mapUrl = this.transparentGIF;
        this.setImage(mapUrl);
      };
    }
  }

  setSpinner()
  {
    let elem = this.querySelector('.widgetMap__image');
    elem.src = this.transparentGIF;

    elem.classList.add('widgetMap__image--loading');
  }

  setImage(mapUrl)
  {
    let elem = this.querySelector('.widgetMap__image');

    elem.onload = () =>
    {
      elem.classList.remove('widgetMap--loading');
    }

    elem.src = mapUrl;
  }
}
