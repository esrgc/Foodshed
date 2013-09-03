using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Manifold.Interop;
using System.Data;
using ESRGCManifoldWrapper;
using SQLConnection;
using ESRGC.GIS.Domain.Entities.Geometry;

namespace ESRGC.GIS.Domain.Services
{    /// <summary>
    /// This class is used to get data from SQL server and Manifold
    /// </summary>
    public class DataManager
    {
        public List<Dictionary<string, object>> Attributes { get; set; }//data in tabular form used by SL app

        ManifoldWrapper _mw = null;
        /// <summary>
        /// Parse data from ADO.Net datatable to Attributes 
        /// (List<Dictionary<string, object>> type)
        /// </summary>
        /// <param name="table">ADO.Net data table</param>
        public void parseAttributes(DataTable table)
        {
            Attributes = new List<Dictionary<string, object>>();
            try
            {
                foreach (DataRow r in table.Rows)
                {
                    Dictionary<string, object> dataRow = new Dictionary<string, object>();
                    foreach (DataColumn dc in table.Columns)
                    {
                        dataRow.Add(dc.ColumnName, r[dc]);
                    }
                    Attributes.Add(dataRow);
                }
            }
            catch
            { }
        }
        /// <summary>
        /// Parse data from Manifold.Interop.ITable object into 
        /// Attributes (List<Dictionary<string, object>> type)
        /// </summary>
        /// <param name="table">Manifold data table</param>
        public void parseAttributes(Table table)
        {
            try
            {
                Attributes = new List<Dictionary<string, object>>();
                // parse all the data and add to attributes
                foreach (Record r in table.RecordSet)
                {
                    Dictionary<string, object> dataRow = new Dictionary<string, object>();
                    foreach (Column c in table.ColumnSet)
                    {
                        dataRow.Add(c.Name, r.get_Data(c));

                    }
                    Attributes.Add(dataRow);
                }
            }
            catch
            { }
        }
        /// <summary>
        /// Create an instance of ManifoldWraper and Execute the query. 
        /// ManifoldWrapper instance is store in ASP.Net session state
        /// </summary>
        /// <param name="query">"select" query string</param>
        /// <param name="mapFile">Mapfile name (not full path, just the filename). 
        /// Full path will be parsed in the function</param>
        /// <returns>Manifold.Interop.ITable instance holding results</returns>
        public Table executeManifoldQuery(string query, string mapFile)
        {
            try
            {
                //get manifold instance
                if(_mw == null)
                    _mw = new ManifoldWrapper(mapFile);

                //execute query
                Table manifoldTable = _mw.getManifoldDataTable(query);

                return manifoldTable;
            }
            catch
            {
                throw new Exception("Error executing manifold query");
            }

        }
        
        /// <summary>
        /// Execute the provided query and return the table result
        /// </summary>
        /// <param name="query">SQL query to be executed</param>
        /// <returns>Data table that contains the result</returns>
        public DataTable executeSQLQuery(string query, string constr)
        {
            try
            {
                SQLTools sqlWrapper = new SQLTools(constr);

                DataTable table = sqlWrapper.getTable(query);

                return table;
            }
            catch
            {
                throw new Exception("Error executing SQL query");
            }
        }

        public void executeManifoldUpdateQuery(string query, string mapFile)
        {
            try
            {
                //get manifold instance
                if (_mw == null)
                    _mw = new ManifoldWrapper(mapFile);
                
                //execute query
                _mw.updateQuery(query);
            }
            catch
            {
                throw new Exception("Error executing manifold query");
            }

        }
       
    }
   
}
