using Microsoft.AspNetCore.Mvc;
using minipossystem.Models;
using System;

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
        public IActionResult Login(int employeeId)
        {
            var employee = _context.Employees.FirstOrDefault(e => e.EmployeeId == employeeId);

            if (employee == null)
            {
                ViewBag.Error = "Employee not found.";
                return View("Index");
            }

            var roleAccess = _context.RoleAccesses.FirstOrDefault(r => r.RoleName == employee.EmployeeRole);
            if (roleAccess == null)
            {
                ViewBag.Error = "Role not configured in RoleAccess.";
                return View("Index");
            }

           
            HttpContext.Session.SetString("EmployeeId", employee.EmployeeId.ToString());
            HttpContext.Session.SetString("EmployeeRole", employee.EmployeeRole);
            HttpContext.Session.SetString("CanViewSalesOrders", roleAccess.CanViewSalesOrders.ToString());
            HttpContext.Session.SetString("CanCreateInvoice", roleAccess.CanCreateInvoice.ToString());
            HttpContext.Session.SetString("CanCreditInvoice", roleAccess.CanCreditInvoice.ToString());
            HttpContext.Session.SetString("CanCreatePurchaseOrder", roleAccess.CanCreatePurchaseOrder.ToString());
            HttpContext.Session.SetString("CanReceivePurchaseOrderInvoice", roleAccess.CanReceivePurchaseOrderInvoice.ToString());
            HttpContext.Session.SetString("CanCreditPurchaseOrderInvoice", roleAccess.CanCreditPurchaseOrderInvoice.ToString());
            HttpContext.Session.SetString("CanReciveProductstoWH", roleAccess.CanReciveProductstoWH.ToString());
            HttpContext.Session.SetString("CanSupplyProductsFromWH", roleAccess.CanSupplyProductsFromWH.ToString());

            return RedirectToAction("Index", "Home");
        }
    }

}
