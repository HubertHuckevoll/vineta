import { BaseV }           from '/frontschweine/js/BaseV.js';

export class WidgetsV extends BaseV
{
  constructor(evtEmt, anim)
  {
    super(evtEmt, anim);

    this.widgets =
    {
      clock:    document.querySelector('.widgetClock'),
      controls: document.querySelector('.widgetControls'),
      log:      document.querySelector('.widgetLog'),
      location: document.querySelector('.widgetLocation'),
      map:      document.querySelector('.widgetMap'),
      lastCam:  document.querySelector('.widgetLastCam')
    };

    this.prefs = null;
    this.alwaysOverlays = null;
    this.mousemoveOverlays = null;
    this.neverOverlays = null;

    this.mousemoveTimer = null;
  }

  update(prefs)
  {
    this.cancelMousemoveTimeout();

    this.prefs = prefs;
    this.alwaysOverlays = [];
    this.mousemoveOverlays = [];
    this.neverOverlays = [];

    for (let i=0; i<prefs.overlays.length; i++)
    {
      if (prefs.overlays[i].show == 1)
      { // always
        this.alwaysOverlays.push(prefs.overlays[i].name);
      }

      if (prefs.overlays[i].show == 2)
      { // mousemove
        this.mousemoveOverlays.push(prefs.overlays[i].name);
      }

      if (prefs.overlays[i].show == 3)
      { // never
        this.neverOverlays.push(prefs.overlays[i].name);
      }
    }

    this.setWidgetVisibility(this.alwaysOverlays, true);
    this.setWidgetVisibility(this.mousemoveOverlays, false);
    this.setWidgetVisibility(this.neverOverlays, false);

    this.setWidgetsOpacity(prefs);
  }

  setWidgetVisibility(widgets, isVisible)
  {
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
    for (let widget in this.widgets)
    {
      this.widgets[widget].setWidgetsOpacity(prefs.overlaysOpacity);
    }
  }

  showWidgetsOnMousemove()
  {
    if (this.mousemoveTimer != null)
    {
      this.cancelMousemoveTimeout();
      this.mousemoveTimer = setTimeout(this.hideWidgetsOnTimeout.bind(this), this.prefs.overlaysDisplayTime * 1000);
    }
    else
    {
      this.mousemoveTimer = setTimeout(this.hideWidgetsOnTimeout.bind(this), this.prefs.overlaysDisplayTime * 1000);
      this.setWidgetVisibility(this.mousemoveOverlays, true);
    }
  }

  hideWidgetsOnTimeout()
  {
    this.mousemoveTimer = null;
    this.setWidgetVisibility(this.mousemoveOverlays, false);
  }

  cancelMousemoveTimeout()
  {
    clearTimeout(this.mousemoveTimer);
    this.mousemoveTimer = null;
  }

  setWidgetAttribute(widgetName, attrName, attrVal)
  {
    this.widgets[widgetName].setAttribute(attrName, attrVal);
  }

  getWidgetAttribute(widgetName, attrName)
  {
    return this.widgets[widgetName].getAttribute(attrName);
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

  log(ev)
  {
    this.logText(ev.detail.payload.txt);
  }

  logText(txt)
  {
    this.setWidgetAttribute('log', 'text', txt);
  }
}
