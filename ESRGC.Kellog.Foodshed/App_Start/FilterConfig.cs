using System.Web;
using System.Web.Mvc;

namespace ESRGC.Kellog.Foodshed
{
  public class FilterConfig
  {
    public static void RegisterGlobalFilters(GlobalFilterCollection filters) {
      filters.Add(new HandleErrorAttribute());
    }
  }
}