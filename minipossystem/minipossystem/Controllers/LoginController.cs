using Microsoft.AspNetCore.Mvc;
using minipossystem.Models;
using System;

namespace minipossystem.Controllers
{
    public class LoginController : Controller
    {
        private readonly MiniPosSystemContext context;

        public LoginController(MiniPosSystemContext ctx)
        {
            context = ctx;
        }

        [HttpGet]
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Login(int employeeId)
        {
            var employee = context.Employees.FirstOrDefault(e => e.EmployeeId == employeeId);

            if (employee == null)
            {
                ViewBag.Error = "Employee not found.";
                return View("Index");
            }

            var roleAccess = context.RoleAccesses.FirstOrDefault(r => r.RoleName == employee.EmployeeRole);

            if (roleAccess == null)
            {
                ViewBag.Error = "Access role not found.";
                return View("Index");
            }

            // Store info in session
            HttpContext.Session.SetInt32("EmployeeId", employee.EmployeeId);
            HttpContext.Session.SetString("RoleName", employee.EmployeeRole);

            return RedirectToAction("Dashboard", "Home");
        }
    }

}
