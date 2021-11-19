"use strict";

class VceClockV extends VceBaseV
{
  constructor()
  {
    super();
    this.tid = null;
  }

  static get observedAttributes()
  {
    let attrs = super.observedAttributes;
    attrs.push('blinking');

    return attrs;
  }

  connectedCallback()
  {
    this.render();
    this.clockTick();
  }

  attributeChangedCallback(name, oldValue, newValue)
  {
    super.attributeChangedCallback(name, oldValue, newValue);

    if ((name === 'blinking') && (newValue == 'yes'))
    {
      this.startDots();
    }
    else if ((name === 'blinking') && (newValue == 'no'))
    {
      this.stopDots();
    }
  }

  get blinking()
  {
    return this.getAttribute('blinking');
  }

  set blinking(trueFalse)
  {
    this.setAttribute('blinking', trueFalse);
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

  startDots()
  {
    var dotsEl = this.querySelector('.dots');

    dotsEl.addEventListener('transitionend', this.fadeDots.bind(this));
    dotsEl.style.opacity = "0"; // trigger fade out for 1s - see CSS: transition
  }

  stopDots()
  {
    var dotsEl = this.querySelector('.dots');

    dotsEl.removeEventListener('transitionend', this.fadeDots.bind(this));
    dotsEl.style.opacity = "1"; // trigger fade in for 1s - see CSS: transition
  }

  fadeDots(ev)
  {
    var dotsElStyle = this.querySelector('.dots').style;

    if (dotsElStyle.opacity == "0")
    {
      dotsElStyle.opacity = "1";
    }
    else
    {
      dotsElStyle.opacity = "0";
    }
  }

  render()
  {
    this.innerHTML = '<div class="time">'+
                       '<span class="ch"></span><span class="dots">:</span><span class="cm"></span>'+
                     '</div>'+
                     '<div class="date"></div>';
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


    this.querySelector('.ch').innerHTML = ch;
    this.querySelector('.cm').innerHTML = cm;
    this.querySelector('.date').innerHTML = cd;
  }

}

