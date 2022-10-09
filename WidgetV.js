import { FormoBase } from '/frontschweine/js/FormoBase.js';

export class WidgetV extends FormoBase
{
  constructor()
  {
    super();
    this.widgetOpacity0 = 'widget--opacity0';
    this.widgetOpacity = 'widget--opacity100';
  }

  showElement()
  {
    this.show(this, {showClass: this.widgetOpacity, hideClass: this.widgetOpacity0});
  }

  hideElement()
  {
    this.hide(this, {showClass: this.widgetOpacity, hideClass: this.widgetOpacity0});
  }

  setWidgetsOpacity(opacity)
  {
    let oldWidgetOpacity = this.widgetOpacity;
    this.widgetOpacity = 'widget--opacity' + opacity;

    // only (re-)set widget opacity if widget not invisible
    if (!this.classList.contains(this.widgetOpacity0))
    {
      this.classList.remove(oldWidgetOpacity);
      this.classList.add(this.widgetOpacity);
    }
  }
}
