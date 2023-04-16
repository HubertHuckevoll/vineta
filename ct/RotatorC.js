import { BaseC }         from '/frontschweine/js/BaseC.js';

export class RotatorC extends BaseC
{
  constructor(webcamLoader)
  {
    super();

    this.prefs = {};
    this.webcams = [];

    this.isRunning = false;

    this.ticks = 0;
    this.tickerIntervall = 0;
    this.timerID = null;
    this.idx = null;

    this.lastCam = {};

    this.img = document.getElementById('image');
    this.loader = webcamLoader;
  }

  setPrefs(prefs)
  {
    this.prefs = prefs;
    this.loader.setPrefs(prefs);
  }

  setWebcams(webcams)
  {
    this.webcams = webcams;

    this.lastCam = {};

    if (this.isRunning === true)
    {
      this.stop();
      this.start();
    }
  }

  resetTicksToPrefValue()
  {
    this.tickerIntervall = 1000;
    this.ticks = this.prefs.slideTime;
  }

  resetTicksToZero()
  {
    this.tickerIntervall = 0;
    this.ticks = 0;
  }

  toggle()
  {
    if (this.isRunning !== false)
    {
      this.stop();
    }
    else
    {
      this.start();
    }
  }

  start()
  {
    this.isRunning = true;
    this.emit('rotatorStart');

    this.resetTicksToZero();
    this.rotate();
  }

  stop()
  {
    this.loader.abort();
    window.clearTimeout(this.timerID);
    this.isRunning = false;
    this.resetTicksToZero();

    this.emit('rotatorImageLoadEnd', {'idx': this.idx, 'success': false})
    this.emit('rotatorStop');
  }

  async goto(idx)
  {
    this.stop();
    this.setNextIdx(idx);

    try
    {
      await this.loadImage();
      this.imageLoadSuccess();
    }
    catch(err)
    {
      this.imageLoadFailure(err);
      this.resetTicksToZero();
    }
  }

  async rotate()
  {
    if (this.webcams.length > 0)
    {
      await this.tick();

      if (this.ticks === 0)
      {
        // Get the IDX for the cam to load
        this.setNextIdx();

        // Load the image
        try
        {
          await this.loadImage();
          this.imageLoadSuccess();
          this.resetTicksToPrefValue();
          this.rotate();
        }
        catch(err)
        {
          switch (err.name)
          {
            case 'EmptyError':
              this.imageLoadFailure(err);
              this.resetTicksToZero();
              this.rotate();
            break;

            case 'TimeoutError':
              this.imageLoadFailure(err);
              this.resetTicksToZero();
              this.rotate();
            break;

            case 'AbortError': // don't load next image (rotate) on user abort - aborting comes from "stop"!
              this.imageLoadFailure(err);
              this.resetTicksToZero();
            break;
          }
        }
      }
      else
      {
        // just keep ticking
        this.emit('log', {'txt': this.ticks});
        this.ticks = this.ticks - 1;
        this.rotate();
      }
    }
    else
    {
      this.stop();
    }
  }

  setNextIdx(forceIdx = null)
  {
    if (forceIdx !== null)
    {
      this.idx = forceIdx;
    }
    else
    {
      var allowedIdx = [];
      var idx = this.idx;

      for (let z = 0; z < this.webcams.length; z++)
      {
        if (this.webcams[z].enabled && this.webcams[z].visible)
        {
          allowedIdx.push(z);
        }
      }

      switch (this.prefs.rotateMode)
      {
        case 'serial':
          idx = idx + 1;
          if (idx > this.webcams.length-1)
          {
            idx = 0;
          }
        break;

        case 'random':
          let min = 0;
          let max = allowedIdx.length-1;
          if (max > 0)
          {
            do
            {
              let z = Math.floor(Math.random() * (max - min + 1)) + min;
              idx = allowedIdx[z];
            }
            while(idx === this.idx);
          }
        break;
      }

      this.idx = idx;
    }
  }

  async loadImage()
  {
    // get cam
    let cam = this.webcams[this.idx];
    cam.totalCalls = cam.totalCalls + 1;

    // we need the URL as value, not as reference, so a little fuckery is neccessary...
    let camC = Object.assign({}, cam);
    let url = camC.url.toString();

    // update status
    this.emit('log', {'txt': 'Loading: '+camC.location+' / '+camC.description});

    // tell the world we are now trying to start loading the image
    this.emit('rotatorImageLoadStart', {'idx':this.idx});

    // finally, load image
    try
    {
      this.img.src = await this.loader.load(url);
    }
    catch(err)
    {
      throw err;
    }
  }

  imageLoadSuccess()
  {
    // tell the world about our achievement
    this.emit('log', {'txt': 'Done'});
    this.emit('rotatorSwitch', {
      'prefs': this.prefs,
      'lastCam': Object.assign({}, this.lastCam),
      'img': this.img,
      'cam': this.webcams[this.idx],
      'idx': this.idx
    });

    this.emit('rotatorImageLoadEnd', {'idx': this.idx, 'success': true})

    // it is important to call saveLastCam AFTER swapping the image
    // it is also important to pass lastCam "by value", thats why we clone the object
    this.saveLastCam();
  }

  imageLoadFailure(err)
  {
    // grab cam
    var cam = this.webcams[this.idx];

    // add another failed attempt
    cam.failedCalls = cam.failedCalls + 1;

    // tell the world about our misery
    this.emit('log', {'txt': 'Failed'});
    this.emit('rotatorSwitchError', {
      'logMode': this.prefs.logMode,
      'cam': cam,
      'idx': this.idx,
      'err': err
    })

    this.emit('rotatorImageLoadEnd', {'idx': this.idx, 'success': false});
  }

  saveLastCam()
  {
    this.lastCam = Object.assign(this.lastCam, this.webcams[this.idx]);
    this.lastCam.idx = this.idx;
    this.lastCam.url = this.img.src; // get the ACTUAL FETCHED image;
  }

  tick()
  {
    return new Promise((resolve, reject) =>
    {
      this.timerID = setTimeout(resolve, this.tickerIntervall);
    });
  }

}
