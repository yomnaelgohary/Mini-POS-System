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

        // New action for viewing all sales orders
        public IActionResult ViewAllOrders()
        {
            List<SalesOrder> salesOrders = context.SalesOrders
                .OrderByDescending(so => so.SalesOrderId)
                .ToList();
            return View(salesOrders);
        }

        // New action for editing a specific sales order
        public IActionResult EditOrder(int id)
        {
            SalesOrder salesOrder = null;
            foreach (SalesOrder order in context.SalesOrders)
            {
                if (order.SalesOrderId == id)
                {
                    salesOrder = order;
                    break;
                }
            }

            if (salesOrder == null)
            {
                return NotFound();
            }

            List<SalesOrderItem> orderItems = new List<SalesOrderItem>();
            foreach (SalesOrderItem item in context.SalesOrderItems)
            {
                if (item.SalesOrderId == id)
                {
                    orderItems.Add(item);
                }
            }

            ViewBag.OrderItems = orderItems;
            ViewBag.Products = context.Products.ToList();
            return View(salesOrder);
        }

        [HttpPost]
        public JsonResult AddCustomer(string name, string mobile)
        {
            try
            {
                // Step 1: Manually declare a variable to store the result
                Costumer existingCustomer = null;
                // Step 2: Check if customer already exists by searching the database
                foreach (Costumer customer in context.Costumers)
                {
                    if (customer.CostumerName == name && customer.CostumerContactInfo == mobile)
                    {
                        existingCustomer = customer;
                        break;
                    }
                }
                // Step 3: If found, return a JSON response saying "Customer already exists"
                if (existingCustomer != null)
                {
                    var errorResponse = new
                    {
                        success = false,
                        message = "Customer already exists."
                    };
                    return Json(errorResponse);
                }
                // Step 4: If not found, create a new Customer object
                Costumer newCustomer = new Costumer();
                newCustomer.CostumerName = name;
                newCustomer.CostumerContactInfo = mobile;
                // Step 5: Add to database
                context.Costumers.Add(newCustomer);
                // Step 6: Save changes to the database
                context.SaveChanges();
                // Step 7: Return success response
                var successResponse = new
                {
                    success = true
                };
                return Json(successResponse);
            }
            catch (Exception ex)
            {
                // Step 8: If any error happens, return error message as JSON
                var error = new
                {
                    success = false,
                    message = ex.Message
                };
                return Json(error);
            }
        }

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
        public JsonResult createSalesOrder(int customerid)
        {
            SalesOrder newSalesOrder = new SalesOrder();
            newSalesOrder.CostumerId = customerid;
            newSalesOrder.Status = "Pending";
            newSalesOrder.EmployeeId = 1;
            newSalesOrder.OrderDate = DateOnly.FromDateTime(DateTime.Now);
            context.SalesOrders.Add(newSalesOrder);
            context.SaveChanges();

            var successResponse = new
            {
                success = true,
                salesOrderId = newSalesOrder.SalesOrderId
            };
            return Json(successResponse);
        }

        [HttpPost]
        public JsonResult addToSalesItem(int orderId, int productId, int productquantity, decimal totalprice)
        {
            SalesOrderItem newItem = new SalesOrderItem();
            newItem.SalesOrderId = orderId;
            newItem.ProductId = productId;
            newItem.Quantity = productquantity;
            newItem.Price = totalprice;

            context.SalesOrderItems.Add(newItem);
            context.SaveChanges();
            return Json(new { success = true });
        }

        // New method to search sales orders by ID
        [HttpPost]
        public JsonResult SearchSalesOrder(int orderId)
        {
            List<SalesOrder> foundOrders = new List<SalesOrder>();
            foreach (SalesOrder order in context.SalesOrders)
            {
                if (order.SalesOrderId == orderId)
                {
                    foundOrders.Add(order);
                    break;
                }
            }

            if (foundOrders.Count > 0)
            {
                var orderData = foundOrders.Select(order => new
                {
                    salesOrderId = order.SalesOrderId,
                    costumerId = order.CostumerId,
                    employeeId = order.EmployeeId,
                    orderDate = order.OrderDate.ToString(),
                    status = order.Status
                }).ToList();

                return Json(orderData);
            }
            return Json(null);
        }

        // New method to get all sales orders
        [HttpPost]
        public JsonResult GetAllSalesOrders()
        {
            List<SalesOrder> allOrders = context.SalesOrders
                .OrderByDescending(so => so.SalesOrderId)
                .ToList();

            var orderData = allOrders.Select(order => new
            {
                salesOrderId = order.SalesOrderId,
                costumerId = order.CostumerId,
                employeeId = order.EmployeeId,
                orderDate = order.OrderDate.ToString(),
                status = order.Status
            }).ToList();

            return Json(orderData);
        }

        // New method to delete a sales order
        [HttpPost]
        public JsonResult DeleteSalesOrder(int orderId)
        {
            try
            {
                // First, delete all sales order items
                List<SalesOrderItem> itemsToDelete = new List<SalesOrderItem>();
                foreach (SalesOrderItem item in context.SalesOrderItems)
                {
                    if (item.SalesOrderId == orderId)
                    {
                        itemsToDelete.Add(item);
                    }
                }

                foreach (SalesOrderItem item in itemsToDelete)
                {
                    context.SalesOrderItems.Remove(item);
                }

                // Then delete the sales order
                SalesOrder orderToDelete = null;
                foreach (SalesOrder order in context.SalesOrders)
                {
                    if (order.SalesOrderId == orderId)
                    {
                        orderToDelete = order;
                        break;
                    }
                }

                if (orderToDelete != null)
                {
                    context.SalesOrders.Remove(orderToDelete);
                    context.SaveChanges();
                    return Json(new { success = true, message = "Sales order deleted successfully." });
                }
                else
                {
                    return Json(new { success = false, message = "Sales order not found." });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        // New method to update sales order item quantity
        [HttpPost]
        public JsonResult UpdateOrderItemQuantity(int orderItemId, int newQuantity, decimal unitPrice)
        {
            try
            {
                SalesOrderItem itemToUpdate = null;
                foreach (SalesOrderItem item in context.SalesOrderItems)
                {
                    if (item.SalesOrderItemId == orderItemId)
                    {
                        itemToUpdate = item;
                        break;
                    }
                }

                if (itemToUpdate != null)
                {
                    itemToUpdate.Quantity = newQuantity;
                    itemToUpdate.Price = unitPrice * newQuantity;
                    context.SaveChanges();
                    return Json(new { success = true, message = "Quantity updated successfully." });
                }
                else
                {
                    return Json(new { success = false, message = "Order item not found." });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        // New method to get sales order details with items
        [HttpPost]
        public JsonResult GetSalesOrderDetails(int orderId)
        {
            SalesOrder salesOrder = null;
            foreach (SalesOrder order in context.SalesOrders)
            {
                if (order.SalesOrderId == orderId)
                {
                    salesOrder = order;
                    break;
                }
            }

            if (salesOrder == null)
            {
                return Json(null);
            }

            List<SalesOrderItem> orderItems = new List<SalesOrderItem>();
            foreach (SalesOrderItem item in context.SalesOrderItems)
            {
                if (item.SalesOrderId == orderId)
                {
                    orderItems.Add(item);
                }
            }

            var orderDetails = new
            {
                salesOrderId = salesOrder.SalesOrderId,
                costumerId = salesOrder.CostumerId,
                employeeId = salesOrder.EmployeeId,
                orderDate = salesOrder.OrderDate.ToString(),
                status = salesOrder.Status,
                items = orderItems.Select(item => {
                    Product product = null;
                    foreach (Product p in context.Products)
                    {
                        if (p.ProductId == item.ProductId)
                        {
                            product = p;
                            break;
                        }
                    }
                    return new
                    {
                        salesOrderItemId = item.SalesOrderItemId,
                        productId = item.ProductId,
                        productDescription = product?.Description ?? "Unknown Product",
                        productCode = product?.ProductCode ?? "N/A",
                        unitPrice = product?.SellingPrice ?? 0,
                        quantity = item.Quantity,
                        totalPrice = item.Price
                    };
                }).ToList()
            };

            return Json(orderDetails);
        }
    }
}
