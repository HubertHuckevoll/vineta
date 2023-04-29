import { BaseM }         from '/frontschweine/js/BaseM.js';

export class SheetsM extends BaseM
{
  constructor(evtEmt)
  {
    super(evtEmt);

    this.sheets = [
      {
        pubUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vScHpI5MimEVrf65dMnl5NGhpThsbQjkF8ZtoqSIMnnHW1AtBf-C2Kp30mYVDVfY1TtaIsM40F-axW1/pub?output=tsv",
        sheetUrl: 'https://docs.google.com/spreadsheets/d/1LmOmUFY_OuUmOS7l9HZ0R7n3YuJIJ-OAwhpkAwW1jeQ/edit#gid=0',
        desc: "Ostsee",
        enabled: true
      },
      {
        pubUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vREpUc2QFGf856IopZmnYhFzWgm8VmMule9FCskAgVUSzCqqsB2r_LSiYVJ8Baj6fH2a7vMxpyAtPIl/pub?output=tsv',
        sheetUrl: 'https://docs.google.com/spreadsheets/d/1zH0A9MS_O0PdVSDsVXyiIppwg0TquF54UBccG9qvF7s/edit#gid=0',
        desc: 'Nordsee',
        enabled: true
      },
      {
        pubUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSZDGgYEPtsz8ORmX9QFygn2fZ9y5WO7IoSMkRS32QxWRIMcmtkH5a42Ye_wxldFcuYQ6RFyiuaFcnP/pub?output=tsv',
        sheetUrl: 'https://docs.google.com/spreadsheets/d/1GUuIzqqdo6BkQ34tSDrUCJxPC6kjfuzCenOv-rrh37c/edit#gid=0',
        desc: 'Norddeutschland',
        enabled: true
      }
    ];
  }

  load()
  {
    let p = localStorage.getItem('vinetaSheets');

    if (p !== null)
    {
      this.sheets = JSON.parse(p);
    }

    return this.getSheets();
  }

  getSheets()
  {
    return this.sheets;
  }

  setSheets(sheets)
  {
    if (sheets !== undefined)
    {
      this.sheets = sheets;
      this.save();
    }
  }

  addSheet(pubUrl, sheetUrl = '', desc)
  {
    let expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    let regex = new RegExp(expression);

    if ((pubUrl != '') && (desc != ''))
    {
      if (pubUrl.match(regex))
      {
        let alreadyIn = false;
        this.sheets.forEach((sheet) =>
        {
          if (sheet.pubUrl == pubUrl)
          {
            alreadyIn = true;
          }
        });

        if (!alreadyIn)
        {
          let sheet =
          {
            pubUrl: pubUrl,
            sheetUrl: sheetUrl,
            desc: desc,
            enabled: true
          };

          this.sheets.push(sheet);
          this.save();
          return this.getSheets();
        }
        else
        {
          throw new Error('Sheet not added, was already in list.');
        }
      }
      else
      {
        throw new Error('Not a valid URL.');
      }
    }
    else
    {
      throw new Error('Description or TSV-file URL empty.');
    }
  }

  removeSheet(idx)
  {
    this.sheets.splice(idx, 1);
    this.save();
    return this.getSheets();
  }

  toggleSheet(idx, val)
  {
    this.sheets[idx].enabled = val;
    this.save();
    return this.getSheets();
  }

  save()
  {
    localStorage.setItem('vinetaSheets', JSON.stringify(this.sheets));
  }

  getSheetsForFile()
  {
    let sheets = this.getSheets();
    let impex = new ImpExTsvM();
    let s = impex.toTSV(sheets);
    let blob = new Blob([s], {type: 'text/tab-separated-values'});

    return blob;
  }

  setSheetsFromFile(file)
  {
    return new Promise((resolve, reject) =>
    {
      if (file.name.search(/\.tsv$/i) != -1)
      {
        var reader = new FileReader();
        reader.onload = async (ev) =>
        {
          let impex = new ImpExTsvM();
          let sheets = await impex.fromTSV(ev.target.result);
          this.setSheets(sheets);

          resolve(true);
        };
        try
        {
          reader.readAsText(file);
        }
        catch(err)
        {
          reject(false);
        }
      }
      else
      {
        reject(false);
      }
    });
  }

}
