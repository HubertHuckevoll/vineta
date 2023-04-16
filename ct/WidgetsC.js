import { BaseC }         from '/frontschweine/js/BaseC.js';

export class WidgetsC extends BaseC
{
  constructor()
  {
    super();

    this.prefs = null;
    this.alwaysOverlays = null;
    this.mousemoveOverlays = null;
    this.neverOverlays = null;

    this.timer = null;

    this.on('mousemove', null, this.onMousemove.bind(this));
  }

  update(prefs)
  {
    this.cancelTimeout();
    this.prefs = prefs;
    this.alwaysOverlays = [];
    this.mousemoveOverlays = [];
    this.neverOverlays = [];

    for (var i=0; i<prefs.overlays.length; i++)
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

    this.emit('widgetsVisibilityChange', {'widgets': this.alwaysOverlays, 'isVisible':true});
    this.emit('widgetsVisibilityChange', {'widgets': this.mousemoveOverlays, 'isVisible':false});
    this.emit('widgetsVisibilityChange', {'widgets': this.neverOverlays, 'isVisible':false});
  }

  onMousemove(ev)
  {
    if (this.timer != null)
    {
      this.cancelTimeout();
      this.timer = setTimeout(this.onTimeout.bind(this), this.prefs.overlaysDisplayTime * 1000);
    }
    else
    {
      this.timer = setTimeout(this.onTimeout.bind(this), this.prefs.overlaysDisplayTime * 1000);
      this.emit('widgetsVisibilityChange', {'widgets': this.mousemoveOverlays, 'isVisible':true});
    }
  }

  onTimeout()
  {
    this.timer = null;
    this.emit('widgetsVisibilityChange', {'widgets': this.mousemoveOverlays, 'isVisible':false});
  }

  cancelTimeout()
  {
    clearTimeout(this.timer);
    this.timer = null;
  }
}