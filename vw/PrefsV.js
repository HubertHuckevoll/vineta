import { BaseV }         from '/frontschweine/js/BaseV.js';

export class PrefsV extends BaseV
{
  constructor(evtEmt, anim)
  {
    super(evtEmt, anim);
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

    // Sheets
    var sheetsEl = document.querySelector('.prefsSheetsList');
    sheetsEl.innerHTML = '';

    for (let idx = 0; idx < sheets.length; idx++)
    {
      let sheet = sheets[idx];
      let li = document.querySelector('#prefsSheetsListItemT').content.cloneNode(true);

      li.querySelector('.prefsSheetsEnabledCheckbox').setAttribute('data-idx', idx)
      li.querySelector('.prefsSheetsEnabledCheckbox').checked = sheet.enabled;
      li.querySelector('.prefsSheetsDesc').innerHTML = sheet.desc;
      li.querySelector('.prefsSheetsRemoveLink').setAttribute('data-idx', idx);
      if (sheet.sheetUrl)
      {
        li.querySelector('.prefsSheetsEditLink').setAttribute('href', sheet.sheetUrl);
      }
      li.querySelector('.prefsSheetsKey').innerHTML = sheet.pubUrl;
      li.querySelector('.prefsSheetsKey').innerHTML = sheet.sheetUrl;

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
      const overlayNode = document.querySelector('#overlaysBoxItemT').content.cloneNode(true);

      let name = overlay.name.charAt(0).toUpperCase() + overlay.name.slice(1);
      disabled = (overlay.name === 'controls') ? true : false;

      overlayNode.querySelector('.overlayName').innerHTML = name;
      overlayNode.querySelector('select').setAttribute('id', 'overlayShowSelect_'+overlay.name);
      overlayNode.querySelector('select option[value="3"]').disabled = disabled;
      overlayNode.querySelector('select').options.selectedIndex = overlay.show - 1 ;

      oB.appendChild(overlayNode);
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