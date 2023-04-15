import { WidgetV }      from './WidgetV.js';

export class VceControlsV extends WidgetV
{
  constructor()
  {
    super();
  }

  static get observedAttributes()
  {
    return ['caption'];
  }

  get caption()
  {
    return this.getAttribute('caption') || 'Caption';
  }

  set caption(txt)
  {
    this.setAttribute('caption', txt);
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
    this.innerHTML = '<button class="widgetControls__startStopButton      widgetControls__button" data-tip="Start / Stop">'+this.caption+'</button>'+
                     '<button class="widgetControls__prefsOpenButton      widgetControls__button" data-tip="Preferences">Preferences</button>'+
                     '<button class="widgetControls__screenshotModeButton widgetControls__button" data-tip="Hide all overlays (screenshot mode)">Hide Widgets</button>';
  }

}
