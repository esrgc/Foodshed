using System.Collections.Generic;
using System.Collections;
using System.ComponentModel.DataAnnotations;
using ESRGC.GIS.Domain.Extensions;

namespace ESRGC.GIS.Domain.Entities.Geometry
{
    public abstract class GeoBase
    {
        
        public int GeoCodingScore { get; set; }
        public bool isValid { get; set; }//indicates data is valid
        public string Message { get; set; }
        
        /// <summary>
        /// Data Attributes
        /// </summary>
        public IEnumerable Attributes { get; set; }
    }

    
}
