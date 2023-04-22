import { BaseM }         from '/frontschweine/js/BaseM.js';

export class WebcamLoaderM extends BaseM
{
  constructor(evtEmt)
  {
    super(evtEmt);

    this.prefs = null;

    this.fetchAbortC = null;
    this.fetchInit = null;

    this.abortReason = null; // CancelError, TimeoutError

    this.imgTimeout = null;
    this.imgTimeoutID = null;
  }

  setPrefs(prefs)
  {
    this.prefs = prefs;
    this.imgTimeout = (this.prefs.webcamLoadTimeout !== undefined) ? this.prefs.webcamLoadTimeout : 10;
    this.imgTimeout = this.imgTimeout * 1000;
  }

  load(url)
  {
    return new Promise(async (resolve, reject) =>
    {
      let err = null;
      this.fetchAbortC = new AbortController();

      this.fetchInit =
      {
        signal: this.fetchAbortC.signal
      }

      this.abortReason = null;

      // make sure we are not getting a cached image
      url = this.refreshURL(url);

      // prefix the url with proxy url, if we are using a proxy, which is highly encouraged (CORS)
      url = this.addProxyToURL(url);

      // finally, load image
      try
      {
        this.imgTimeoutID = setTimeout(this.timeout.bind(this), this.imgTimeout);
        const response = await fetch(url, this.fetchInit);
        clearTimeout(this.imgTimeoutID);

        if (this.prefs.proxy === true)
        {
          const base64code = await response.text();
          if (base64code !== '')
          {
            resolve(base64code);
          }
          else
          {
            err = new Error('Proxy returned empty image (base64).');
            err.name = 'EmptyError';
            reject(err);
          }
        }
        else
        {
          const bincode = await response.blob();
          if (bincode.size !== 0)
          {
            let img = URL.createObjectURL(bincode);
            resolve(img);
          }
          else
          {
            err = new Error('Host returned empty image (binary).');
            err.name = 'EmptyError';
            reject(err);
          }
        }
      }
      catch(e)
      {
        switch(this.abortReason)
        {
          case 'TimeoutError':
            err = new Error('Loading the image took too long and was aborted.');
            err.name = this.abortReason;
          break;

          case 'CancelError':
            err = new Error('Loading the image was aborted.');
            err.name = this.abortReason;
          break;

          default:
            err = e;
          break;
        }

        reject(err);
      }
    });
  }

  timeout()
  {
    if (this.fetchAbortC)
    {
      this.abortReason = 'TimeoutError';
      this.fetchAbortC.abort();
    }
  }

  abort()
  {
    if (this.fetchAbortC)
    {
      this.abortReason = 'CancelError';
      this.fetchAbortC.abort();
    }
  }

  refreshURL(url)
  {
    let now = new Date();
    now.getTime();
    url = (url.indexOf('?') != -1) ? url + '&tstamp=' + now : url + '?tstamp=' + now;

    return url;
  }

  addProxyToURL(url)
  {
    // prefix the url with proxy url, if we are using a proxy, which is highly encouraged (CORS)
    if (this.prefs.proxy === true)
    {
      url = this.prefs.proxyURL + encodeURIComponent(url);
    }

    return url;
  }

}
