"use strict";

class PresentationC extends BaseC
{
  constructor(views, models, subcontrollers)
  {
    super();

    this.views = views;
    this.models = models;
    this.subcontrollers = subcontrollers;

    this.automaticRestart = false;

    this.screenshotMode = false;

    // start / stop
    this.on('keyup',                                            this.startStopOnSpacebar.bind(this));
    this.on('click', '.widgetControls__startStopButton',        this.startStopOnButton.bind(this));

    // start / stop on (loosing / regaining) visibility
    this.on('visibilitychange', this.onDocumentVisibilityChange.bind(this));

    // stop on loosing internet connection
    this.on('offline', this.onConnectionLost.bind(this));

    // start on regaining internet connection
    this.on('online', this.onReconnect.bind(this));

    //open / close ui elements
    this.on('click', '.widgetControls__prefsOpenButton',        this.prefsOpen.bind(this));
    this.on('click', '.widgetControls__screenshotModeButton',   this.enableScreenshotMode.bind(this));
    this.on('click', '.webcam',                                 this.toggleSidebar.bind(this));

    // sidebar actions
    this.on('input', '.sidebarFilter__input',                   this.filterWebcams.bind(this));
    this.on('click', '.sidebarFilter__clearButton',             this.filterWebcamsReset.bind(this));
    this.on('click', '.sidebarWebcam__summary',                 this.gotoCam.bind(this));
    this.on('click', '.sidebarWebcamCamActions__disableButton', this.disableCam.bind(this));
    this.on('click', '.sidebarWebcamCamActions__enableButton',  this.enableCam.bind(this));

    // last cam
    this.on('click', '.widgetLastCam__image',                   this.gotoPreviousCam.bind(this));

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
  }

  async go()
  {
    let prefs = this.models.prefs.load();
    this.subcontrollers.rotator.setPrefs(prefs);
    this.subcontrollers.widgets.update(prefs);
    this.views.presentView.setWidgetsOpacity(prefs);

    let sheets = this.models.sheets.load();
    let webcams = await this.models.webcams.load(sheets);
    this.subcontrollers.rotator.setWebcams(webcams);
    this.views.sidebarView.render(webcams);

    this.subcontrollers.rotator.start();
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
    document.querySelector('.sidebarFilter__input').value = '';
    this.subcontrollers.rotator.stop();
    let webcams = this.models.webcams.filterReset();
    this.subcontrollers.rotator.setWebcams(webcams);
    this.views.sidebarView.render(webcams);
    this.subcontrollers.rotator.start();
  }

  gotoCam(ev)
  {
    this.views.sidebarView.closeSidebarWebcamsCamActions();

    if (ev.target.parentNode.parentNode.parentNode.classList.contains('sidebarWebcams'))
    {
      let idx = ev.target.parentNode.parentNode.getAttribute('data-idx');
      this.subcontrollers.rotator.goto(idx);
    }
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
    this.views.presentView.hideOverlays();
  }

  toggleSidebar(ev)
  {
    if (this.screenshotMode === true)
    {
      this.screenshotMode = false;
      this.views.presentView.showOverlays();
    }
    else
    {
      if (ev.target.classList.contains('webcam'))
      {
        this.views.sidebarView.toggleSidebar(this.subcontrollers.rotator.idx);
      }
    }
  }

  startStopOnSpacebar(ev)
  {
    if (ev.key == ' ')
    { // space bar
      this.subcontrollers.rotator.toggle();
      ev.preventDefault(); // if we omit this formoTab__line, the space bar press will trigger a scroll down
      return false;
    }
  }

  startStopOnButton(ev)
  {
    this.subcontrollers.rotator.toggle();
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

  prefsOpen()
  {
    let prefs = this.models.prefs.getPrefs();
    this.views.prefsView.drawPrefs(prefs);
    this.views.prefsView.prefsOpen();
  }
}
