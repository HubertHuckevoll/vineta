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
    const sw = document.querySelector('.sidebarWebcams');
    const swd = document.querySelector('.sidebarWebcamsDisabled');

    let sidebar = null;
    let templ = null;
    let cam = null;

    let enabledCamCount = 0;
    let disabledCamCount = 0;
    let previewURL = null;

    let now = new Date();
    now = now.getTime();

    sw.innerHTML = '';
    swd.innerHTML = '';

    for (let idx = 0; idx < webcams.length; idx++)
    {
      let webcam = webcams[idx];

      if ((webcam.enabled === true) && (webcam.visible === true))
      {
        enabledCamCount = enabledCamCount + 1;
        sidebar = sw;
        templ = document.querySelector('#sidebarWebcamT');
        cam = templ.content.cloneNode(true);
      }
      else if (webcam.enabled === false)
      {
        disabledCamCount = disabledCamCount + 1;
        previewURL = webcam.url.toString();
        previewURL = (previewURL.indexOf('?') != -1) ? previewURL + '&tstamp=' + now : previewURL + '?tstamp=' + now;
        sidebar = swd;
        templ = document.querySelector('#sidebarWebcamDisabledT');
        cam = templ.content.cloneNode(true);
      }

      if (webcam.visible === true)
      {
        cam.querySelector('.sidebarWebcam').setAttribute('data-idx', idx);
        cam.querySelector('.sidebarWebcam__location').innerHTML = webcam.location;
        cam.querySelector('.sidebarWebcam__desc').innerHTML = webcam.description;
        cam.querySelector('.sidebarWebcamCamActions').setAttribute("data-idx", idx);
        cam.querySelector('.sidebarWebcamCamActions__openCamHomepageButton').setAttribute('href', webcam.homepage);
        cam.querySelector('.sidebarWebcamCamActions__openCamImageInTab').setAttribute('href', webcam.url);

        if (webcam.sheetURL)
        {
          let ocigd = cam.querySelector('.sidebarWebcamCamActions__openCamInGDocs');
          ocigd.setAttribute('href', webcam.sheetURL);
          ocigd.innerHTML = `Open Containing Google Sheet ("${webcam.sheetName}")`;
          ocigd.classList.remove('sidebarWebcamCamActions__openCamInGDocs--disabled');
        }

        if (webcam.enabled === false)
        {
          cam.querySelector('.sidebarWebcam__previewImage').setAttribute('src', previewURL);
          cam.querySelector('.sidebarWebcam__previewImage').setAttribute('alt', `Image for ${webcam.homepage}`);
        };

        sidebar.appendChild(cam);

        this.setSidebarCamColor(webcam, idx);
      }
    }

    document.querySelector('.sidebarWebcamCount').innerHTML = enabledCamCount + ' active camera(s)';
    document.querySelector('.sidebarDisabledWebcamCount').innerHTML = disabledCamCount + ' disabled camera(s)';
  }

  setSidebarCamColor(cam, idx)
  {
    let camDiv = document.querySelector(".sidebarWebcams .sidebarWebcam[data-idx='"+idx+"']");

    if ((camDiv !== null) && (camDiv !== undefined))
    {
      let camStatusLED = camDiv.querySelector('.sidebarWebcam__summary');

      let tc = cam.totalCalls;
      let fc = cam.failedCalls;
      let ratio = (fc / tc) * 100;

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
    let nodeList = document.querySelectorAll('.sidebarWebcams .sidebarWebcam');
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
      let curCamElem = document.querySelector('.sidebarWebcam[data-idx="'+curCamIdx+'"]');
      if (curCamElem != null)
      {
        await this.anim.wait(500); // wait a litte, so we can be sure the sidebar animation has started
        this.scrollTop = parseInt(curCamElem.offsetTop) - 200;
      }
    }
  }

  resetFilterInput()
  {
    document.querySelector('.sidebarFilter__input').value = '';
  }
}
