"use strict";

class VceMapV extends FormoBase
{
  constructor()
  {
    super();
    this.transparentGIF = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    this.mapUrl = this.transparentGIF;
    this.cssClasses = {'showClass': 'widgetMap--imageVisible', 'hideClass': 'widgetMap--imageInvisible'}
    this.render();
  }

  static get observedAttributes()
  {
    return ['place', 'visible'];
  }

  get place()
  {
    return this.getAttribute('place');
  }

  set place(txt)
  {
    this.setAttribute('place', txt);
  }

  get visible()
  {
    return this.getAttribute('visible');
  }

  set visible(yesNo)
  {
    this.setAttribute('visible', yesNo);
  }

  attributeChangedCallback(name, oldValue, newValue)
  {
    if (
        (name == 'place') && (this.getAttribute('visible') == 'yes') ||
        (name == 'visible') && (newValue == 'yes')
       )
    {
      this.fetchMap();
    }
    else
    {
      this.hide('.widgetMapImage', this.cssClasses);
    }
  }

  async fetchMap()
  {
    if (this.place !== '')
    {
      try
      {
        const response = await fetch('https://nominatim.openstreetmap.org/search?format=json&polygon=0&q='+encodeURIComponent(this.place));
        const loc = await response.json();
        this.mapUrl = 'https://static-maps.yandex.ru/1.x/?lang=de_DE&ll='+loc[0].lon+','+loc[0].lat+'&size=350,350&z=10&l=map&pt='+loc[0].lon+','+loc[0].lat+',vkgrm';
        this.update();
      }
      catch(err)
      {
        this.mapUrl = this.transparentGIF;
        this.update();
      };
    }
  }

  render()
  {
    this.innerHTML = '<img class="widgetMapImage" src="'+this.transparentGIF+'">';
  }

  update()
  {
    this.style.display = (this.mapUrl == this.transparentGIF) ? 'none' : '';

    let elem = this.querySelector('.widgetMapImage');
    elem.onload = () => this.show(elem, this.cssClasses);
    elem.src = this.mapUrl;
  }
}
