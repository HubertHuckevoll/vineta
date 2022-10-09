export class PrefsM
{
  constructor()
  {
    this.prefs = {
      slideTime: 8,
      rotateMode: 'random', // serial, random
      screenMode: 'auto', // auto, cover, contain
      overlays: [
        { // always=1; mousemove=2, never=3
          name: 'clock',
          show: 1
        },
        {
          name: 'controls',
          show: 1
        },
        {
          name: 'log',
          show: 1
        },
        {
          name: 'location',
          show: 1
        },
        {
          name: 'map',
          show: 1
        },
        {
          name: 'lastCam',
          show: 1
        }
      ],
      overlaysOpacity: 90,
      overlaysDisplayTime: 5,
      webcamLoadTimeout: 10,
      logMode: 'console',
      proxy: true,
      proxyURL: 'https://script.google.com/macros/s/AKfycbzkgzfi7AZqiKSu0rnZW-2oaV0CH-DT4vbvlU80nZCs2hdaGX5b/exec?url='
      /*proxyURL: 'https://script.google.com/macros/s/AKfycbznLUpI5R-bm-S0Zo_PvOrpGOKye9wEg40rFzzSlhH4/dev?url='*/
    };
  }

  setPref(prop, val)
  {
    this.prefs[prop] = val;
    this.save();
  }

  getPref(prop)
  {
    return this.prefs[prop];
  }

  getPrefs()
  {
    return this.prefs;
  }

  load()
  {
    var p = localStorage.getItem('vineta');
    if (p !== null) {
      this.prefs = JSON.parse(p);
    }

    return this.prefs;
  }

  save()
  {
    localStorage.setItem('vineta', JSON.stringify(this.prefs));

    return this.prefs;
  }
}

