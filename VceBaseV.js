"use strict";

class VceBaseV extends HTMLElement
{
  constructor()
  {
    super();
    this.fadeOutTimer = null;
  }

  static get observedAttributes()
  {
    return ['visible', 'fadeTime', 'opacity'];
  }

  get fadeTime()
  {
    return this.getAttribute('fadeTime') || '0.5';
  }

  set fadeTime(fadeTime)
  {
    this.setAttribute('fadeTime', fadeTime);
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

  attributeChangedCallback(name, oldValue, newValue)
  {
    switch (name)
    {
      case 'visible':
        if (newValue == 'yes')
        {
          if (this.fadeOutTimer !== null)
          {
            window.clearTimeout(this.fadeOutTimer);
            this.fadeOutTimer = null;
          }
          this.fadeIn();
        }
        else
        {
          this.fadeOut();
        }
      break;

      case 'opacity':
        if (this.getAttribute('visible') == 'yes')
        {
          this.style.opacity = newValue;
        }
      break;
    }
  }

  fadeIn()
  {
    this.style.transition = 'opacity '+this.getAttribute('fadeTime')+'s';
    this.resetSize();
    this.style.opacity = this.getAttribute('opacity'); // css3 transition will now start the fade
  }

  fadeOut()
  {
    this.style.transition = 'opacity '+this.getAttribute('fadeTime')+'s';
    this.style.opacity = 0; // css3 transition will now start the fade
    this.fadeOutTimer = window.setTimeout(this.minimizeSize.bind(this), (this.getAttribute('fadeTime') * 1000));
  }

  minimizeSize()
  {
    this.style.width = 0;
    this.style.height = 0;
    this.fadeOutTimer = null;
  }

  resetSize()
  {
    this.style.width = '';
    this.style.height = '';
  }

  iterate(objArr, callback)
  {
    for (var i = 0; i < objArr.length; i++) {
      callback(i, objArr[i]);
    }
  }

  forEachElement(nodeList, callback)
  {
    for (var i = 0; i < nodeList.length; i++) {
      callback(nodeList[i]);
    }
  }
}

Object.assign(VceBaseV.prototype, Events);
