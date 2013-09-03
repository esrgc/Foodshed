using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using ESRGC.GIS.Domain.Entities.Geometry;
using System.Collections;
using ESRGC.GIS.Domain.Extensions;

namespace ESRGC.GIS.Domain.Services.Manifold
{
    /// <summary>
    /// parses data containing point coordinates and returns PointData dictionary (IDictionary<PointData>)
    /// </summary>
    public class PointProcessor : GeoBase, IGeometryProcessor<PointData>
    {

        #region IGeometryProcessor<T> Members

        public IEnumerable<PointData> parseDataWithGraphic(IQueryable attributes)
        {
            var att = attributes as IQueryable<IDictionary>;

            foreach (IDictionary d in att)
            {
                var pointData = new PointData()
                {
                    isValid = this.isValid,
                    Message = this.Message,
                    GeoCodingScore = this.GeoCodingScore
                };

                string wkt = d["g"].ToString();
                if (!string.IsNullOrEmpty(wkt))
                {
                    pointData.Points = wkt.toPointList();
                    //d.Remove("g");//remove wkt string in dictionary
                    pointData.Attributes = new List<IDictionary>() { d }.ToObjectCollection();
                    yield return pointData;
                }
                else
                    throw new Exception("Query returns no WKT string");
            }

        }

        public IEnumerable<PointData> parseData(IQueryable attributes)
        {
            var att = attributes as IQueryable<IDictionary>;

            foreach (IDictionary d in att)
            {
                var pointData = new PointData()
                {
                    isValid = this.isValid,
                    Message = this.Message,
                    GeoCodingScore = this.GeoCodingScore
                };
                pointData.Attributes = new List<IDictionary>() { d }.ToObjectCollection();
                yield return pointData;
            }
        }

        #endregion
    }
    /// <summary>
    /// parses data containing polygon coordinates and returns PolygonData dictionary(IDictionary<PolygonData>)
    /// </summary>
    public class PolygonProcessor : GeoBase, IGeometryProcessor<PolygonData>
    {

        #region IGeometryProcessor<T> Members

        public IEnumerable<PolygonData> parseDataWithGraphic(IQueryable attributes)
        {
            var att = attributes as IQueryable<IDictionary>;

            foreach (IDictionary d in att)
            {
                var polygonData = new PolygonData()
                {
                    isValid = this.isValid,
                    Message = this.Message,
                    GeoCodingScore = this.GeoCodingScore
                };

                string wkt = d["g"].ToString();
                if (!string.IsNullOrEmpty(wkt))
                {
                    polygonData.Polygons = wkt.toPolygonList();
                    //d.Remove("g");//remove wkt string in dictionary
                    polygonData.Attributes = new List<IDictionary>() { d }.ToObjectCollection();
                    yield return polygonData;
                }
                else
                    throw new Exception("Query returns no WKT string");
            }

        }


        public IEnumerable<PolygonData> parseData(IQueryable attributes)
        {
            var att = attributes as IQueryable<IDictionary>;

            foreach (IDictionary d in att)
            {
                var polygonData = new PolygonData()
                {
                    isValid = this.isValid,
                    Message = this.Message,
                    GeoCodingScore = this.GeoCodingScore
                };

                polygonData.Attributes = new List<IDictionary>() { d }.ToObjectCollection();
                yield return polygonData;
            }
        }

        #endregion
    }
    /// <summary>
    /// parses data containing polyline coordinates and returns PolylineData dictionary(IDictionary<PolylineData>)
    /// </summary>
    public class PolylineProcessor : GeoBase, IGeometryProcessor<PolylineData>
    {
        #region IGeometryProcessor<T> Members

        public IEnumerable<PolylineData> parseDataWithGraphic(IQueryable attributes)
        {
            var att = attributes as IQueryable<IDictionary>;

            foreach (IDictionary d in att)
            {
                var polylineData = new PolylineData()
                {
                    isValid = this.isValid,
                    Message = this.Message,
                    GeoCodingScore = this.GeoCodingScore
                };
 
                string wkt = d["g"].ToString();
                if (!string.IsNullOrEmpty(wkt))
                {
                    polylineData.Polylines = wkt.toPolylineList();
                    //d.Remove("g");//remove wkt string in dictionary
                    polylineData.Attributes = new List<IDictionary>() { d }.ToObjectCollection();
                    yield return polylineData;
                }
                else
                    throw new Exception("Query returns no WKT string");
            }

        }

        public IEnumerable<PolylineData> parseData(IQueryable attributes)
        {
            var att = attributes as IQueryable<IDictionary>;

            foreach (IDictionary d in att)
            {
                var polylineData = new PolylineData()
                {
                    isValid = this.isValid,
                    Message = this.Message,
                    GeoCodingScore = this.GeoCodingScore
                };
                polylineData.Attributes = new List<IDictionary>() { d }.ToObjectCollection();
                yield return polylineData;
            }
        }

        #endregion
    }

    public class DataProcessor : IDataProcessor
    {

        #region IDataProcessor Members

        public IEnumerable parseData(IQueryable attributes)
        {
            var att = attributes as IQueryable<IDictionary>;

            return att.ToObjectCollection();
        }

        #endregion
    }
    
}
