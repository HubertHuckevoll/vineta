import { FormoTabbox }  from '/frontschweine/js/FormoTabbox.js';
import { FormoSlider }  from '/frontschweine/js/FormoSlider.js';
import { CurtainX }     from '/frontschweine/js/CurtainX.js';

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

import { AppR }           from '/frontschweine/js/AppR.js';

import { RotatorC }       from './ct/RotatorC.js';
import { WidgetsC }       from './ct/WidgetsC.js';
import { PresentationC }  from './ct/PresentationC.js';
import { PrefsC }         from './ct/PrefsC.js';

import { PrefsV }         from './vw/PrefsV.js';
import { PresentationV }  from './vw/PresentationV.js';
import { SidebarV }       from './vw/SidebarV.js';

class VinetaR extends AppR
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

    // initialize app specific custom elements
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
      sidebarView: new SidebarV(this.anim),
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

    // init subcontrollers
    this.subcontrollers =
    {
      widgets: new WidgetsC(),
      rotator: new RotatorC(new WebcamLoaderM())
    }

    // Init controllers
    this.present = new PresentationC(this.views, this.models, this.subcontrollers);
    this.prefs = new PrefsC(this.views, this.models, this.subcontrollers);

    // event routing for presentation

    // start / stop
    this.on('keyup', this.present.startStopOnSpacebar.bind(this.present));
    this.on('click', '.widgetControls__startStopButton', this.present.startStopOnButton.bind(this.present));

    // start / stop on (loosing / regaining) visibility
    this.on('visibilitychange', this.present.onDocumentVisibilityChange.bind(this.present));

    // stop on loosing internet connection
    this.on('offline', this.present.onConnectionLost.bind(this.present));

    // start on regaining internet connection
    this.on('online', this.present.onReconnect.bind(this.present));

    //open / close ui elements
    this.on('click', '.widgetControls__prefsOpenButton', this.present.prefsOpen.bind(this.present));
    this.on('click', '.widgetControls__screenshotModeButton', this.present.enableScreenshotMode.bind(this.present));
    this.on('click', '.webcam', this.present.toggleSidebar.bind(this.present));

    // sidebar actions
    this.on('input', '.sidebarFilter__input', this.present.filterWebcams.bind(this.present));
    this.on('click', '.sidebarFilter__clearButton', this.present.filterWebcamsReset.bind(this.present));
    this.on('click', '.sidebarWebcam__summary', this.present.gotoCam.bind(this.present));
    this.on('click', '.sidebarWebcamCamActions__disableButton', this.present.disableCam.bind(this.present));
    this.on('click', '.sidebarWebcamCamActions__enableButton', this.present.enableCam.bind(this.present));

    // last cam
    this.on('click', '.widgetLastCam__image', this.present.gotoPreviousCam.bind(this.present));

    // widgets
    this.on('widgetsVisibilityChange', this.views.presentView.setWidgetVisibility.bind(this.views.presentView));

    // rotator
    this.on('rotatorStart', this.views.presentView.start.bind(this.views.presentView));
    this.on('rotatorStop', this.views.presentView.stop.bind(this.views.presentView));
    this.on('rotatorSwitch', this.views.presentView.webcamSwap.bind(this.views.presentView));
    this.on('rotatorSwitchError', this.views.presentView.webcamSwapFailed.bind(this.views.presentView));
    this.on('rotatorImageLoadStart', this.views.sidebarView.startLoadingIndicator.bind(this.views.sidebarView));
    this.on('rotatorImageLoadEnd', this.views.sidebarView.stopLoadingIndicator.bind(this.views.sidebarView));

    // any log event
    this.on('log', this.views.presentView.log.bind(this.views.presentView));


    // event routing for pref ui elements
    this.on('click', '.prefsCloseButton',                     this.prefs.prefsClose.bind(this.prefs));
    this.on('click', '.prefsSheetsAddButton',                 this.prefs.prefsSheetsAddButton.bind(this.prefs));
    this.on('click', '.prefsSheetsEnabledCheckbox',           this.prefs.prefsSheetsEnabledCheckbox.bind(this.prefs));
    this.on('click', '.prefsSheetsRemoveLink',                this.prefs.prefsSheetsRemoveLink.bind(this.prefs));
    this.on('click', '.prefsSheetsEditLink',                  this.prefs.prefsSheetsEditLink.bind(this.prefs));
    this.on('change',   '.prefsSceneTabPresentation select',  this.prefs.prefsSelectChange.bind(this.prefs));
    this.on('formoSliderChange', '.prefsSceneTabPresentation .formoSlider', this.prefs.prefsSliderChange.bind(this.prefs));
    this.on('click',  '#prefsExpSheets',                      this.prefs.prefsExpSheets.bind(this.prefs));
    this.on('click',  '#prefsImpSheetsSelect',                this.prefs.prefsImpSheetsSelect.bind(this.prefs));
    this.on('change', '#prefsImpSheetsFS',                    this.prefs.prefsImpSheetsFS.bind(this.prefs));
    this.on('change', '#prefsProxy',                          this.prefs.prefsProxyChanged.bind(this.prefs));

    // these come from our pref model
    this.on('sheetsChange', this.views.prefsView.drawSheets.bind(this.views.prefsView));
    this.on('sheetsError', this.views.prefsView.error.bind(this.views.prefsView));


    // event routing for Widgets
    this.on('mousemove', null, this.subcontrollers.widgets.onMousemove.bind(this.subcontrollers.widgets));

    // load and go
    this.present.go();
  }
}

let vineta = new VinetaR();
window.addEventListener("DOMContentLoaded", vineta.load.bind(vineta));