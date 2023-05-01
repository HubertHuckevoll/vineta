import { BaseV }           from '/frontschweine/js/BaseV.js';

export class WebcamV extends BaseV
{
  constructor(evtEmt, anim)
  {
    super(evtEmt, anim);
  }

  webcamHide()
  {
    // fade out current image
    return this.anim.hide('.webcam'); // returns promise
  }

  webcamShow(nextCam)
  {
    let webcam = document.querySelector('.webcam');
    let bgSize = 'contain';

    // Scaling
    switch (nextCam.prefs.screenMode)
    {
      case 'auto':
        bgSize = 'contain';
        if (nextCam.img.width >= 640) bgSize = 'contain';
        if (nextCam.img.width >= 1280) bgSize = 'cover';
      break;

      case 'original':
        bgSize = 'auto';
      break;

      default:
        // it's "cover" or "contain"
        bgSize = nextCam.prefs.screenMode;
      break;
    }

    // delete old image, set new image
    delete(webcam.style.backgroundImage);
    webcam.style.backgroundSize = bgSize;
    webcam.style.backgroundImage = 'url(' + nextCam.img.src + ')';

    // finally, fade in new image (returns promise)
    return this.anim.show(webcam);
  }
}
