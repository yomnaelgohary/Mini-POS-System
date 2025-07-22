using Microsoft.AspNetCore.Mvc;
using minipossystem.Models;

namespace minipossystem.Controllers
{
    public class WarehouseController : Controller

    {
        private readonly MiniPosSystemContext _context;

        public WarehouseController(MiniPosSystemContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            int? branchId = HttpContext.Session.GetInt32("BranchId");
            if (!branchId.HasValue)
            {
                return RedirectToAction("Index", "Login");
            }
            List<Warehouse> warehouses = new List<Warehouse>();
            foreach (var warehouse in _context.Warehouses)
            {
                
                if (warehouse.BranchId == branchId.Value)
                {
                   
                    warehouses.Add(warehouse);
                }
            }
            return View(warehouses);
        }
    }
}
