"use strict";

class VceBaseV extends HTMLElement
{
  constructor()
  {
    super();
  }

  static get observedAttributes()
  {
    return ['visible', 'fadeTime', 'opacity'];
  }

  get fadeTime()
  {
    return this.getAttribute('fadeTime') || '1';
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
          this.fadeIn();
        }
        else
        {
          this.fadeOut();
        }
      break;

      case 'opacity':
        if (this.visible == 'yes')
        {
          this.style.opacity = newValue;
        }
      break;

      case 'fadeTime':
        this.style.transition = 'opacity '+this.fadeTime+'s';
      break;
    }
  }

  async fadeIn()
  {
    this.style.transition = 'opacity '+this.fadeTime+'s';
    //this.style.display = "";
    this.style.height = '';
    this.style.width = '';

    //await this.wait(10);
    this.ontransitionend = this.finishFadeIn.bind(this);
    this.style.opacity = this.opacity; // css3 transition will now start the fade
  }

  fadeOut()
  {
    this.style.transition = 'opacity '+this.fadeTime+'s';
    this.ontransitionend = this.finishFadeOut.bind(this);
    this.style.opacity = 0; // css3 transition will now start the fade
  }

  finishFadeIn()
  {
    this.style.transition = '';
    this.ontransitionend = null;
  }

  finishFadeOut()
  {
    this.style.transition = '';
    this.ontransitionend = null;
    //this.style.display = "none";
    this.style.height = 0;
    this.style.width = 0;
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

  async wait(ms)
  {
    return new Promise((resolve, reject) =>
    {
      let timerID = setTimeout(resolve, ms);
    });
  }
}

Object.assign(VceBaseV.prototype, Events);
