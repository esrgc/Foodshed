using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using ESRGC.GIS.Domain.Abstract;
using ESRGC.GIS.Domain.Services;
using System.Data;
using System.Collections;

namespace ESRGC.GIS.Domain.Concrete
{
    public class SqlRepository: IEntitiesRepository
    {
        string _sqlConnectionStr;
        public SqlRepository(string connectionString)
        {
            _sqlConnectionStr = connectionString;
        }
        private DataManager data;
        #region IEntitiesRepository Members

        public IQueryable Entities
        {
            get { return data.Attributes.AsQueryable(); }
        }

       

        /// <summary>
        /// Get data from SQL server with provided query
        /// </summary>
        /// <param name="query">query string to be executed</param>
        /// <returns>SPDDataManager with data result as attributes</returns>
        public IQueryable getData(string query)
        {
            try
            {
                if (data == null)
                    data = new DataManager();

                DataTable table = data.executeSQLQuery(query, _sqlConnectionStr);
                data.parseAttributes(table);

                return data.Attributes.AsQueryable<IDictionary>();

            }
            catch
            {
                return null;
            }
        }
        
        #endregion
    }
}
