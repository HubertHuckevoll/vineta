import { BaseV }         from '/frontschweine/js/BaseV.js';

export class PrefsV extends BaseV
{
  constructor(anim)
  {
    super(anim);
  }

  prefsOpen()
  {
    this.anim.hide('.mainScene');
    this.anim.show('.prefsScene');
  }

  prefsClose()
  {
    this.anim.hide('.prefsScene');
    this.anim.show('.mainScene');
  }

  drawSheets(ev)
  {
    // grab Sheets
    let sheets = ev.detail.payload.sheets;
    let str = '';

    // Sheets
    var sheetsEl = document.querySelector('.prefsSheetsList');
    sheetsEl.innerHTML = '';
    for (let idx = 0; idx < sheets.length; idx++)
    {
      let sheet = sheets[idx];
      var li = document.createElement('li');
      li.className = 'prefsSheetsList__item';
      var checked = (sheet.enabled === true) ? 'checked' : '';
      str = `<label>
              <input class="prefsSheetsEnabledCheckbox" data-idx="${idx}" type="checkbox" ${checked}>
              <span class="prefsSheetsDesc">${sheet.desc}</span>
             </label>
             &nbsp;&mdash;&nbsp;
             <button class="prefsSheetsRemoveLink" data-idx="${idx}">Remove</button>&nbsp;`;
      if (sheet.sheetUrl)
      {
        str += `<a class="prefsSheetsEditLink" href="${sheet.sheetUrl}" target="_blank">Edit Sheet</a>`;
      }
      str += `<br>
             <span class="prefsSheetsKey">${sheet.pubUrl}</span><br>
             <span class="prefsSheetsKey">${sheet.sheetUrl}</span>`;

      li.innerHTML = str;
      sheetsEl.appendChild(li);
    };
  }

  drawScreenModeHint(screenMode)
  {
    switch(screenMode)
    {
      case 'auto':
        document.getElementById('screenModeHint').innerHTML = 'Scale the image for optimal display.';
      break;

      case 'cover':
        document.getElementById('screenModeHint').innerHTML = 'Scale the image to be as large as possible and completely fill the screen. Some parts of the  image may not be visible.';
      break;

      case 'contain':
        document.getElementById('screenModeHint').innerHTML = 'Scale the image to the largest size, but such that both its width and its height can fit inside the content area.';
      break;

      case 'original':
        document.getElementById('screenModeHint').innerHTML = 'Don\'t scale the image.';
      break;
    }
  }

  drawPrefs(prefs)
  {
    // Other Prefs
    document.getElementById("slideTime").setAttribute('value', prefs.slideTime);

    document.getElementById("screenMode").value = prefs.screenMode;

    this.drawScreenModeHint(prefs.screenMode);

    document.getElementById("rotateMode").value = prefs.rotateMode;

    document.getElementById("prefsProxy").checked = prefs.proxy;

    // Add widget props
    var disabled = null;
    var oB = document.getElementById('overlaysBox');
    oB.innerHTML = '';
    prefs.overlays.forEach((overlay, idx) =>
    {
      disabled = (overlay.name === 'controls') ? ' disabled' : '';
      var modeList = '<select id="overlayShowSelect_'+overlay.name+'"><option value="1">Always</option><option value="2">On Mousemove</option><option value="3"'+disabled+'>Never</option></select>';
      var div = document.createElement('div');
      div.classList.add('formoTab__line');
      var name = overlay.name.charAt(0).toUpperCase() + overlay.name.slice(1);
      div.innerHTML = name+' '+modeList;
      div.querySelector('select').options.selectedIndex = overlay.show - 1 ;
      oB.appendChild(div);
    });

    document.getElementById('overlaysDisplayTime').setAttribute('value', prefs.overlaysDisplayTime);
    document.getElementById('overlaysOpacity').setAttribute('value', prefs.overlaysOpacity);
    document.getElementById('webcamLoadTimeout').setAttribute('value', prefs.webcamLoadTimeout);
    document.getElementById('logMode').value = prefs.logMode;
  }

  error(ev)
  {
    window.alert(ev.detail.payload.txt);
  }
}