using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using ESRGC.GIS.Domain.Abstract;
using ESRGC.GIS.Domain.GeoTools;

namespace ESRGC.GIS.Domain.Concrete
{
    public class WorkUnit: IUnitOfWork
    {
        IEntitiesRepository _repository = null;
        IParcelTool _parcelTool = null;
        IAddressLocator _addressLocator = null;
        IFoodshed _foodshedTool = null;

        /// <summary>
        /// Constructor initializes the work unit for crime map
        /// </summary>
        /// <param name="repository">Manifold Repository instance</param>
        public WorkUnit(IEntitiesRepository repository)
        {
            _repository = repository;
        }

        #region IUnitOfWork Members

        public IParcelTool ParcelTool
        {
            get
            {
                return _parcelTool == null? _parcelTool = new ParcelTool(_repository): _parcelTool;
            }
            
        }

        public IAddressLocator AddressLocator
        {
            get
            {
                return _addressLocator == null ? _addressLocator = new AddressLocator() : _addressLocator;
            }
           
        }


        public IFoodshed FoodshedTool
        {
            get { return _foodshedTool == null ? _foodshedTool = new Foodshed(_repository) : _foodshedTool; }
        }

        #endregion
    }
}
