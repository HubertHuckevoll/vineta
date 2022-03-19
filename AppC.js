"use strict";

class AppC extends BaseC
{

  constructor()
  {
    super();

    this.views = null;
    this.models = null;
    this.subcontrollers = null;
    this.events = null;
    this.present = null;
    this.prefs = null;
    this.anim = null;
  }

  load()
  {
    // install our service worker - we are basically an "online only" app
    if ('serviceWorker' in navigator)
    {
      navigator.serviceWorker.register('./sw.js');
    }

    // initialize generic custom elements
    window.customElements.define('formo-slider', FormoSlider);
    window.customElements.define('formo-tabbox', FormoTabbox);

    // initialize specific custom elements
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
      sidebarView: document.querySelector('.sidebar'),
      presentView: new PresentationV(),
      prefsView: new PrefsV()
    }

    // Init models
    this.models =
    {
      prefs: new PrefsM(),
      webcams: new WebcamsM(),
      sheets:  new SheetsM()
    }

    this.subcontrollers =
    {
      widgets: new WidgetsC(),
      rotator: new RotatorC()
    }

    // Init controllers
    this.present = new PresentationC(this.views, this.models, this.subcontrollers);
    this.prefs = new PrefsC(this.views, this.models, this.subcontrollers);

    // load and go
    this.present.go();
  }
}

var vineta = new AppC();
window.addEventListener("DOMContentLoaded", vineta.load.bind(vineta));