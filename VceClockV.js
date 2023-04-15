import { WidgetV } from './WidgetV.js';

export class VceClockV extends WidgetV
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
      this.shadow.querySelector('.dots').classList.add('blinking');
    }
    else if ((name === 'blinking') && (newValue == 'no'))
    {
      this.shadow.querySelector('.dots').classList.remove('blinking');
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
    this.shadow.innerHTML = `<style>
                              @keyframes blink
                              {
                                0% {
                                  opacity: 1;
                                }
                                50% {
                                  opacity: 0;
                                }
                                100% {
                                  opacity: 1;
                                }
                              }
                              .blinking {
                                animation: blink 2s infinite;
                              }
                             </style>

                             <div part="dateTime" class="dateTime">
                               <div part="date" class="date"></div>
                               <div part="time" class="time">
                                 <span class="ch"></span><span class="dots">:</span><span class="cm"></span>
                               </div>
                             </div>`;

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
