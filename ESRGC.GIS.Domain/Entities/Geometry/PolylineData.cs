using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ESRGC.GIS.Domain.Entities.Geometry
{
    public class PolylineData: GeoBase
    {
        public List<List<List<MapPoint>>> Polylines { get; set; }
    }
}
