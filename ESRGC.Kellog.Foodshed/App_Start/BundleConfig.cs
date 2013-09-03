using System.Web.Optimization;

namespace ESRGC.Kellog.Foodshed
{
    public class BundleConfig
    {
      // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
      public static void RegisterBundles(BundleCollection bundles) {
        bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                    "~/Scripts/jquery-{version}.js"));

        bundles.Add(new ScriptBundle("~/bundles/jqueryui").Include(
                    "~/Scripts/jquery-ui-{version}.js"));

        bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
          //"~/Scripts/jquery.unobtrusive*",
                    "~/Scripts/jquery.validate.js",
                    "~/Scripts/ESRGC/bootstrapValidation.js"
        ));
        bundles.Add(new ScriptBundle("~/bundles/jqueryval-unobtrusive").Include(
            "~/Scripts/jquery.validate.js",
            "~/Scripts/jquery.validate.unobtrusive*"

        ));

        // Use the development version of Modernizr to develop with and learn from. Then, when you're
        // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
        bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                    "~/Scripts/modernizr-*"));
        //bootstrap bundles
        bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
            "~/jsLib/bootstrap/js/bootstrap*",
            "~/jsLib/slider/js/bootstrap-slider.js"
        ));
        //App base Bundle
        bundles.Add(new ScriptBundle("~/bundles/foodshed").Include(
            "~/Scripts/wicket.js",
            "~/Scripts/wicket-leaflet.js",
            "~/Scripts/map/*.js",
            "~/Scripts/Applications/foodshed/controller/*.js",
            "~/Scripts/Applications/foodshed/store/*.js",
            "~/Scripts/Applications/foodshed/view/*.js",
            "~/Scripts/Applications/foodshed/thematicRenderer.js",
            "~/Scripts/Applications/foodshed/app.js"
        ));
       
        //site css
        bundles.Add(new StyleBundle("~/Content/css").Include(
            "~/Content/site.css",
            "~/Content/stickyFooter.css",
            "~/Content/leafletCustom.css"
        ));
        //bootstrap
        bundles.Add(new StyleBundle("~/Content/bootstrap/css/style").Include(
            "~/jsLib/bootstrap/css/bootstrap*",
            "~/jsLib/slider/css/slider.css"));
        //font-awesome
        bundles.Add(new StyleBundle("~/Content/font-awesome/css/style").Include(
            "~/Content/font-awesome/css/font-awesome.css"
        ));
        
    }
  }
}