using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ESRGC.GIS.Domain.Abstract
{
    public interface IEntitiesRepository
    {
        IQueryable Entities { get; }
        IQueryable getData(string query);
    }
}
