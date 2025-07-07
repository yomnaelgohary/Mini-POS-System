using Microsoft.AspNetCore.Mvc;
using minipossystem.Models;
using Microsoft.AspNetCore.Mvc.Rendering;
namespace minipossystem.Controllers
{
    public class PurchaseOrderController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
