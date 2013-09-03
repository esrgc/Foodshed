using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ESRGC.GIS.Domain.Entities.Geometry
{
    public class PointData: GeoBase
    {
        public IEnumerable<MapPoint> Points { get; set; }
    }
}
