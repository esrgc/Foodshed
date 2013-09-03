using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using ESRGC.GIS.Domain.Abstract;
using ESRGC.GIS.Domain.Entities.Geometry;
using ESRGC.GIS.Domain.Services.Manifold;
using System.Collections;
using ESRGC.GIS.Domain.Helpers;
using ESRGC.GIS.Domain.Extensions;
using ESRGC.GIS.Domain.Entities;

namespace ESRGC.GIS.Domain.GeoTools
{
    public class ParcelTool : PolygonProcessor, IParcelTool
    {
        IEntitiesRepository _repository;
        public ParcelTool(IEntitiesRepository repository)
        {
            _repository = repository;
            isValid = false;
        }

        public IEnumerable getPolygonAtAddress(AddressPoint addressData, string[] attributes)
        {
            if (addressData == null)
                throw new ArgumentNullException("addressData can not be null");
            var address = addressData.Address;
            var zipCode = addressData.ZipCode;

            //change street suffixes to match manifold addresses
            if (address.Contains("RD"))
                address = address.Replace("RD", "ROAD");
            if (address.Contains("LN"))
                address = address.Replace("LN", "LANE");
            if (address.Contains("DRIVE"))
                address = address.Replace("DRIVE", "DR");

            var queryText = string.Format(@"select [X (I)] as [X], [Y (I)] as [Y]
                                            from [Parcels]
                                            where [Parcels].[ADDRESS] = ""{0}""
                                            and [Parcels].[ZIPCODE] = ""{1}""", address
                                                                              , zipCode);
            var data = _repository.getData(queryText);

            var result = data.Cast<IDictionary>();//cast it to collection of dictionary

            if (result.Count() > 0)//found
            {
                try
                {
                    //store geocoding score
                    GeoCodingScore = addressData.GeoCodingScore;

                    //parse data
                    var record = result.First();//take the first one
                    var x = double.Parse(record["X"].ToString());
                    var y = double.Parse(record["Y"].ToString());
                    var returnData = getPolygonAtXY(x, y, attributes);

                    return returnData;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            else
                throw new Exception("Address not found. Query: " + queryText);

        }

        public IEnumerable getPolygonAtXY(double x, double y, string[] attributes)
        {
            //build query
            var queryText = string.Format(@"SELECT CStr(CGeomWKB(Project(([Geom (I)]),CoordSys(""Map"" AS Component)))) as g,
                                            [X (I)] as [X], [Y (I)] as [Y], [Longitude (I)] as Lon, [Latitude (I)] as Lat,
                                            [Address], [ZipCode]
                                            (attributes)--Optional
                                            From [Parcels]
                                            where touches([Parcels].[ID], 
                                            AssignCoordSys(NewPoint({0}, {1}),CoordSys(""Map"" AS Component)))", x, y);
            //build attributes for query
            string attributeString = HelperClass.buildAttributeString(attributes);
            //put attributes to the query
            queryText = queryText.Replace("(attributes)", attributeString);
            //execute query and return data
            try
            {
                var data = _repository.getData(queryText);
                if (data != null)
                {
                    Message = "ParcelTool.PolygonAtXY.Ok";
                    isValid = true;
                }
                var parsedData = parseData(data);

                return parsedData;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }



        public IEnumerable getPolygonWithId(double acctID, string[] attributes)
        {
            //build query
            string queryText = string.Format(@"select CStr(CGeomWKB(Project(([Geom (I)]),CoordSys(""Map"" AS Component)))) as g,
                                            [X (I)] as [X], [Y (I)] as [Y], [Longitude (I)] as Lon, [Latitude (I)] as Lat,
                                            [Address], [ZipCode]
                                            (attributes)--Optional
                                            from [Parcels] as [W] where [W].[ACCTID] = ""{0}""", acctID);
            //build attributes for query
            var attributeString = HelperClass.buildAttributeString(attributes);
            //put attributes to the query
            queryText = queryText.Replace("(attributes)", attributeString);
            //execute query and return data
            try
            {
                var data = _repository.getData(queryText);
                if (data != null)
                {
                    Message = "ParcelTool.PolygonwithId.Ok";
                    isValid = true;
                }
                var parsedData = parseData(data);

                return parsedData;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public IEnumerable getPolygonWithTaxIdAndParcelNum(string taxId, string parcelNum, string[] attributes)
        {
            //build query
            string queryText = string.Format(@"select CStr(CGeomWKB(Project(([Geom (I)]),CoordSys(""Map"" AS Component)))) as g,
                                            [X (I)] as [X], [Y (I)] as [Y], [Longitude (I)] as Lon, [Latitude (I)] as Lat,
                                            [Address], [ZipCode]    
                                            (attributes)
                                            from [Parcels] as [W] 
                                            where [W].[Map] = ""{0}""
                                            And [W].[Parcel] = ""{1}"""
                                            , taxId, parcelNum);
            //build attributes for query
            var attributeString = HelperClass.buildAttributeString(attributes);
            //put attributes to the query
            queryText = queryText.Replace("(attributes)", attributeString);
            //execute query and return data
            try
            {
                var data = _repository.getData(queryText);
                if (data != null)
                {
                    Message = "ParcelTool.PolygonWithTaxIdAndParcelNum.Ok";
                    isValid = true;
                }
                var parsedData = parseData(data);

                return parsedData;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }



    }
}
