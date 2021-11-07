"use strict";

class AppC extends BaseC
{

  constructor()
  {
    super();

    this.views = null;
    this.models = null;
    this.widgets = null;
    this.events = null;
    this.present = null;
    this.prefs = null;
  }

  load()
  {
    // initialize generic custom elements
    window.customElements.define('formo-slider', FormoSlider);
    window.customElements.define('formo-tabbox', FormoTabbox);

    // initialize specific custom elements
    window.customElements.define('vce-base', VceBaseV);
    window.customElements.define('vce-sidebar', VceSidebarV);
    window.customElements.define('vce-location', VceLocationV);
    window.customElements.define('vce-log', VceLogV);
    window.customElements.define('vce-map', VceMapV);
    window.customElements.define('vce-lastcam', VceLastCamV);
    window.customElements.define('vce-controls', VceControlsV);
    window.customElements.define('vce-clock', VceClockV);

    // Init views
    this.views =
    {
      sidebarView: document.getElementById('sidebar'),
      presentView: new PresentationV(),
      prefsView: new PrefsV()
    }

    // Init models
    this.models =
    {
      rotator: new RotatorM(),
      options: new OptionsM(),
      webcams: new WebcamsM(),
      sheets:  new SheetsM()
    }

    // Init controllers
    this.widgets = new WidgetsC();
    this.present = new PresentationC(this.views, this.models, this.widgets);
    this.prefs = new PrefsC(this.views, this.models, this.widgets);

    // load and go
    this.present.go();
  }
}

let vineta = new AppC();
window.addEventListener("DOMContentLoaded", vineta.load.bind(vineta));