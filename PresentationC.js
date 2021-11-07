"use strict";

class PresentationC extends BaseC
{
  constructor(views, models, widgets)
  {
    super();

    this.views = views;
    this.models = models;
    this.widgets = widgets;

    this.automaticRestart = false;

    this.screenshotMode = false;

    // wire ui elements
    this.on('click', '#startStopButton',       this.startStopOnButton.bind(this));
    this.on('click', '#screenshotModeButton',  this.enableScreenshotMode.bind(this));
    this.on('click', '#webcam',                this.toggleSidebar.bind(this));
    this.on('click', '#widgetLastCam img',     this.gotoPreviousCam.bind(this));
    this.on('keyup',                           this.startStopOnSpacebar.bind(this));
    this.on('input', '#sidebarSearch',         this.filterWebcams.bind(this));
    this.on('click', '#sidebarFilterResetBut', this.filterWebcamsReset.bind(this));
    this.on('click', '.sidebarWebcam summary', this.gotoCam.bind(this));
    this.on('click', '.disableBut',            this.disableCam.bind(this));
    this.on('click', '.enableBut',             this.enableCam.bind(this));
    this.on('click', '#prefsOpenButton',       this.prefsOpen.bind(this));

    // widgets
    this.on('widgetsVisibilityChange', this.views.presentView.setWidgetVisibility.bind(this.views.presentView));

    // webcam
    this.on('transitionend', '#webcam', this.views.presentView.webcamSwapFinish.bind(this.views.presentView));

    // rotator
    this.on('rotatorStart', this.views.presentView.start.bind(this.views.presentView));
    this.on('rotatorStop', this.views.presentView.stop.bind(this.views.presentView));
    this.on('rotatorSwitch', this.views.presentView.webcamSwap.bind(this.views.presentView));
    this.on('rotatorSwitchError', this.views.presentView.webcamSwapFailed.bind(this.views.presentView));
    this.on('log', this.views.presentView.log.bind(this.views.presentView));

    // Sidebar
    this.on('rotatorImageLoadStart', this.views.sidebarView.startLoadingIndicator.bind(this.views.sidebarView));
    this.on('rotatorImageLoadEnd', this.views.sidebarView.stopLoadingIndicator.bind(this.views.sidebarView));

    // start / stop on (loosing / regaining) visibility
    this.on('visibilitychange', this.onDocumentVisibilityChange.bind(this));

    // stop on loosing internet connection
    this.on('offline', this.onConnectionLost.bind(this));

    // start on regaining internet connection
    this.on('online', this.onReconnect.bind(this));
  }

  async go()
  {
    let prefs = this.models.options.load();
    this.models.rotator.setPrefs(prefs);
    this.widgets.update(prefs);
    this.views.presentView.setWidgetsOpacity(prefs);

    let sheets = this.models.sheets.load();
    let webcams = await this.models.webcams.load(sheets);
    this.models.rotator.setWebcams(webcams);
    this.views.sidebarView.render(webcams);

    this.models.rotator.start();
  }

  filterWebcams(ev)
  {
    this.models.rotator.stop();
    let webcams = this.models.webcams.filter(ev.target.value);
    this.models.rotator.setWebcams(webcams);
    this.views.sidebarView.render(webcams);
  }

  filterWebcamsReset(ev)
  {
    document.getElementById('sidebarSearch').value = '';
    this.models.rotator.stop();
    let webcams = this.models.webcams.filterReset();
    this.models.rotator.setWebcams(webcams);
    this.views.sidebarView.render(webcams);
    this.models.rotator.start();
  }

  gotoCam(ev)
  {
    this.views.sidebarView.closeSidebarWebcamsCamActions();

    if (ev.target.parentNode.parentNode.parentNode.id == 'sidebarWebcams')
    {
      let idx = ev.target.parentNode.parentNode.getAttribute('data-idx');
      this.models.rotator.goto(idx);
    }
  }

  enableCam(ev)
  {
    var idx = ev.target.parentNode.getAttribute('data-idx');
    let webcams = this.models.webcams.enableCam(idx);
    this.models.rotator.setWebcams(webcams);
    this.views.sidebarView.render(webcams);
  }

  disableCam(ev)
  {
    var idx = ev.target.parentNode.getAttribute('data-idx');
    let webcams = this.models.webcams.disableCam(idx);
    this.models.rotator.setWebcams(webcams);
    this.views.sidebarView.render(webcams);
  }

  gotoPreviousCam(ev)
  {
    var idx = ev.target.parentNode.getAttribute('idx');
    this.models.rotator.goto(idx);
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
      if (ev.target.id === 'webcam')
      {
        this.views.sidebarView.toggleSidebar(this.models.rotator.idx);
      }
    }
  }

  startStopOnSpacebar(ev)
  {
    if (ev.key == ' ')
    { // space bar
      this.models.rotator.toggle();
      ev.preventDefault(); // if we omit this line, the space bar press will trigger a scroll down
      return false;
    }
  }

  startStopOnButton(ev)
  {
    this.models.rotator.toggle();
  }

  onConnectionLost()
  {
    if (this.models.rotator.isRunning)
    {
      this.automaticRestart = true;
      this.models.rotator.stop();
    }
  }

  onReconnect()
  {
    if (this.automaticRestart == true)
    {
      this.automaticRestart = false;
      this.models.rotator.start();
    }
  }

  onDocumentVisibilityChange()
  {
    if (document.visibilityState == 'hidden')
    {
      if (this.models.rotator.isRunning)
      {
        this.automaticRestart = true;
        this.models.rotator.stop();
      }
    }
    else if (document.visibilityState == 'visible')
    {
      if (this.automaticRestart == true)
      {
        this.automaticRestart = false;
        this.models.rotator.start();
      }
    }
  }

  prefsOpen()
  {
    let prefs = this.models.options.getPrefs();
    this.views.prefsView.drawPrefs(prefs);
    this.views.prefsView.prefsOpen();
  }
}
