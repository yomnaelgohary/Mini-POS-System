using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.EntityFrameworkCore;
using minipossystem.Models;

namespace minipossystem.Controllers
{
    public class SalesOrderController : Controller
    {
        //database conection 
        private readonly MiniPosSystemContext context = new MiniPosSystemContext();


        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Create()
        {
            List<Product> Products = context.Products.ToList();
            return View(Products);

        }
        [HttpPost]
        [HttpPost]
        public JsonResult AddCustomer(string name, string mobile)
        {
            try
            {
                Costumer existingCustomer = null;
                foreach (Costumer customer in context.Costumers)
                {
                    if (customer.CostumerName == name && customer.CostumerContactInfo == mobile)
                    {
                        existingCustomer = customer;
                        break;
                    }
                }

                if (existingCustomer != null)
                {
                    var errorResponse = new
                    {
                        success = false,
                        message = "Customer already exists."
                    };

                    return Json(errorResponse);
                }
                Costumer newCustomer = new Costumer();
                newCustomer.CostumerName = name;
                newCustomer.CostumerContactInfo = mobile;
                context.Costumers.Add(newCustomer);
                var successResponse = new
                {
                    success = true
                };

                return Json(successResponse);
            }
            catch (Exception ex)
            {
                var error = new
                {
                    success = false,
                    message = ex.Message
                };

                return Json(error);
            }
        }
        [HttpPost]
        [HttpPost]
        public JsonResult FindCustomer(string name, string mobile)
        {
            Costumer foundCustomer = null;

            foreach (Costumer customer in context.Costumers)
            {
                if (customer.CostumerName == name && customer.CostumerContactInfo == mobile)
                {
                    foundCustomer = customer;
                    break;
                }
            }

            if (foundCustomer != null)
            {
                Console.WriteLine("Customer Found: ID = " + foundCustomer.CostumerId + ", Name = " + foundCustomer.CostumerName);
                return Json(new
                {
                    costumerId = foundCustomer.CostumerId,
                    costumerName = foundCustomer.CostumerName,
                    costumerContactInfo = foundCustomer.CostumerContactInfo
                });
            }


            return Json(null);
        }

        [HttpPost]
        [HttpPost]
        public JsonResult SearchProduct(string id)
        {

            if (!int.TryParse(id, out int productId))
            {
                return Json(null);
            }

            Product productfound = null;

            foreach (Product product in context.Products)
            {
                if (product.ProductId == productId)
                {
                    productfound = product;
                    break;
                }
            }

            if (productfound != null)
            {
                return Json(new
                {
                    productId = productfound.ProductId,
                    description = productfound.Description,
                    sellingPrice = productfound.SellingPrice,
                    productCode = productfound.ProductCode
                });
            }

            return Json(null);
        }
        [HttpPost]

        public JsonResult CreateNewOrder(int CustomerId)
        {
            SalesOrder newsalesorder = new SalesOrder();
            newsalesorder.CostumerId = CustomerId;
            newsalesorder.EmployeeId = 1;
            newsalesorder.OrderDate = DateOnly.FromDateTime(DateTime.Today);
            newsalesorder.Status = "Pending";
            context.SalesOrders.Add(newsalesorder);
            context.SaveChanges();
            
            return Json(new { 
                success = true,
                orderId=newsalesorder.SalesOrderId
            });
        }




        [HttpPost]
        public IActionResult AddItemsToOrder([FromBody] AddOrderItemsRequest request) {
            var orderid = request.OrderId;
            for (int i=0; i< request.Products.Count; i++)
            {
                SalesOrderItem newsalesorderitem = new SalesOrderItem();
                newsalesorderitem.SalesOrderId = orderid;
                var product = request.Products[i];
                newsalesorderitem.ProductId = product.Id;
                newsalesorderitem.Quantity = product.Quantity;
                newsalesorderitem.Price = product.Price * product.Quantity;
                context.SalesOrderItems.Add(newsalesorderitem);
                context.SaveChanges();
            }
            return Json(new
            {
              success = true
            });


        }
        ///////////////
        public IActionResult AllOrders()
        {
            return View(); // This will render Views/SalesOrder/AllOrders.cshtml
        }

        [HttpGet]
        public JsonResult GetAllOrders()
        {
            List<object> ordersList = new List<object>();

            var allOrders = context.SalesOrders.ToList();

            foreach (var order in allOrders)
            {
                var customer = context.Costumers.FirstOrDefault(c => c.CostumerId == order.CostumerId);
                var items = context.SalesOrderItems.Where(i => i.SalesOrderId == order.SalesOrderId).ToList();

                var orderData = new
                {
                    SalesOrderId = order.SalesOrderId,
                    OrderDate = order.OrderDate,
                    Status = order.Status,
                    CustomerName = customer != null ? customer.CostumerName : "Unknown",
                    ItemCount = items.Count
                };

                ordersList.Add(orderData);
            }

            return Json(ordersList);
        }

