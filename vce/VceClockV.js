import { Vce }      from './Vce.js';

export class VceClockV extends Vce
{
  constructor()
  {
    super();
    this.tid = null;
    this.dots = null;
  }

  static get observedAttributes()
  {
    return ['blinking'];
  }

  connectedCallback()
  {
    this.render();
    this.dots = this.querySelector('.widgetClock__timeDots');
    this.clockTick();
  }

  attributeChangedCallback(name, oldValue, newValue)
  {
    if ((name === 'blinking') && (newValue == 'yes'))
    {
      this.dots.classList.add('blinking');
    }
    else if ((name === 'blinking') && (newValue == 'no'))
    {
      this.dots.classList.remove('blinking');
    }
  }

  get blinking()
  {
    return this.getAttribute('blinking');
  }

  set blinking(yesNo)
  {
    this.setAttribute('blinking', yesNo);
  }

  clockTick(refresh)
  {
    if (refresh === undefined)
    {
      refresh = 0;
    }
    else
    {
      refresh = 60 * 1000;
    }

    this.tid = setTimeout(() =>
      {
        this.update();
        this.clockTick(refresh);
      },
      refresh
    );
  }

  render()
  {
    const templ = document.querySelector('#vceClockT').content.cloneNode(true);
    this.appendChild(templ);
    this.update();
  }

  update()
  {
    var dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var t = new Date();
    var ch = t.getHours();
    var cm = t.getMinutes();
    var cd = null;

    ch = (ch < 10) ? '0'+ch : ch;
    cm = (cm < 10) ? '0'+cm : cm;
    cd = t.toLocaleDateString({}, dateOptions);

    this.querySelector('.widgetClock__timeH').innerHTML = ch;
    this.querySelector('.widgetClock__timeM').innerHTML = cm;
    this.querySelector('.widgetClock__date').innerHTML = cd;
  }

}
