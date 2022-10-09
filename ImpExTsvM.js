export class ImpExTsvM
{
  constructor()
  {
    this.lineSep = '\r\n';
    this.colSep = '\t';
  }

  fromTSV(str)
  {
    try
    {
      let linesArr = str.split(this.lineSep);
      let colNames = linesArr.splice(0, 1)[0].split(this.colSep);

      let cams = linesArr.map((line) =>
      {
        let cam = {};
        const values = line.split(this.colSep);
        for (let i = 0; i < values.length; i++)
        {
          let value = values[i];
          if ((value === 'true')  || (value === 'TRUE'))  value = true;
          if ((value === 'false') || (value === 'FALSE')) value = false;
          cam[colNames[i]] = value;
        }
        return cam;
      });

      return cams;
    }
    catch (err)
    {
      throw err;
    }
  }

  toTSV(objArr)
  {
    var result = '';
    var lines = [];

    objArr.forEach((obj, idx) =>
    {
      if (idx == 0)
      {
        lines[0] = Object.keys(obj).join(this.colSep);
        lines[1] = Object.values(obj).join(this.colSep);
      }
      else
      {
        lines[idx+1] = Object.values(obj).join(this.colSep);
      }
    });

    result = lines.join(this.lineSep);
    return result;
  }

}