        [HttpGet]
        [HttpGet]
        public JsonResult GetOrderDetails(int id)
        {
            SalesOrder order = context.SalesOrders.Include(o => o.Costumer).Include(o => o.SalesOrderItems).ThenInclude(item => item.Product).FirstOrDefault(o => o.SalesOrderId == id);

            if (order == null)
            {
                return Json(new { success = false, message = "Order not found" });
            }

            string customerName = "Unknown";
            if (order.Costumer != null)
            {
                customerName = order.Costumer.CostumerName;
            }

            List<object> items = new List<object>();

            foreach (SalesOrderItem item in order.SalesOrderItems)
            {
                string description = "N/A";
                string code = "N/A";

                if (item.Product != null)
                {
                    description = item.Product.Description;
                    code = item.Product.ProductCode;
                }

                items.Add(new
                {
                    SalesOrderItemId = item.SalesOrderItemId,
                    ProductId = item.ProductId,
                    Description = description,
                    ProductCode = code,
                    Quantity = item.Quantity,
                    Price = item.Price,
                    Total = item.Price * item.Quantity
                });
            }

            
            var orderData = new
            {
                SalesOrderId = order.SalesOrderId,
                OrderDate = order.OrderDate,
                Status = order.Status,
                CustomerName = customerName,
                Items = items
            };

           
            return Json(new { success = true, data = orderData });
        }
       // [HttpPost]
        //public JsonResult UpdateItemQuantity(int orderId, int productId, int newQuantity)
        //{
        //    var item = context.SalesOrderItems
        //        .FirstOrDefault(i => i.SalesOrderId == orderId && i.ProductId == productId);

        //    if (item == null)
        //        return Json(new { success = false, message = "Item not found" });

        //    item.Quantity = newQuantity;
        //    item.Price = (item.Price / item.Quantity) * newQuantity; // assuming total is saved in `Price`
        //    context.SaveChanges();

        //    return Json(new { success = true });
        //}
        [HttpPost]
        public JsonResult RemoveOrderItem(int orderId, int productId)
        {
            var item = context.SalesOrderItems
                .FirstOrDefault(i => i.SalesOrderId == orderId && i.ProductId == productId);

            if (item == null)
                return Json(new { success = false, message = "Item not found" });

            context.SalesOrderItems.Remove(item);
            context.SaveChanges();

            return Json(new { success = true });
        }
        [HttpPost]
        [HttpPost]
        public JsonResult CreateInvoice([FromBody] InvoiceRequest request)
        {
            try
            {
                if (request.Items == null || request.Items.Count == 0)
                {
                    return Json(new { success = false, message = "No items provided for the invoice." });
                }

                decimal totalPrice = 0;

                // Create invoice
                SalesInvoice newInvoice = new SalesInvoice
                {
                    SalesOrderId = request.OrderId,
                    InvoiveDate = DateOnly.FromDateTime(DateTime.Today),
                    Price = 0 // Temporary, will be updated later
                };

                context.SalesInvoices.Add(newInvoice);
                context.SaveChanges(); // Save to get the ID

                foreach (var selectedItem in request.Items)
                {
                    var orderItem = context.SalesOrderItems.FirstOrDefault(x =>
                        x.SalesOrderId == request.OrderId && x.ProductId == selectedItem.ProductId);

                    if (orderItem == null)
                    {
                        return Json(new { success = false, message = $"OrderItem not found for ProductId {selectedItem.ProductId}" });
                    }

                    // Link order item to invoice
                    SalesInvoiceItem invoiceItem = new SalesInvoiceItem
                    {
                        SalesInvoiceId = newInvoice.SalesInvoiceId,
                        SalesOrderItemId = orderItem.SalesOrderItemId
                    };

                    context.SalesInvoiceItems.Add(invoiceItem);
                    totalPrice += orderItem.Price;
                }

                newInvoice.Price = totalPrice;
                context.SaveChanges();

                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Error: " + ex.Message + " | " + ex.InnerException?.Message });
            }
        }

        [HttpPost]
        public JsonResult UpdateQuantityForSalesOrderItem(int newQty, int orderId, int itemid)
        {
            try
            {
                var item = context.SalesOrderItems.FirstOrDefault(i => i.SalesOrderItemId == itemid && i.SalesOrderId == orderId);

                if (item == null)
                    return Json(new { success = false, message = "SalesOrderItem not found." });

                item.Quantity = newQty;
                context.SaveChanges();

                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                // Return the full exception message
                return Json(new { success = false, message = ex.Message });
            }
        }







    }
}
