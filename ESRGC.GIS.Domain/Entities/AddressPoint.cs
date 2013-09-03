using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using ESRGC.GIS.Domain.Entities.Geometry;
using System.ComponentModel.DataAnnotations;

namespace ESRGC.GIS.Domain.Entities
{
    public class AddressPoint: GeoBase
    {
        /// <summary>
        /// Center X
        /// </summary>
        public double X { get; set; }
        /// <summary>
        /// Center Y
        /// </summary>
        public double Y { get; set; }
        public double Lat { get; set; }
        public double Lon { get; set; }
        [Required(ErrorMessage = "Address is required")]
        public string Address { get; set; }
        [Required(ErrorMessage = "Zip Code is required")]
        public string ZipCode { get; set; }
    }
}
