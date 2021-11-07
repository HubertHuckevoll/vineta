"use strict";

/*
  Sidebar View
*/

class VceSidebarV extends VceBaseV
{
  constructor()
  {
    super();

    this.nextCam =
    {
      idx: null,
      cam: null,
      lastCam: null,
      img: null
    };

    this.open = false;
  }

  render(webcams)
  {
    var sw = this.querySelector('#sidebarWebcams');
    var swd = this.querySelector('#sidebarWebcamsDisabled');
    var enabledCamCount = 0;
    var disabledCamCount = 0;
    var div = null;
    var previewURL = null;
    var now = new Date();

    now = now.getTime();
    sw.innerHTML = '';
    swd.innerHTML = '';

    this.iterate(webcams, (idx, webcam) =>
    {
      if ((webcam.enabled === true) && (webcam.visible === true))
      {
        enabledCamCount = enabledCamCount + 1;
        div = document.createElement('div');
        div.setAttribute('class', 'sidebarWebcam');
        div.setAttribute('data-idx', idx);
        div.innerHTML = '<details>'+
                          '<summary>'+
                            '<span class="led"></span>'+
                            '<span class="sidebarWebcamLocation">'+webcam.location+'</span><br>'+
                            '<span class="sidebarWebcamDesc">'+webcam.description+'</span><br>'+
                          '</summary>'+
                          '<div class="sidebarWebcamsCamActions" data-idx="'+idx+'">'+
                            '<a class="disableBut">Disable Camera</a><br>'+
                            '<a href="'+webcam.homepage+'" target="_blank">Open Camera Homepage</a><br>'+
                            '<a href="'+webcam.url+'" target="_blank">Open Camera Image In New Tab</a><br>'+
                            '<a href="'+webcam.sheetURL+'" target="_blank">Open Containing Google Sheet ("'+webcam.sheetName+'")</a><br>'+
                          '</div>'+
                        '</details>';

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
        div.innerHTML = '<details>'+
                          '<summary>'+
                            '<span class="sidebarWebcamLocation">'+webcam.location+'</span><br>'+
                            '<span class="sidebarWebcamDesc">'+webcam.description+'</span><br>'+
                          '</summary>'+
                          '<div class="sidebarWebcamsCamActions" data-idx="'+idx+'">'+
                            '<a class="enableBut">Enable Camera</a><br>'+
                            '<a href="'+webcam.homepage+'" target="_blank">Open Camera Homepage</a><br>'+
                            '<a href="'+webcam.url+'" target="_blank">Open Camera Image In New Tab</a><br>'+
                            '<a href="'+webcam.sheetURL+'" target="_blank">Open Containing Google Sheet ("'+webcam.sheetName+'")</a>'+
                          '</div>'+
                        '</details>'+
                        '<img class="previewImage" src="'+previewURL+'" alt="Image for '+webcam.homepage+'">';

        swd.appendChild(div);
      }

      this.setSidebarCamColor(webcam, idx);
    });

    this.querySelector('#webcamCount').innerHTML = enabledCamCount + ' active camera(s)';
    this.querySelector('#disabledWebcamCount').innerHTML = disabledCamCount + ' disabled camera(s)';
  }

  setSidebarCamColor(cam, idx)
  {
    var camDiv = this.querySelector("#sidebarWebcams .sidebarWebcam[data-idx='"+idx+"']");

    if ((camDiv !== null) && (camDiv !== undefined))
    {
      var camStatusLED = camDiv.querySelector('.led');
      var tc = cam.totalCalls;
      var fc = cam.failedCalls;
      var ratio = (fc / tc) * 100;

      if (((ratio >= 0) && (ratio < 33)) || isNaN(ratio))
      {
        camStatusLED.classList.remove('led-red', 'led-yellow');
        camStatusLED.classList.add('led-blue');
      }
      if ((ratio >= 33) && (ratio < 66))
      {
        camStatusLED.classList.remove('led-blue', 'led-red');
        camStatusLED.classList.add('led-yellow');
      }
      if ((ratio >= 66) && (ratio <= 100))
      {
        camStatusLED.classList.remove('led-blue', 'led-yellow');
        camStatusLED.classList.add('led-red');
      }
    }
  }

  /**
   * Public functions
   */

  closeSidebarWebcamsCamActions()
  {
    let details = document.querySelectorAll('.sidebarWebcam details');
    details.forEach((detail) =>
    {
      detail.removeAttribute("open");
    });
  }

  setSidebarActiveCam(idx)
  {
    var nodeList = this.querySelectorAll('#sidebarWebcams .sidebarWebcam');
    nodeList.forEach((node) =>
    {
      if (parseInt(node.getAttribute('data-idx')) == idx)
      {
        node.classList.add('activeCam');
      }
      else
      {
        node.classList.remove('activeCam');
      }
    });
  }

  startLoadingIndicator(ev)
  {
    let cam = this.querySelector("#sidebarWebcams .sidebarWebcam[data-idx='"+ev.detail.idx+"']");
    if (cam != null)
    {
      cam.style.fontStyle = 'italic';
    }
  }

  stopLoadingIndicator(ev)
  {
    let cam = this.querySelector("#sidebarWebcams .sidebarWebcam[data-idx='"+ev.detail.idx+"']");
    if (cam != null)
    {
      cam.style.fontStyle = '';
    }
  }

  showSidebar(curCamIdx)
  {
    //var sidebar = document.getElementById('sidebar');
    var curCamElem = this.querySelector('.sidebarWebcam[data-idx="'+curCamIdx+'"]');

    // scroll current cam into view
    if (curCamElem != null)
    {
      setTimeout(() =>
      { // setTimeout is neccessary because of the CSS transitions
        this.scrollTop = parseInt(curCamElem.offsetTop) - 200;
      }, 500);
      this.style.width = '400px';
      this.style.opacity = '1';
    }

    this.open = true;
  }

  hideSidebar()
  {
    this.closeSidebarWebcamsCamActions();
    this.style.width = '';
    this.style.opacity = '';
    this.open = false;
  }

  toggleSidebar(curIdx)
  {
    if (this.open === false)
    {
      this.showSidebar(curIdx);
    }
    else
    {
      this.hideSidebar();
    }
  }

}
