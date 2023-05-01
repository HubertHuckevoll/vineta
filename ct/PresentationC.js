import { BaseC }         from '/frontschweine/js/BaseC.js';

export class PresentationC extends BaseC
{
  constructor(evtEmt, views, models, subcontrollers)
  {
    super(evtEmt);

    this.views = views;
    this.models = models;
    this.subcontrollers = subcontrollers;

    this.automaticRestart = false;
    this.screenshotMode = false;

    this.mousemoveTimer = false;
  }

  async go()
  {
    let prefs = this.models.prefs.load();
    this.subcontrollers.rotator.setPrefs(prefs);
    this.views.widgetsView.update(prefs);

    try
    {
      let sheets = this.models.sheets.load();
      this.views.prefsView.drawSheets(sheets);

      let webcams = await this.models.webcams.load(sheets);
      this.subcontrollers.rotator.setWebcams(webcams);
      this.views.sidebarView.render(webcams);

      this.subcontrollers.rotator.start();
    }
    catch(err)
    {
      this.views.webcamView.logText(err.message);
    }
  }

  startStopOnButton(ev)
  {
    this.subcontrollers.rotator.toggle();
  }

  startStopOnSpacebar(ev)
  {
    if (ev.key == ' ')
    { // space bar
      this.subcontrollers.rotator.toggle();
      ev.preventDefault(); // if we omit this, the space bar press will trigger a scroll down
      return false;
    }
  }

  toggleSidebar(ev)
  {
    if (this.screenshotMode === true)
    {
      this.screenshotMode = false;
      this.views.widgetsView.showOverlays();
    }
    else
    {
      if (ev.target.classList.contains('webcam'))
      {
        this.views.sidebarView.toggleSidebar(this.subcontrollers.rotator.idx);
      }
    }
  }

  filterWebcams(ev)
  {
    this.subcontrollers.rotator.stop();
    let webcams = this.models.webcams.filter(ev.target.value);
    this.subcontrollers.rotator.setWebcams(webcams);
    this.views.sidebarView.render(webcams);
    this.views.sidebarView.scrollToTop();
  }

  filterWebcamsReset(ev)
  {
    this.views.sidebarView.resetFilterInput();
    this.subcontrollers.rotator.stop();
    let webcams = this.models.webcams.filterReset();
    this.subcontrollers.rotator.setWebcams(webcams);
    this.views.sidebarView.render(webcams);
    this.subcontrollers.rotator.start();
  }

  gotoCam(ev)
  {
    this.views.sidebarView.closeSidebarWebcamsCamActions();

    let idx = ev.target.parentNode.parentNode.getAttribute('data-idx');
    this.subcontrollers.rotator.goto(idx);
  }

  enableCam(ev)
  {
    var idx = ev.target.parentNode.getAttribute('data-idx');
    let webcams = this.models.webcams.enableCam(idx);
    this.subcontrollers.rotator.setWebcams(webcams);
    this.views.sidebarView.render(webcams);
  }

  disableCam(ev)
  {
    var idx = ev.target.parentNode.getAttribute('data-idx');
    let webcams = this.models.webcams.disableCam(idx);
    this.subcontrollers.rotator.setWebcams(webcams);
    this.views.sidebarView.render(webcams);
  }

  gotoPreviousCam(ev)
  {
    var idx = ev.target.parentNode.getAttribute('idx');
    this.subcontrollers.rotator.goto(idx);
  }

  enableScreenshotMode()
  {
    this.screenshotMode = true;
    this.views.widgetsView.hideOverlays();
  }

  prefsOpen()
  {
    let prefs = this.models.prefs.getPrefs();
    this.views.prefsView.drawPrefs(prefs);
    this.views.prefsView.prefsOpen();
  }

  onStart(ev)
  {
    this.views.widgetsView.setWidgetAttribute('controls', 'caption', 'Stop');
    this.views.widgetsView.setWidgetAttribute('clock', 'blinking', 'yes');
    this.views.widgetsView.logText('Starting');
  }

  onStop(ev)
  {
    this.views.widgetsView.setWidgetAttribute('controls', 'caption', 'Start');
    this.views.widgetsView.setWidgetAttribute('clock', 'blinking', 'no');
    this.views.widgetsView.logText('Stopped');
  }

  async onWebcamSwap(ev)
  {
    let nextCam =
    {
      idx: null,
      cam: null,
      lastCam: null,
      img: null
    };

    // grab next image
    nextCam.prefs = ev.detail.payload.prefs;
    nextCam.lastCam = ev.detail.payload.lastCam;
    nextCam.img = ev.detail.payload.img;
    nextCam.cam = ev.detail.payload.cam;
    nextCam.idx = ev.detail.payload.idx;

    if (nextCam.cam !== null)
    {
      // hide image
      await this.views.webcamView.webcamHide();

      // update widgets
      this.views.widgetsView.setWidgetAttribute('location', 'place', nextCam.cam.location);
      this.views.widgetsView.setWidgetAttribute('location', 'desc', nextCam.cam.description);
      this.views.widgetsView.setWidgetAttribute('location', 'url', nextCam.cam.homepage);
      this.views.widgetsView.setWidgetAttribute('map', 'place', nextCam.cam.location);

      // store "last cam"
      if ((nextCam.lastCam.url !== null) || (nextCam.lastCam.url !== null))
      {
        this.views.widgetsView.setWidgetAttribute('lastCam', 'url', nextCam.lastCam.url);
        this.views.widgetsView.setWidgetAttribute('lastCam', 'idx', nextCam.lastCam.idx);
      }

      // update sidebar
      this.views.sidebarView.setSidebarActiveCam(nextCam.idx);
      this.views.sidebarView.setSidebarCamColor(nextCam.cam, nextCam.idx);

      // show image
      await this.views.webcamView.webcamShow(nextCam);
    }
  }

  async onWebcamSwapFailed(ev)
  {
    let logMode = ev.detail.payload.logMode;
    let cam = ev.detail.payload.cam;
    let idx = ev.detail.payload.idx;
    let err = ev.detail.payload.err;

    let msg = `Failed loading image: "${cam.location} / ${cam.description}"\r\n`+
              `Homepage: ${cam.homepage}\r\n`+
              `URL: ${cam.url}\r\n`+
              `Reason: ${err.name}: ${err.message}\r\n`;

    switch (logMode)
    {
      case 'screen':
        this.views.widgetsView.logText(msg);
      break;
      case 'console':
        console.log(msg);
      break;
      case 'both':
        this.views.widgetsView.logText(msg);
        console.log(msg);
      break;
      case 'none':
      break;
    }

    this.views.sidebarView.setSidebarCamColor(cam, idx);
  }

  onMousemove(ev)
  {
    this.views.widgetsView.showWidgetsOnMousemove();
  }

  onConnectionLost()
  {
    if (this.subcontrollers.rotator.isRunning)
    {
      this.automaticRestart = true;
      this.subcontrollers.rotator.stop();
    }
  }

  onReconnect()
  {
    if (this.automaticRestart == true)
    {
      this.automaticRestart = false;
      this.subcontrollers.rotator.start();
    }
  }

  onDocumentVisibilityChange()
  {
    if (document.visibilityState == 'hidden')
    {
      if (this.subcontrollers.rotator.isRunning)
      {
        this.automaticRestart = true;
        this.subcontrollers.rotator.stop();
      }
    }
    else if (document.visibilityState == 'visible')
    {
      if (this.automaticRestart == true)
      {
        this.automaticRestart = false;
        this.subcontrollers.rotator.start();
      }
    }
  }
}
