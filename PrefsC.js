"use strict";

class PrefsC extends BaseC
{

  constructor(views, models, subcontrollers)
  {
    super();

    this.views = views;
    this.models = models;
    this.subcontrollers = subcontrollers;

    this.sheetsHaveChanged = false;

    // wire ui elements
    this.on('click', '.prefsCloseButton',                     this.prefsClose.bind(this));
    this.on('click', '.prefsSheetsAddButton',                 this.prefsSheetsAddButton.bind(this));
    this.on('click', '.prefsSheetsEnabledCheckbox',           this.prefsSheetsEnabledCheckbox.bind(this));
    this.on('click', '.prefsSheetsRemoveLink',                this.prefsSheetsRemoveLink.bind(this));
    this.on('click', '.prefsSheetsEditLink',                  this.prefsSheetsEditLink.bind(this));
    this.on('change',   '.prefsSceneTabPresentation select',  this.prefsSelectChange.bind(this));
    this.on('formoSliderChange', '.prefsSceneTabPresentation .formoSlider', this.prefsSliderChange.bind(this));
    this.on('click',  '#prefsExpSheets',                      this.prefsExpSheets.bind(this));
    this.on('click',  '#prefsImpSheetsSelect',                this.prefsImpSheetsSelect.bind(this));
    this.on('change', '#prefsImpSheetsFS',                    this.prefsImpSheetsFS.bind(this));
    this.on('change', '#prefsProxy',                          this.prefsProxyChanged.bind(this));

    // these come from our pref model
    this.on('sheetsChange', this.views.prefsView.drawSheets.bind(this.views.prefsView));
    this.on('sheetsError', this.views.prefsView.error.bind(this.views.prefsView));
  }

  async prefsClose(ev)
  {
    this.views.prefsView.prefsClose();

    let prefs = this.models.prefs.getPrefs();
    this.subcontrollers.rotator.setPrefs(prefs);
    this.subcontrollers.widgets.update(prefs);
    this.views.presentView.setWidgetsOpacity(prefs);

    if (this.sheetsHaveChanged === true)
    {
      let sheets = this.models.sheets.load();
      let webcams = await this.models.webcams.load(sheets);
      this.subcontrollers.rotator.stop();
      this.subcontrollers.rotator.setWebcams(webcams);
      this.views.sidebarView.render(webcams);
      this.subcontrollers.rotator.start();
      this.sheetsHaveChanged = false;
    }
  }

  prefsSheetsAddButton(ev)
  {
    let pubUrl = document.getElementById('prefsSheetsAddPub').value;
    let sheetUrl = document.getElementById('prefsSheetsAddSheet').value;
    let desc =  document.getElementById('prefsSheetsAddDesc').value;

    this.models.sheets.addSheet(pubUrl, sheetUrl, desc);
    this.sheetsHaveChanged = true;
  }

  prefsSheetsEnabledCheckbox(ev)
  {
    let idx = ev.target.getAttribute('data-idx');
    this.models.sheets.toggleSheet(idx, ev.target.checked);
    this.sheetsHaveChanged = true;
  }

  prefsSheetsRemoveLink(ev)
  {
    let idx = ev.target.getAttribute('data-idx');
    this.models.sheets.removeSheet(idx);
    this.sheetsHaveChanged = true;
  }

  prefsSheetsEditLink(ev)
  {
    this.sheetsHaveChanged = true;
  }

  prefsSelectChange(ev)
  {
    let val = null;
    let id = ev.target.id;

    if (id.startsWith('overlayShowSelect_'))
    { // Overlays
      id = id.replace(/^(overlayShowSelect_)/,"");
      let overlays = this.models.prefs.getPrefs().overlays;
      for (let i=0; i<overlays.length; i++)
      {
        if (overlays[i].name == id)
        {
          overlays[i].show = ev.target.value;
        }
      }
      this.models.prefs.setPref('overlays', overlays);
    }
    else
    { // all other select boxes...
      let e = document.getElementById(id);
      let val = e.options[e.selectedIndex].value;

      this.models.prefs.setPref(id, val);

      if (id == 'screenMode')
      { // Screen Mode (cover, contain...) => update hint.
        this.views.prefsView.drawScreenModeHint(val);
      }
    }
  }

  prefsProxyChanged(ev)
  {
    let val = document.getElementById('prefsProxy').checked;
    this.models.prefs.setPref('proxy', val);
  }

  prefsSliderChange(ev)
  {
    let id = ev.target.id;
    let val = ev.detail.payload.value;

    this.models.prefs.setPref(id, val);
  }

  prefsExpSheets(ev)
  {
    let today = new Date();
    let d = today.getDate();
    let m = today.getMonth()+1; //January is 0!
    let y = today.getFullYear();
    if(d<10){d='0'+d}
    if(m<10){m='0'+m}
    today = y+'-'+m+'-'+d;

    window.URL = window.URL || window.webkitURL;
    let blob = this.models.sheets.getSheetsForFile();
    ev.target.setAttribute("href", window.URL.createObjectURL(blob));
    ev.target.setAttribute("download", "vineta_sheets_"+today+".tsv");
    ev.cancelBubble = false;
  }

  prefsImpSheetsSelect(ev)
  {
    document.getElementById("prefsImpSheetsFS").click(); // raise file selector
  }

  async prefsImpSheetsFS(ev)
  {
    let file = ev.target.files[0];
    let isSure = window.confirm('This will overwrite your current sheet list with the contents from "'+file.name+'". Are you sure?');
    if (isSure)
    {
      document.getElementById("prefsImpSheetsFS").value = null; // necessary to make the FS fire the change event next time...
      let success = await this.models.sheets.setSheetsFromFile(file);
      if (success)
      {
        this.sheetsHaveChanged = true;
      }
      else
      {
        alert("Error while importing the file.");
      }
    }
  }

}