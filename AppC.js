import { FormoTabbox }  from '/frontschweine/js/FormoTabbox.js';
import { FormoSlider }  from '/frontschweine/js/FormoSlider.js';
import { CurtainX }     from '/frontschweine/js/CurtainX.js';

import { VceLocationV } from './vce/VceLocationV.js';
import { VceLogV }      from './vce/VceLogV.js';
import { VceMapV }      from './vce/VceMapV.js';
import { VceLastCamV }  from './vce/VceLastCamV.js';
import { VceControlsV } from './vce/VceControlsV.js';
import { VceClockV }    from './vce/VceClockV.js';
import { VceSidebarV }  from './vce/VceSidebarV.js';

import { SheetsM }       from './md/SheetsM.js';
import { PrefsM }        from './md/PrefsM.js';
import { WebcamsM }      from './md/WebcamsM.js';
import { WebcamLoaderM } from './md/WebcamLoaderM.js';

import { BaseC }          from '/frontschweine/js/BaseC.js';
import { RotatorC }       from './ct/RotatorC.js';
import { WidgetsC }       from './ct/WidgetsC.js';
import { PresentationC }  from './ct/PresentationC.js';
import { PrefsC }         from './ct/PrefsC.js';

import { PrefsV }         from './vw/PrefsV.js';
import { PresentationV }  from './vw/PresentationV.js';


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
      rotator: new RotatorC(new WebcamLoaderM())
    }

    // Init controllers
    this.present = new PresentationC(this.views, this.models, this.subcontrollers);
    this.prefs = new PrefsC(this.views, this.models, this.subcontrollers);

    // load and go
    this.present.go();
  }
}

let vineta = new AppC();
window.addEventListener("DOMContentLoaded", vineta.load.bind(vineta));