using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ESRGC.GIS.Domain.Abstract;

namespace ESRGC.Kellog.Foodshed.Controllers
{
    public class FoodshedController : Controller
    {
      IUnitOfWork _workUnit;

      public FoodshedController(IUnitOfWork workUnit) {
        _workUnit = workUnit;
      }

      public JsonResult getCitiesByState(string state) {
        try {
          var foodshedRepo = _workUnit.FoodshedTool;
          var data = foodshedRepo.getFoodshedCitiesByState(state, new string[] { });
          return Json(data, JsonRequestBehavior.AllowGet);
        }
        catch (Exception ex) {
          throw ex;
        }
      }
      public JsonResult getFoodsheds(string state, string city) {
        if (string.IsNullOrEmpty(city) || string.IsNullOrEmpty(state))
          throw new ArgumentNullException("city and state can not be null");

        try {
          var foodshedRepo = _workUnit.FoodshedTool;
          var data = foodshedRepo.getFoodshedByCity(city, state, new string[] { });
          return Json(data, JsonRequestBehavior.AllowGet);
        }
        catch (Exception ex) {
          throw ex;
        }
      }
      public JsonResult getStats(string state, string city) {
        if (string.IsNullOrEmpty(state) || string.IsNullOrEmpty(city))
          throw new ArgumentNullException("State and City can not be null");
        try {
          var foodshedRepo = _workUnit.FoodshedTool;
          var data = foodshedRepo.getStats(city, state);
          return Json(data, JsonRequestBehavior.AllowGet);
        }
        catch (Exception ex) {
          throw ex;
        }
      }

    }
}
