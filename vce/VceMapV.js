import { Vce }      from './Vce.js';

export class VceMapV extends Vce
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

  render()
  {
    const templ = document.querySelector('#vceMapT').content.cloneNode(true);
    templ.querySelector('.widgetMap__image').setAttribute('src', this.transparentGIF);
    this.appendChild(templ);
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
        var mapUrl = `https://static-maps.yandex.ru/1.x/?lang=de_DE&ll=${loc[0].lon},${loc[0].lat}&size=350,350&z=10&l=map&pt=${loc[0].lon},${loc[0].lat},vkgrm`;
        this.setImage(mapUrl);

        const weatherResp = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${loc[0].lat}&longitude=${loc[0].lon}&current_weather=true`);
        const weather = await weatherResp.json()
        const currentWeather = weather.current_weather;
        this.setWeather(currentWeather);

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

  setWeather(weather)
  {
    this.querySelector('.widgetMap__temp').innerHTML = weather.temperature;
    this.querySelector('.widgetMap__time').innerHTML = new Date(weather.time).toLocaleTimeString('de-DE', {timeStyle: 'short'});
    //this.querySelector('.widgetMap__weathercode').innerHTML = weather.weathercode;
    //this.querySelector('.widgetMap__winddirection').innerHTML = weather.winddirection;
    this.querySelector('.widgetMap__windspeed').innerHTML = weather.windspeed;
  }
}
