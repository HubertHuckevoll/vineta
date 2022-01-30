"use strict";

class VceClockV extends WidgetV
{
  constructor()
  {
    super();
    this.tid = null;
    this.shadow = this.attachShadow({mode: 'closed'});
    this.dots = null;
  }

  static get observedAttributes()
  {
    return ['blinking'];
  }

  connectedCallback()
  {
    this.render();
    this.dots = this.shadow.querySelector('.dots');
    this.clockTick();
  }

  attributeChangedCallback(name, oldValue, newValue)
  {
    if ((name === 'blinking') && (newValue == 'yes'))
    {
      this.blinkDots();
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

  async blinkDots()
  {
    let cssClasses =
    {
      showClass: 'showDots',
      hideClass: 'hideDots'
    }

    while (this.blinking == 'yes')
    {
      await this.hide(this.dots, cssClasses);
      await this.show(this.dots, cssClasses);
    }
  }

  render()
  {
    this.shadow.innerHTML = '<style>'+
                              '.showDots { transition: opacity 1s; opacity: 1; }'+
                              '.hideDots { transition: opacity 1s; opacity: 0; }'+
                            '</style>'+
                            '<div class="time">'+
                              '<span class="ch"></span><span class="dots">:</span><span class="cm"></span>'+
                            '</div>'+
                            '<div part="date" class="date"></div>';
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

    this.shadow.querySelector('.ch').innerHTML = ch;
    this.shadow.querySelector('.cm').innerHTML = cm;
    this.shadow.querySelector('.date').innerHTML = cd;
  }

}
