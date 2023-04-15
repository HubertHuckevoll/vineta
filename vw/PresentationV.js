import { BaseV }         from '/frontschweine/js/BaseV.js';

export class PresentationV extends BaseV
{
  constructor(anim)
  {
    super(anim);

    this.sidebarView = document.querySelector('.sidebar');

    this.widgets =
    {
      clock:    document.querySelector('.widgetClock'),
      controls: document.querySelector('.widgetControls'),
      log:      document.querySelector('.widgetLog'),
      location: document.querySelector('.widgetLocation'),
      map:      document.querySelector('.widgetMap'),
      lastCam:  document.querySelector('.widgetLastCam')
    };
  }

  setWidgetVisibility(ev)
  {
    let widgets = ev.detail.payload.widgets;
    let isVisible = ev.detail.payload.isVisible;

    if (widgets.length > 0)
    {
      widgets.forEach((widgetName) =>
      {
        if (isVisible === true)
        {
          if (widgetName == 'map')
          {
            this.widgets[widgetName].fetchMap();
            this.widgets[widgetName].isVisible = true;
          }
          this.anim.show(this.widgets[widgetName]);
        }
        else
        {
          if (widgetName == 'map')
          {
            this.widgets[widgetName].isVisible = false;
          }
          this.anim.hide(this.widgets[widgetName]);
        }
      });
    }
  }

  setWidgetsOpacity(prefs)
  {
    for (var widget in this.widgets)
    {
      this.widgets[widget].setWidgetsOpacity(prefs.overlaysOpacity);
    }
  }

  async webcamSwap(ev)
  {
    var bgSize = 'contain';
    var nextCam =
    {
      idx: null,
      cam: null,
      lastCam: null,
      img: null
    };

    let webcam = document.querySelector('.webcam');

    // fade out current image
    await this.anim.hide(webcam);

    // grab next image
    nextCam.prefs = ev.detail.payload.prefs;
    nextCam.lastCam = ev.detail.payload.lastCam;
    nextCam.img = ev.detail.payload.img;
    nextCam.cam = ev.detail.payload.cam;
    nextCam.idx = ev.detail.payload.idx;

    // Scaling
    switch (nextCam.prefs.screenMode)
    {
      case 'auto':
        bgSize = 'contain';
        if (nextCam.img.width >= 640) bgSize = 'contain';
        if (nextCam.img.width >= 1280) bgSize = 'cover';
      break;

      case 'original':
        bgSize = 'auto';
      break;

      default:
        // it's "cover" or "contain"
        bgSize = nextCam.prefs.screenMode;
      break;
    }

    if (nextCam.cam !== null)
    {
      // update widgets
      this.widgets.location.setAttribute('place', nextCam.cam.location);
      this.widgets.location.setAttribute('desc', nextCam.cam.description);
      this.widgets.location.setAttribute('url', nextCam.cam.homepage);
      this.widgets.map.setAttribute('place', this.widgets.location.getAttribute('place'));

      // make sure sidebar is set to current location/cam
      this.sidebarView.setSidebarActiveCam(nextCam.idx);

      // delete old image, set new image
      delete(webcam.style.backgroundImage);
      webcam.style.backgroundSize = bgSize;
      webcam.style.backgroundImage = 'url(' + nextCam.img.src + ')';

      // store "last cam"
      if ((nextCam.lastCam.url !== null) || (nextCam.lastCam.url !== null))
      {
        this.widgets.lastCam.setAttribute('url', nextCam.lastCam.url);
        this.widgets.lastCam.setAttribute('idx', nextCam.lastCam.idx);
      }

      // set sidebar cam color
      this.sidebarView.setSidebarCamColor(nextCam.cam, nextCam.idx);

      // finally, fade in new image
      await this.anim.show(webcam);
    }
  }

  webcamSwapFailed(ev)
  {
    let logMode = ev.detail.payload.logMode;
    let cam = ev.detail.payload.cam;
    let idx = ev.detail.payload.idx;
    let err = ev.detail.payload.err;

    this.sidebarView.setSidebarCamColor(cam, idx);

    var msg = 'Failed loading image: "'+cam.location+' / '+cam.description+'".'+"\r\n"+
              'Homepage: '+cam.homepage+"\r\n"+
              'URL: '+cam.url+"\r\n"+
              'Reason: '+err.name+': '+err.message;

    switch (logMode)
    {
      case 'screen': this.log(msg); break;
      case 'console': this.consoleLog(msg); break;
      case 'both':
        this.log(msg);
        this.consoleLog(msg);
      break;
      case 'none': break;
    }
  }

  toggleSidebar(curIdx)
  {
    if (this.sidebarView.open === false)
    {
      this.anim.show(this.sidebarView);
      this.sidebarView.scrollToCam(curIdx);
      this.sidebarView.open = true;
    }
    else
    {
      this.sidebarView.closeSidebarWebcamsCamActions();
      this.anim.hide(this.sidebarView);
      this.sidebarView.open = false;
    }
  }

  log(ev)
  {
    this.logText(ev.detail.payload.txt);
  }

  logText(txt)
  {
    this.widgets.log.setAttribute('text', txt);
  }

  consoleLog(txt)
  {
    console.log(txt);
  }

  stop()
  {
    this.widgets.controls.setAttribute('caption', 'Start');
    this.widgets.clock.setAttribute('blinking', 'no');
    this.logText('Stopped');
  }

  start(ev)
  {
    this.widgets.controls.setAttribute('caption', 'Stop');
    this.widgets.clock.setAttribute('blinking', 'yes');
    this.logText('Starting');
  }

  showOverlays()
  {
    document.querySelectorAll('#staticOverlays, #dynamicOverlays, .sidebar').forEach((el) =>
    {
      el.classList.remove('element--invisible');
      el.classList.add('element--visible');
    });
  }

  hideOverlays()
  {
    document.querySelectorAll('#staticOverlays, #dynamicOverlays, .sidebar').forEach((el) =>
    {
      el.classList.remove('element--visible');
      el.classList.add('element--invisible');
    });
  }
}
