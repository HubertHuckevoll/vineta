"use strict";

class VceControlsV extends VceBaseV
{
  constructor()
  {
    super();
  }

  static get observedAttributes()
  {
    let attrs = super.observedAttributes;
    attrs.push('caption');

    return attrs;
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
    super.attributeChangedCallback(name, oldValue, newValue);
    this.render();
  }

  connectedCallback()
  {
    this.render();
  }

  render()
  {
    this.innerHTML = '<button id="startStopButton" data-tip="Start / Stop">'+this.caption+'</button>'+
                     '<button id="prefsOpenButton" data-tip="Preferences">Preferences</button>'+
                     '<button id="screenshotModeButton" data-tip="Hide all overlays (screenshot mode)">Hide Widgets</button>';
  }

}
