using Microsoft.AspNetCore.Mvc;
using minipossystem.Models;

namespace minipossystem.Controllers
{
    public class salesController : Controller
    {
        public IActionResult Index()
        {
            MiniPosSystemContext context = new MiniPosSystemContext();
            List<SalesOrder> sales = context.SalesOrders.ToList();
            return View(sales);
        }
    }
}
