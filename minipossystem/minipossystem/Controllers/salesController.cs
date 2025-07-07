using Microsoft.AspNetCore.Mvc;

namespace minipossystem.Controllers
{
    public class salesController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
