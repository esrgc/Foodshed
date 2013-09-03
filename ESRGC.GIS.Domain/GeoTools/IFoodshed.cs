using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Collections;

namespace ESRGC.GIS.Domain.GeoTools
{
    public interface IFoodshed
    {
        IEnumerable getFoodshedCitiesByState(string state, string[] attributes);
        IEnumerable getFoodshedByCity(string city, string state, string[] attributes);
        IEnumerable getStats(string city, string state);
    }
}
