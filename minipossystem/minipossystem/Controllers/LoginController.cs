using Microsoft.AspNetCore.Mvc;
using minipossystem.Models;
using Microsoft.AspNetCore.Http; 

namespace minipossystem.Controllers
{
    public class LoginController : Controller
    {
        private readonly MiniPosSystemContext _context;

        public LoginController(MiniPosSystemContext context)
        {
            _context = context; 
        }

        [HttpGet]
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Login(int loginId)
        {
            var employee = _context.Employees.FirstOrDefault(e => e.EmployeeId == loginId); // ✅ Use _context

            if (employee != null)
            {
                HttpContext.Session.SetInt32("EmployeeId", employee.EmployeeId);
                HttpContext.Session.SetString("EmployeeRole", employee.EmployeeRole);

                // 
                switch (employee.EmployeeRole)
                {
                    case "SalesExecutive":
                        return RedirectToAction("Create", "SalesOrder");

                    case "ProcurementOfficer":
                        return RedirectToAction("Index", "PurchaseOrder");

                    case "WarehouseController":
                        return RedirectToAction("Index", "Warehouse");

                    default:
                        return RedirectToAction("Index", "Home");
                }
            }

            ModelState.AddModelError("", "Invalid Employee ID");
            return View("Index");
        }
    }
}
