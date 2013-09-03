using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Collections;
using ESRGC.GIS.Domain.Entities.Geometry;
using ESRGC.GIS.Domain.Entities;

namespace ESRGC.GIS.Domain.GeoTools
{
    public interface IParcelTool
    {
        IEnumerable getPolygonAtAddress(AddressPoint addressData, string[] attributes);
        IEnumerable getPolygonAtXY(double x, double y, string[] attributes);
        IEnumerable getPolygonWithId(double acctID, string[] attributes);
        IEnumerable getPolygonWithTaxIdAndParcelNum(string taxId, string parcelNum, string[] attributes);
    }
}
