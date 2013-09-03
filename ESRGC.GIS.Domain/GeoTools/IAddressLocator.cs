using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using ESRGC.GIS.Domain.Entities.Geometry;
using ESRGC.GIS.Domain.Entities;

namespace ESRGC.GIS.Domain.GeoTools
{
    public interface IAddressLocator
    {
        AddressPoint GeoData { get; }
        bool geocode(string address, string zipCode);
        bool reverseGeocode(double x, double y, double radius);
    }
}
