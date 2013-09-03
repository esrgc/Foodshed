using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ESRGC.GIS.Domain.Constants
{
    public static class MapExtents
    {
        public static ExtentRect BALTIMORE_EXTENT_RECT = new ExtentRect(398552.96253449, 167569.05746748,
                                                                        458450.683631004, 206037.193694739);
        public static ExtentRect WICOMICO_EXTENT_RECT = new ExtentRect(463493.761980874, 42034.8906684258,
                                                                        583289.204175984 , 117506.019251345);
        public static ExtentRect CRISFIELD_EXTENT_RECT = new ExtentRect(490570.226, 28890.5989,
                                                                        522069.159, 49120.177);
        public static ExtentRect TALBOT_EXTENT_RECT = new ExtentRect(424618.083078429, 87587.0549598854,
                                                                    543026.483078429, 162312.254959885);
    }

    public class ExtentRect
    {
        public double XMin { get; set; }
        public double YMin { get; set; }
        public double XMax { get; set; }
        public double YMax { get; set; }
        public int SpatialReference { get; set; }

        public const int STATE_PLANE_SPATIAL_REFERENCE = 26985;

        public ExtentRect(double xmin, double ymin, double xmax, double ymax)
        {
            XMin = xmin;
            YMin = ymin;
            XMax = xmax;
            YMax = ymax;
            SpatialReference = STATE_PLANE_SPATIAL_REFERENCE;
        }
        public ExtentRect(double xmin, double ymin, double xmax, double ymax, int spatialReference)
        {
            XMin = xmin;
            YMin = ymin;
            XMax = xmax;
            YMax = ymax;
            SpatialReference = spatialReference;
        }

        public string toJsonString()
        {
            var output = string.Format(@"(""xmin"": {0}, ""ymin"": {1}, ""xmax"": {2}, ""ymax"": {3}, ""spatialreference"": (""wkid"": {4}))",
                                    XMin, YMin, XMax, YMax, SpatialReference);
            return output.Replace('(', '{').Replace(')', '}');
        }
    }
}
