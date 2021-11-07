"use strict";

class VceMapV extends VceBaseV
{
  constructor()
  {
    super();
    this.mapUrl = '/frontschweine/assets/empty.png';
  }

  static get observedAttributes()
  {
    let attrs = super.observedAttributes;
    attrs.push('place');

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

  attributeChangedCallback(name, oldValue, newValue)
  {
    super.attributeChangedCallback(name, oldValue, newValue);

    if (this.getAttribute('visible') == 'yes')
    {
      this.fetchMap();
    }
  }

  async fetchMap()
  {
    var place = this.getAttribute('place');
    if (place !== '')
    {
      try
      {
        const response = await fetch('https://nominatim.openstreetmap.org/search?format=json&polygon=0&q='+encodeURIComponent(place));
        const loc = await response.json();
        this.mapUrl = 'https://static-maps.yandex.ru/1.x/?lang=de_DE&ll='+loc[0].lon+','+loc[0].lat+'&size=350,350&z=10&l=map&pt='+loc[0].lon+','+loc[0].lat+',vkgrm';
        this.render();
      }
      catch(err)
      {
        this.mapUrl = '/frontschweine/assets/empty.png';
        this.render();
      };
    }
  }

  render()
  {
    this.style.display = (this.mapUrl == '/frontschweine/assets/empty.png') ? 'none' : '';
    this.innerHTML = '<img class="widgetMapImage" src="'+this.mapUrl+'">';
  }
}
