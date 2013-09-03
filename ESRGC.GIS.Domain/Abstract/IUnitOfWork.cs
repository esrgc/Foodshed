using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using ESRGC.GIS.Domain.GeoTools;

namespace ESRGC.GIS.Domain.Abstract
{
    public interface IUnitOfWork
    {
        IParcelTool ParcelTool { get; }
        IAddressLocator AddressLocator { get; }
        IFoodshed FoodshedTool { get; }
    }
}
