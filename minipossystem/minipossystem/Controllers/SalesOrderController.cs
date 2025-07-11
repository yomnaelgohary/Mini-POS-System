using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp.Syntax;
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


    }
}
