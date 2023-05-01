import { FormoTabbox }  from '/frontschweine/formo/FormoTabbox.js';
import { FormoSlider }  from '/frontschweine/formo/FormoSlider.js';

import { CurtainX }     from '/frontschweine/js/CurtainX.js';
import { EventEmit }    from '/frontschweine/js/EventEmit.js';

import { VceLocationV } from './vce/VceLocationV.js';
import { VceLogV }      from './vce/VceLogV.js';
import { VceMapV }      from './vce/VceMapV.js';
import { VceLastCamV }  from './vce/VceLastCamV.js';
import { VceControlsV } from './vce/VceControlsV.js';
import { VceClockV }    from './vce/VceClockV.js';

import { SheetsM }       from './md/SheetsM.js';
import { PrefsM }        from './md/PrefsM.js';
import { WebcamsM }      from './md/WebcamsM.js';
import { WebcamLoaderM } from './md/WebcamLoaderM.js';

import { RotatorC }       from './ct/RotatorC.js';
import { PresentationC }  from './ct/PresentationC.js';
import { PrefsC }         from './ct/PrefsC.js';

import { WidgetsV }       from './vw/WidgetsV.js';
import { PrefsV }         from './vw/PrefsV.js';
import { WebcamV }        from './vw/WebcamV.js';
import { SidebarV }       from './vw/SidebarV.js';

import { AppR }           from '/frontschweine/js/AppR.js';


class VinetaR extends AppR
{

  constructor()
  {
    super();

    this.views = null;
    this.models = null;
    this.subcontrollers = null;
    this.events = null;
    this.presentC = null;
    this.prefsC = null;
    this.anim = null;
    this.evtEmt = null;
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

    // initialize app specific custom elements
    window.customElements.define('vce-location', VceLocationV);
    window.customElements.define('vce-log', VceLogV);
    window.customElements.define('vce-map', VceMapV);
    window.customElements.define('vce-lastcam', VceLastCamV);
    window.customElements.define('vce-controls', VceControlsV);
    window.customElements.define('vce-clock', VceClockV);

    this.anim = new CurtainX();
    this.evtEmt = new EventEmit();

    // Init views
    this.views =
    {
      widgetsView: new WidgetsV(this.evtEmt, this.anim),
      sidebarView: new SidebarV(this.evtEmt, this.anim),
      webcamView:  new WebcamV(this.evtEmt, this.anim),
      prefsView:   new PrefsV(this.evtEmt, this.anim)
    }

    // Init models
    this.models =
    {
      prefs:   new PrefsM(this.evtEmt),
      webcams: new WebcamsM(this.evtEmt),
      sheets:  new SheetsM(this.evtEmt)
    }

    // init subcontrollers
    this.subcontrollers =
    {
      rotator: new RotatorC(this.evtEmt, new WebcamLoaderM(this.evtEmt))
    }

    // Init controllers
    this.presentC = new PresentationC(this.evtEmt, this.views, this.models, this.subcontrollers);
    this.prefsC = new PrefsC(this.evtEmt, this.views, this.models, this.subcontrollers);

    // event routing for presentation

    // start / stop
    this.on('keyup', this.presentC.startStopOnSpacebar.bind(this.presentC));
    this.on('click', '.widgetControls__startStopButton', this.presentC.startStopOnButton.bind(this.presentC));

    // start / stop on (loosing / regaining) visibility
    this.on('visibilitychange', this.presentC.onDocumentVisibilityChange.bind(this.presentC));

    // mousemove event routing for Widgets
    this.on('mousemove', null, this.presentC.onMousemove.bind(this.presentC));

    // stop on loosing internet connection
    this.on('offline', this.presentC.onConnectionLost.bind(this.presentC));

    // start on regaining internet connection
    this.on('online', this.presentC.onReconnect.bind(this.presentC));

    // open / close ui elements
    this.on('click', '.widgetControls__prefsOpenButton', this.presentC.prefsOpen.bind(this.presentC));
    this.on('click', '.widgetControls__screenshotModeButton', this.presentC.enableScreenshotMode.bind(this.presentC));
    this.on('click', '.webcam', this.presentC.toggleSidebar.bind(this.presentC));

    // sidebar actions
    this.on('input', '.sidebarFilter__input', this.presentC.filterWebcams.bind(this.presentC));
    this.on('click', '.sidebarFilter__clearButton', this.presentC.filterWebcamsReset.bind(this.presentC));
    this.on('click', '.sidebarWebcam__summary', this.presentC.gotoCam.bind(this.presentC));
    this.on('click', '.sidebarWebcamCamActions__disableButton', this.presentC.disableCam.bind(this.presentC));
    this.on('click', '.sidebarWebcamCamActions__enableButton', this.presentC.enableCam.bind(this.presentC));

    // last cam
    this.on('click', '.widgetLastCam__image', this.presentC.gotoPreviousCam.bind(this.presentC));

    // rotator
    this.on('rotatorStart', this.presentC.onStart.bind(this.presentC));
    this.on('rotatorStop', this.presentC.onStop.bind(this.presentC));
    this.on('rotatorSwitch', this.presentC.onWebcamSwap.bind(this.presentC));
    this.on('rotatorSwitchError', this.presentC.onWebcamSwapFailed.bind(this.presentC));
    this.on('rotatorImageLoadStart', this.views.sidebarView.startLoadingIndicator.bind(this.views.sidebarView));
    this.on('rotatorImageLoadEnd', this.views.sidebarView.stopLoadingIndicator.bind(this.views.sidebarView));

    // event routing for pref ui elements
    this.on('click', '.prefsCloseButton',                     this.prefsC.prefsClose.bind(this.prefsC));
    this.on('click', '.prefsSheetsAddButton',                 this.prefsC.prefsSheetsAddButton.bind(this.prefsC));
    this.on('click', '.prefsSheetsEnabledCheckbox',           this.prefsC.prefsSheetsEnabledCheckbox.bind(this.prefsC));
    this.on('click', '.prefsSheetsRemoveLink',                this.prefsC.prefsSheetsRemoveLink.bind(this.prefsC));
    this.on('click', '.prefsSheetsEditLink',                  this.prefsC.prefsSheetsEditLink.bind(this.prefsC));
    this.on('change',   '.prefsSceneTabPresentation select',  this.prefsC.prefsSelectChange.bind(this.prefsC));
    this.on('formoSliderChange', '.prefsSceneTabPresentation .formoSlider', this.prefsC.prefsSliderChange.bind(this.prefsC));
    this.on('click',  '#prefsExpSheets',                      this.prefsC.prefsExpSheets.bind(this.prefsC));
    this.on('click',  '#prefsImpSheetsSelect',                this.prefsC.prefsImpSheetsSelect.bind(this.prefsC));
    this.on('change', '#prefsImpSheetsFS',                    this.prefsC.prefsImpSheetsFS.bind(this.prefsC));
    this.on('change', '#prefsProxy',                          this.prefsC.prefsProxyChanged.bind(this.prefsC));

    // any log event
    this.on('log', this.views.widgetsView.log.bind(this.views.widgetsView));

    // load and go
    this.presentC.go();
  }
}

let vineta = new VinetaR();
window.addEventListener("DOMContentLoaded", vineta.load.bind(vineta));