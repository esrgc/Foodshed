using System;
using System.Collections.Generic;
using System.Web.Mvc;
using Ninject;
using System.Configuration;
using System.Web;
using ESRGC.GIS.Domain.Abstract;
using ESRGC.GIS.Domain.Concrete;


namespace ESRGC.Kellog.Foodshed.Infrastructure
{
  public class NinjectDependencyResolver : IDependencyResolver
  {
    IKernel _kernel;
    public NinjectDependencyResolver() {
      _kernel = new StandardKernel();
      addBindings();
    }
    private void addBindings() {
      _kernel.Bind<IUnitOfWork>().To<WorkUnit>();

      //get map path from app settings
      var mapFileName = ConfigurationManager.AppSettings["mapFile"];
      var mapFilePath = HttpContext.Current.Server.MapPath("Maps/" + mapFileName);

      _kernel.Bind<IEntitiesRepository>()
               .To<ManifoldRepository>()
               .WithConstructorArgument("mapFilePath", mapFilePath);
    }
    public object GetService(Type serviceType) {
      return _kernel.TryGet(serviceType);
    }
    public IEnumerable<object> GetServices(Type serviceType) {
      return _kernel.GetAll(serviceType);
    }
  }
}