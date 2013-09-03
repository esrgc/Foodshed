using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using ESRGC.GIS.Domain.Abstract;
using ESRGC.GIS.Domain.Services;
using Manifold.Interop;
using System.Collections;

namespace ESRGC.GIS.Domain.Concrete
{
    public class ManifoldRepository: IEntitiesRepository
    {
        string _mapFilePath;
        public ManifoldRepository(string mapFilePath)
        {
            _mapFilePath = mapFilePath;
            _data = new DataManager() { Attributes = new List<Dictionary<string, object>>() };
        }

        private DataManager _data;

        #region IEntitiesRepository<T> Members

        public IQueryable Entities
        {
            get { return _data.Attributes.AsQueryable(); }
        }



        /// <summary>
        /// Get data in List<Dictionary<string, object>> type from manifold with provided mapfile name
        /// </summary>
        /// <param name="query">query to be executed</param>
        /// <param name="mapFileName">map file name used to search for the map file path</param>
        /// <returns>IQueryable type result</returns>
        public IQueryable getData(string query)
        {
            try
            {
                Table table = _data.executeManifoldQuery(query, _mapFilePath);
                _data.parseAttributes(table);

                return _data.Attributes.AsQueryable();
            }
            catch
            {
                return null;
            }
        }

        public void runUpdateQuery(string query)
        {
            _data.executeManifoldUpdateQuery(query, _mapFilePath);
        }
        #endregion
    }
}
