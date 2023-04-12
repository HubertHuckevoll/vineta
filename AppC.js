import { BaseC } from '/frontschweine/js/BaseC.js';
import { FormoTabbox } from '/frontschweine/js/FormoTabbox.js';
import { FormoSlider } from '/frontschweine/js/FormoSlider.js';

import { VceLocationV } from './VceLocationV.js';
import { VceLogV } from './VceLogV.js';
import { VceMapV } from './VceMapV.js';
import { VceLastCamV } from './VceLastCamV.js';
import { VceControlsV } from './VceControlsV.js';
import { VceClockV } from './VceClockV.js';

import { SheetsM } from './SheetsM.js';
import { RotatorC } from './RotatorC.js';

import { PrefsM } from './PrefsM.js';
import { WebcamsM } from './WebcamsM.js';
import { VceSidebarV } from './VceSidebarV.js';
import { WidgetsC } from './WidgetsC.js';
import { PresentationC } from './PresentationC.js';
import { PresentationV } from './PresentationV.js';
import { PrefsC } from './PrefsC.js';
import { PrefsV } from './PrefsV.js';
import { CurtainX } from '/frontschweine/js/CurtainX.js';

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
    // install our service worker - we are basically an "online only" app,
    // but this way we gain some PWA capabilities
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

    this.anim = new CurtainX();

    // Init views
    this.views =
    {
      sidebarView: document.querySelector('.sidebar'),
      presentView: new PresentationV(this.anim),
      prefsView: new PrefsV(this.anim)
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