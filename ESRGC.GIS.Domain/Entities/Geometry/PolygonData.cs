using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ESRGC.GIS.Domain.Entities.Geometry
{
    public class PolygonData: GeoBase
    {
        public List<List<List<MapPoint>>> Polygons { get; set; }
    }
}
