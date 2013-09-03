using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using ESRGC.GIS.Domain.Abstract;
using ESRGC.GIS.Domain.Services.Manifold;
using System.Collections;
using ESRGC.GIS.Domain.Helpers;
using ESRGC.GIS.Domain.GeoTools;

namespace ESRGC.GIS.Domain.GeoTools
{
    public class Foodshed: DataProcessor, IFoodshed
    {
        IEntitiesRepository _repository;
        public Foodshed(IEntitiesRepository repository)
        {
            _repository = repository;
        }
        #region IFoodshed Members

        public IEnumerable getFoodshedCitiesByState(string state, string[] attributes)
        {
            //build query
            var queryText = string.Format(@"select top 125 CZONE as [Zone], UAUC_NAME as [City]
                                            from [Consumptionneeds_{0}]", state);
            //build attributes for query
            string attributeString = HelperClass.buildAttributeString(attributes);
            //put attributes to the query
            queryText = queryText.Replace("(attributes)", attributeString);
            //execute query and return data
            try
            {
                var data = _repository.getData(queryText);
                if (data == null)
                {
                    throw new Exception("Error executing query: " + queryText);
                }
                var parsedData = parseData(data);

                return parsedData;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        
        public IEnumerable getFoodshedByCity(string city, string state, string[] attributes)
        {
            //build query
            var queryText = string.Format(@"SELECT prodzone as [ProductionZone], [{0}] AS HNE,
                            CSTR(CGEOMWKB(Project([Geom (I)],
                            CoordSys(""Map"" as COMPONENT)))) g
                            (attributes)--optional
                            FROM [{1}]
                            WHERE [{0}] > 0
                            Order by {0}
                            ", city, state);
            //build attributes for query
            string attributeString = HelperClass.buildAttributeString(attributes);
            //put attributes to the query
            queryText = queryText.Replace("(attributes)", attributeString);
            //execute query and return data
            try
            {
                var data = _repository.getData(queryText);
                var parsedData = parseData(data);
                return parsedData;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

       

        public IEnumerable getStats(string city, string state)
        {
            var queryText = string.Format(@"SELECT
	                        [FOODNEED_H] AS [need],
	                        sum([{0}]) AS current,
	                        sum(AreaEarth([Geom (I)],""m""))/10000 AS areaTotal 
                            FROM [{1}], [Consumptionneeds_{1}]
                            WHERE [{0}] > 0 and  CZONE = ""{0}""
                            GROUP BY [FOODNEED_H]
                            ", city, state);

            try
            {
                var data = _repository.getData(queryText);
                var parsedData = parseData(data);
                return parsedData;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        #endregion
    }
}
