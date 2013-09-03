using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using ESRGC.GIS.Domain.Entities.Geometry;
using System.Collections;

namespace ESRGC.GIS.Domain.Services.Manifold
{
    public interface IGeometryProcessor<T>
    {
        IEnumerable<T> parseDataWithGraphic(IQueryable attributes);
        IEnumerable<T> parseData(IQueryable attributes);
    }

    public interface IDataProcessor
    {
        IEnumerable parseData(IQueryable attributes);
    }
}
