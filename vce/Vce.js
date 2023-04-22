import { FormoBase }    from '/frontschweine/formo/FormoBase.js';

export class Vce extends FormoBase
{
  constructor()
  {
    super();
    this.widgetOpacity0 = 'widget--opacity0';
    this.widgetOpacity = 'widget--opacity100';
  }

  setWidgetsOpacity(opacity)
  {
    let oldWidgetOpacity = this.widgetOpacity;
    this.widgetOpacity = 'widget--opacity' + opacity;
    this.setAttribute('data-show', this.widgetOpacity);

    // only (re-)set widget opacity if widget not invisible
    if (!this.classList.contains(this.widgetOpacity0))
    {
      this.classList.remove(oldWidgetOpacity);
      this.classList.add(this.widgetOpacity);
    }
  }
}
