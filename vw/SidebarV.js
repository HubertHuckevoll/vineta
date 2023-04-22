import { BaseV }           from '/frontschweine/js/BaseV.js';

export class SidebarV extends BaseV
{
  constructor(evtEmt, anim)
  {
    super(evtEmt, anim);
    this.open = false;
  }

  render(webcams)
  {
    var sw = document.querySelector('.sidebarWebcams');
    var swd = document.querySelector('.sidebarWebcamsDisabled');
    var enabledCamCount = 0;
    var disabledCamCount = 0;
    var div = null;
    var previewURL = null;
    var now = new Date();
    let str = '';

    now = now.getTime();
    sw.innerHTML = '';
    swd.innerHTML = '';

    for (let idx = 0; idx < webcams.length; idx++)
    {
      let webcam = webcams[idx];
      if ((webcam.enabled === true) && (webcam.visible === true))
      {
        enabledCamCount = enabledCamCount + 1;
        div = document.createElement('div');
        div.setAttribute('class', 'sidebarWebcam');
        div.setAttribute('data-idx', idx);
        str = '<details class="sidebarWebcam__details">'+
              '<summary class="sidebarWebcam__summary">'+
                '<span class="sidebarWebcam__location">'+webcam.location+'</span><br>'+
                '<span class="sidebarWebcam__desc">'+webcam.description+'</span><br>'+
              '</summary>'+
              '<div class="sidebarWebcamCamActions" data-idx="'+idx+'">'+
                '<a class="sidebarWebcamCamActions__disableButton">Disable Camera</a><br>'+
                '<a href="'+webcam.homepage+'" target="_blank">Open Camera Homepage</a><br>'+
                '<a href="'+webcam.url+'"      target="_blank">Open Camera Image In New Tab</a><br>';

        if (webcam.sheetURL)
        {
          str += '<a href="'+webcam.sheetURL+'" target="_blank">Open Containing Google Sheet ("'+webcam.sheetName+'")</a><br>';
        }

        str = str + '</div></details>';
        div.innerHTML = str;
        sw.appendChild(div);
      }

      if (webcam.enabled === false)
      {
        disabledCamCount = disabledCamCount + 1;
        previewURL = webcam.url.toString();
        previewURL = (previewURL.indexOf('?') != -1) ? previewURL + '&tstamp=' + now : previewURL + '?tstamp=' + now;

        div = document.createElement('div');
        div.setAttribute('class', 'sidebarWebcam');
        div.setAttribute('data-idx', idx);
        div.innerHTML = '<details class="sidebarWebcam__details">'+
                          '<summary class="sidebarWebcam__summary">'+
                            '<span class="sidebarWebcam__location">'+webcam.location+'</span><br>'+
                            '<span class="sidebarWebcam__desc">'+webcam.description+'</span><br>'+
                          '</summary>'+
                          '<div class="sidebarWebcamCamActions" data-idx="'+idx+'">'+
                            '<a class="sidebarWebcamCamActions__enableButton">Enable Camera</a><br>'+
                            '<a href="'+webcam.homepage+'" target="_blank">Open Camera Homepage</a><br>'+
                            '<a href="'+webcam.url+'"      target="_blank">Open Camera Image In New Tab</a><br>'+
                            '<a href="'+webcam.sheetURL+'" target="_blank">Open Containing Google Sheet ("'+webcam.sheetName+'")</a>'+
                          '</div>'+
                        '</details>'+
                        '<img class="sidebarWebcam__previewImage" src="'+previewURL+'" alt="Image for '+webcam.homepage+'">';

        swd.appendChild(div);
      }

      this.setSidebarCamColor(webcam, idx);
    };

    document.querySelector('.sidebarWebcamCount').innerHTML = enabledCamCount + ' active camera(s)';
    document.querySelector('.sidebarDisabledWebcamCount').innerHTML = disabledCamCount + ' disabled camera(s)';
  }

  setSidebarCamColor(cam, idx)
  {
    var camDiv = document.querySelector(".sidebarWebcams .sidebarWebcam[data-idx='"+idx+"']");

    if ((camDiv !== null) && (camDiv !== undefined))
    {
      var camStatusLED = camDiv.querySelector('.sidebarWebcam__summary');

      var tc = cam.totalCalls;
      var fc = cam.failedCalls;
      var ratio = (fc / tc) * 100;

      if (isNaN(ratio))
      {
        camStatusLED.className = 'sidebarWebcam__summary';
        camStatusLED.classList.add('sidebarWebcam__summary--grey');
      }
      if ((ratio >= 0) && (ratio < 33))
      {
        camStatusLED.className = 'sidebarWebcam__summary';
        camStatusLED.classList.add('sidebarWebcam__summary--blue');
      }
      if ((ratio >= 33) && (ratio < 66))
      {
        camStatusLED.className = 'sidebarWebcam__summary';
        camStatusLED.classList.add('sidebarWebcam__summary--yellow');
      }
      if ((ratio >= 66) && (ratio <= 100))
      {
        camStatusLED.className = 'sidebarWebcam__summary';
        camStatusLED.classList.add('sidebarWebcam__summary--red');
      }
    }
  }

  /**
   * Public functions
   */

  toggleSidebar(curIdx)
  {
    if (this.open === false)
    {
      this.anim.show('.sidebar');
      this.scrollToCam(curIdx);
      this.open = true;
    }
    else
    {
      this.closeSidebarWebcamsCamActions();
      this.anim.hide('.sidebar');
      this.open = false;
    }
  }

  closeSidebarWebcamsCamActions()
  {
    let details = document.querySelectorAll('.sidebarWebcams .sidebarWebcam__details');
    details.forEach((detail) =>
    {
      detail.removeAttribute("open");
    });
  }

  setSidebarActiveCam(idx)
  {
    var nodeList = document.querySelectorAll('.sidebarWebcams .sidebarWebcam');
    nodeList.forEach((node) =>
    {
      if (parseInt(node.getAttribute('data-idx')) == idx)
      {
        node.classList.add('sidebarWebcam--activeCam');
      }
      else
      {
        node.classList.remove('sidebarWebcam--activeCam');
      }
    });
  }

  startLoadingIndicator(ev)
  {
    let cam = document.querySelector(".sidebarWebcams .sidebarWebcam[data-idx='"+ev.detail.payload.idx+"']");
    if (cam != null) cam.classList.add('sidebarWebcam--loading');
  }

  stopLoadingIndicator(ev)
  {
    let cam = document.querySelector(".sidebarWebcams .sidebarWebcam[data-idx='"+ev.detail.payload.idx+"']");
    if (cam != null) cam.classList.remove('sidebarWebcam--loading');
  }

  scrollToTop()
  {
    this.scrollTop = 0;
  }

  async scrollToCam(curCamIdx = null)
  {
    // scroll current cam into view
    if (curCamIdx !== null)
    {
      var curCamElem = document.querySelector('.sidebarWebcam[data-idx="'+curCamIdx+'"]');
      if (curCamElem != null)
      {
        await this.anim.wait(500); // wait a litte, so we can be sure the sidebar animation has started
        this.scrollTop = parseInt(curCamElem.offsetTop) - 200;
      }
    }
  }
}
