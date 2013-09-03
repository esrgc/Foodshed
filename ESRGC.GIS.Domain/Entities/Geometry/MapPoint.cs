using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ESRGC.GIS.Domain.Entities.Geometry
{
    public class MapPoint
    {
        public MapPoint(double x, double y)
        {
            X = x; Y = y;
        }
        public double X;
        public double Y;
    }
}
