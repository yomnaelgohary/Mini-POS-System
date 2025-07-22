using Microsoft.AspNetCore.Mvc;
using minipossystem.Models;
using Microsoft.AspNetCore.Http;
using System.Linq;


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
        [HttpGet]
        public IActionResult GetPurchaseInvoices()
        {
            int? branchId = HttpContext.Session.GetInt32("BranchId");
            if (branchId == null)
            {
                return Unauthorized();
            }

            var resultList = new List<object>();

            
            var invoices = _context.PurchaseOrderInvoices.ToList();

            foreach (var invoice in invoices)
            {
                var po = _context.PurchaseOrders.FirstOrDefault(p => p.PurchaseOrderId == invoice.PurchaseOrderId);
                if (po != null && po.BranchId == branchId)
                {
                    resultList.Add(new
                    {
                        invoiceId = invoice.PurchaseOrderInvoiceId,
                        purchaseOrderId = invoice.PurchaseOrderId,
                        invoicePrice = invoice.Price,
                        invoiceDate = invoice.Date,
                        orderDate = po.Date,
                        total = po.Price,
                        status = po.Status
                    });
                }
            }

            return Json(resultList);
        }
        [HttpGet]
        public IActionResult GetInvoiceItems(int invoiceId)
        {
            var items = _context.PurchaseOrderInvoiceItems
                .Where(i => i.PurchaseOrderInvoiceId == invoiceId)
                .Select(i => new
                {
                    Product = i.PurchaseOrderItem.Product.Description,
                    Quantity = i.Quantity,
                    UnitPrice = i.Price,
                    Total = i.Quantity * i.Price
                })
                .ToList();

            return Json(items);
        }
        [HttpGet]
        public IActionResult GetWarehousesForBranch(int branchId)
        {
            var warehouses = _context.Warehouses
                .Where(w => w.BranchId == branchId)
                .Select(w => new { w.WarehouseId, w.WarehouseName })
                .ToList();

            return Json(warehouses);
        }





    }
}
