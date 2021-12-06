"use strict";

class VceBase2V extends HTMLElement
{
  constructor()
  {
    super();
  }

  static get observedAttributes()
  {
    return ['visible', 'opacity', 'show', 'hide'];
  }

  get visible()
  {
    return this.getAttribute('visible') || 'no';
  }

  set visible(isVis)
  {
    this.setAttribute('visible', isVis);
  }

  get opacity()
  {
    return this.getAttribute('opacity') || '1';
  }

  set opacity(opacity)
  {
    this.setAttribute('opacity', opacity);
  }

  get show()
  {
    return this.getAttribute('show') || '';
  }

  set show(s)
  {
    this.setAttribute('show', s);
  }

  get hide()
  {
    return this.getAttribute('hide') || '';
  }

  set hide(h)
  {
    this.setAttribute('hide', h);
  }

  attributeChangedCallback(name, oldValue, newValue)
  {
    switch (name)
    {
      case 'visible':

        if (newValue == 'yes')
        {
          this.runObjMethodFromAttribVal(this.show, {'opacity': this.opacity});
        }
        else
        {
          this.runObjMethodFromAttribVal(this.hide, {'opacity': this.opacity});
        }
      break;
    }
  }

  runObjMethodFromAttribVal(val, params)
  {
    let parts = val.split('.');
    let method = parts.pop();

    let obj = window;
    parts.some((objName) =>
    {
      if (!obj[objName]) return;
      obj = obj[objName];
    });

    obj[method]({'target': this, 'params': params});
  }

}

Object.assign(VceBaseV.prototype, Events);
