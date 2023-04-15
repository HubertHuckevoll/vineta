import { BaseM }         from '/frontschweine/js/BaseM.js';
import { ImpExTsvM }     from './ImpExTsvM.js';

export class WebcamsM extends BaseM
{
  constructor()
  {
    super();

    this.cams = []; // cam list, filtered or not
    this.disabledURLs = []; // Disabled Cam URLs for storage
  }

  async load(sheets)
  {
    this.cams = [];

    if (sheets.length > 0)
    {
      await Promise.all(sheets.map(async (sheet) =>
      {
        if (sheet.enabled)
        {
          try
          {
            this.emit('log', {'txt': 'Loading webcams from "'+sheet.desc+'"...'});
            let sheetWebcams = await this.loadSheetData(sheet.pubUrl);
            this.emit('log', {'txt': 'Loading webcams from "'+sheet.desc+'"...finished.'});

            this.loadDisabledURLs();

            sheetWebcams.forEach((cam, i) =>
            {
              if (cam.online == '1')
              {
                cam.totalCalls = 0;
                cam.failedCalls = 0;
                cam.sheetName = sheet.desc;
                cam.visible = true;
                cam.enabled = true;

                if (sheet.sheetUrl !== '')
                {
                  cam.sheetURL = sheet.sheetUrl+'&range='+(i+2)+':'+(i+2); //add 2 because the sheet is not zero based and we have the column names header line on top
                }

                if (this.isURLdisabled(cam.url))
                {
                  cam.enabled = false;
                }

                this.cams.push(cam);
              }
            });
          }
          catch(err)
          {
            this.emit('log', {'txt': err.message});
          }
        }
      }));
    }

    return this.cams;
  }

  async loadSheetData(url)
  {
    try
    {
      let impex = new ImpExTsvM();
      let resp = await fetch(url);
      let text = await resp.text();

      return await impex.fromTSV(text);
    }
    catch(err)
    {
      throw err;
    }
  }

  isURLdisabled(url)
  {
    for (var durl of this.disabledURLs)
    {
      if (durl == url)
      {
        return true;
      }
    };

    return false;
  }

  enableCam(idx)
  {
    this.cams[idx].enabled = true;
    this.saveDisabledURLs();
    return this.cams;
  }

  disableCam(idx)
  {
    this.cams[idx].enabled = false;
    this.saveDisabledURLs();
    return this.cams;
  }

  saveDisabledURLs()
  {
    this.disabledURLs = [];
    this.cams.forEach((cam) =>
    {
      if (cam.enabled === false)
      {
        this.disabledURLs.push(cam.url);
      }
    });

    localStorage.setItem('vinetaDisabledURLs', JSON.stringify(this.disabledURLs));
  }

  loadDisabledURLs()
  {
    var du = localStorage.getItem('vinetaDisabledURLs');

    if (du !== null)
    {
      this.disabledURLs = JSON.parse(du);
      return true;
    }

    return false;
  }

  filter(str)
  {
    this.cams.forEach((cam) =>
    {
      if ((cam.location.toLowerCase().search(str.toLowerCase()) != -1) ||
          (cam.sheetName.toLowerCase().search(str.toLowerCase()) != -1) ||
          (cam.description.toLowerCase().search(str.toLowerCase()) != -1))
      {
        cam.visible = true;
      }
      else
      {
        cam.visible = false;
      }
    });

    return this.cams;
  }

  filterReset()
  {
    this.cams.forEach((cam) =>
    {
      cam.visible = true;
    });

    return this.cams;
  }

}
