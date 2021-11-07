"use strict";

/*
  Presentation View
*/

class PresentationV extends BaseV
{
  constructor()
  {
    super();

    this.sidebarView = document.getElementById('sidebar');

    this.widgets =
    {
      clock:    document.getElementById('widgetClock'),
      controls: document.getElementById('widgetControls'),
      log:      document.getElementById('widgetLog'),
      location: document.getElementById('widgetLocation'),
      map:      document.getElementById('widgetMap'),
      lastCam:  document.getElementById('widgetLastCam')
    };

    this.nextCam =
    {
      idx: null,
      cam: null,
      lastCam: null,
      img: null
    };

  }

  setWidgetVisibility(ev)
  {
    let widgets = ev.detail.widgets;
    let isVisible = ev.detail.isVisible;

    this.iterate(widgets, (idx, widgetName) =>
    {
      let isVis = (isVisible === true) ? 'yes' : 'no';
      this.widgets[widgetName].setAttribute('visible', isVis);
    });
  }

  setWidgetsOpacity(prefs)
  {
    var opacity = prefs.overlaysOpacity / 100;
    for (var widget in this.widgets)
    {
      this.widgets[widget].setAttribute('opacity', opacity);
    }
  }

  webcamSwap(ev)
  {
    let webcam = document.getElementById('webcam');

    this.nextCam.prefs = ev.detail.prefs;
    this.nextCam.lastCam = ev.detail.lastCam;
    this.nextCam.img = ev.detail.img;
    this.nextCam.cam = ev.detail.cam;
    this.nextCam.idx = ev.detail.idx;

    // css3 transition will now fade out for 1s
    // afterwards we finish the transition with "webcamSwapFinish", which is our "transitionend" handler
    // FIXME - replace this somehow with requestAnimationFrame or something
    webcam.style.opacity = '0';
  }

  webcamSwapFinish()
  {
    var webcam = document.getElementById('webcam');

    // only swap if we are faded out
    if (webcam.style.opacity == '0')
    {
      var bgSize = 'contain';
      var aspect = null;
      var nodeList = null;

      // Scaling
      switch (this.nextCam.prefs.screenMode)
      {
        case 'auto':
          //var aspect = img.width/img.height;
          //if (aspect >= 1.4) bgSize = 'contain';
          bgSize = 'contain';
          if (this.nextCam.img.width >= 640) bgSize = 'contain';
          if (this.nextCam.img.width >= 1280) bgSize = 'cover';
        break;

        case 'original':
          bgSize = 'auto';
        break;

        default:
          bgSize = this.nextCam.prefs.screenMode;
        break;
      }

      if (this.nextCam.cam !== null)
      {
        this.widgets.location.setAttribute('place', this.nextCam.cam.location);
        this.widgets.location.setAttribute('desc', this.nextCam.cam.description);
        this.widgets.location.setAttribute('url', this.nextCam.cam.homepage);

        this.widgets.map.setAttribute('place', this.nextCam.cam.location);

        this.sidebarView.setSidebarActiveCam(this.nextCam.idx);

        delete(webcam.style.backgroundImage);
        webcam.style.backgroundSize = bgSize;
        webcam.style.backgroundImage = 'url('+this.nextCam.img.src+')';

        // "last cam"
        if ((this.nextCam.lastCam.url !== null) || (this.nextCam.lastCam.url !== null))
        {
          this.widgets.lastCam.setAttribute('url', this.nextCam.lastCam.url);
          this.widgets.lastCam.setAttribute('idx', this.nextCam.lastCam.idx);
        }

        this.sidebarView.setSidebarCamColor(this.nextCam.cam, this.nextCam.idx);

        webcam.style.opacity = '1'; // this will trigger the fade in for 1s.
      }
    }
  }

  webcamSwapFailed(ev)
  {
    let logMode = ev.detail.logMode;
    let cam = ev.detail.cam;
    let idx = ev.detail.idx;
    let err = ev.detail.err;

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

  log(ev)
  {
    this.logText(ev.detail.txt);
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
    document.getElementById('staticOverlays').style.display = 'block';
    document.getElementById('dynamicOverlays').style.display = 'block';
    document.getElementById('sidebar').style.display = 'block';
  }

  hideOverlays()
  {
    document.getElementById('staticOverlays').style.display = 'none';
    document.getElementById('dynamicOverlays').style.display = 'none';
    document.getElementById('sidebar').style.display = 'none';
  }
}
