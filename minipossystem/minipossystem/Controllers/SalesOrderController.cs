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

        // New method to get sales order details for invoice creation
        [HttpPost]
        public JsonResult GetSalesOrderForInvoice(int orderId)
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

            // Get customer details
            Costumer customer = null;
            foreach (Costumer c in context.Costumers)
            {
                if (c.CostumerId == salesOrder.CostumerId)
                {
                    customer = c;
                    break;
                }
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
                customerName = customer?.CostumerName ?? "Unknown Customer",
                customerContact = customer?.CostumerContactInfo ?? "N/A",
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

        // New method to create sales invoice - FIXED to match your database structure
        [HttpPost]
        public JsonResult CreateSalesInvoice(int salesOrderId, decimal totalAmount)
        {
            try
            {
                SalesInvoice newInvoice = new SalesInvoice();
                newInvoice.SalesOrderId = salesOrderId;
                newInvoice.InvoiveDate = DateOnly.FromDateTime(DateTime.Now); // Note: using your typo "InvoiveDate"
                newInvoice.Price = totalAmount; // Note: using "Price" not "TotalPrice"

                context.SalesInvoices.Add(newInvoice);
                context.SaveChanges();

                return Json(new { success = true, invoiceId = newInvoice.SalesInvoiceId });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        // New method to add items to sales invoice - FIXED to match your database structure
        [HttpPost]
        public JsonResult AddToSalesInvoiceItem(int invoiceId, int orderItemId, int quantity, decimal totalPrice)
        {
            try
            {
                SalesInvoiceItem newInvoiceItem = new SalesInvoiceItem();
                newInvoiceItem.SalesInvoiceId = invoiceId;
                newInvoiceItem.SalesOrderItemId = orderItemId;
                // Note: Your SalesInvoiceItem model doesn't have Quantity and Price properties
                // You might need to add them to your database model

                context.SalesInvoiceItems.Add(newInvoiceItem);
                context.SaveChanges();

                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        // New method to get all invoices - FIXED to match your database structure
        [HttpPost]
        public JsonResult GetAllInvoices()
        {
            List<SalesInvoice> allInvoices = context.SalesInvoices
                .OrderByDescending(si => si.SalesInvoiceId)
                .ToList();

            var invoiceData = allInvoices.Select(invoice => {
                // Get sales order details
                SalesOrder salesOrder = null;
                foreach (SalesOrder order in context.SalesOrders)
                {
                    if (order.SalesOrderId == invoice.SalesOrderId)
                    {
                        salesOrder = order;
                        break;
                    }
                }

                // Get customer details
                Costumer customer = null;
                if (salesOrder != null)
                {
                    foreach (Costumer c in context.Costumers)
                    {
                        if (c.CostumerId == salesOrder.CostumerId)
                        {
                            customer = c;
                            break;
                        }
                    }
                }

                return new
                {
                    invoiceId = invoice.SalesInvoiceId,
                    salesOrderId = invoice.SalesOrderId,
                    customerName = customer?.CostumerName ?? "Unknown Customer",
                    customerContact = customer?.CostumerContactInfo ?? "N/A",
                    date = invoice.InvoiveDate.ToString(), // Note: using your typo "InvoiveDate"
                    totalPrice = invoice.Price, // Note: using "Price" not "TotalPrice"
                    employeeId = salesOrder?.EmployeeId ?? 0
                };
            }).ToList();

            return Json(invoiceData);
        }

        // New method to get invoice details for credit note creation - FIXED
        [HttpPost]
        public JsonResult GetInvoiceDetails(int invoiceId)
        {
            SalesInvoice invoice = null;
            foreach (SalesInvoice inv in context.SalesInvoices)
            {
                if (inv.SalesInvoiceId == invoiceId)
                {
                    invoice = inv;
                    break;
                }
            }

            if (invoice == null)
            {
                return Json(null);
            }

            // Get sales order details
            SalesOrder salesOrder = null;
            foreach (SalesOrder order in context.SalesOrders)
            {
                if (order.SalesOrderId == invoice.SalesOrderId)
                {
                    salesOrder = order;
                    break;
                }
            }

            // Get customer details
            Costumer customer = null;
            if (salesOrder != null)
            {
                foreach (Costumer c in context.Costumers)
                {
                    if (c.CostumerId == salesOrder.CostumerId)
                    {
                        customer = c;
                        break;
                    }
                }
            }

            // Get invoice items
            List<SalesInvoiceItem> invoiceItems = new List<SalesInvoiceItem>();
            foreach (SalesInvoiceItem item in context.SalesInvoiceItems)
            {
                if (item.SalesInvoiceId == invoiceId)
                {
                    invoiceItems.Add(item);
                }
            }

            var invoiceDetails = new
            {
                invoiceId = invoice.SalesInvoiceId,
                salesOrderId = invoice.SalesOrderId,
                customerName = customer?.CostumerName ?? "Unknown Customer",
                customerContact = customer?.CostumerContactInfo ?? "N/A",
                date = invoice.InvoiveDate.ToString(), // Note: using your typo "InvoiveDate"
                totalPrice = invoice.Price, // Note: using "Price" not "TotalPrice"
                employeeId = salesOrder?.EmployeeId ?? 0,
                items = invoiceItems.Select(item => {
                    // Get order item details
                    SalesOrderItem orderItem = null;
                    foreach (SalesOrderItem oi in context.SalesOrderItems)
                    {
                        if (oi.SalesOrderItemId == item.SalesOrderItemId)
                        {
                            orderItem = oi;
                            break;
                        }
                    }

                    Product product = null;
                    if (orderItem != null)
                    {
                        foreach (Product p in context.Products)
                        {
                            if (p.ProductId == orderItem.ProductId)
                            {
                                product = p;
                                break;
                            }
                        }
                    }

                    return new
                    {
                        invoiceItemId = item.SalesInvoiceItmeId, // Note: using your typo "SalesInvoiceItmeId"
                        orderItemId = item.SalesOrderItemId,
                        productId = orderItem?.ProductId ?? 0,
                        productDescription = product?.Description ?? "Unknown Product",
                        productCode = product?.ProductCode ?? "N/A",
                        unitPrice = product?.SellingPrice ?? 0,
                        quantity = orderItem?.Quantity ?? 0, // Getting quantity from order item since invoice item doesn't have it
                        totalPrice = orderItem?.Price ?? 0 // Getting price from order item
                    };
                }).ToList()
            };

            return Json(invoiceDetails);
        }

        // New method to create credit note
        [HttpPost]
        [HttpPost]
        public JsonResult CreateCreditNote(int invoiceId, decimal totalAmount)
        {
            try
            {
                CreditNote newCreditNote = new CreditNote
                {
                    SalesInvoiceId = invoiceId,
                    Date = DateOnly.FromDateTime(DateTime.Now),
                    EmployeeId = 1,
                    Price = totalAmount
                };

                context.CreditNotes.Add(newCreditNote);

                // Reduce total from invoice
                SalesInvoice invoice = context.SalesInvoices.FirstOrDefault(i => i.SalesInvoiceId == invoiceId);
                if (invoice != null)
                {
                    invoice.Price -= totalAmount;
                }

                context.SaveChanges();

                return Json(new { success = true, creditNoteId = newCreditNote.CreditNoteId });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }


        // New method to add items to credit note - FIXED to match your database structure
        [HttpPost]
        [HttpPost]
        public JsonResult AddToCreditNoteItem(int creditNoteId, int invoiceItemId, int quantity, decimal totalPrice)
        {
            try
            {
                // Add credit note item
                CreditNoteItem newCreditNoteItem = new CreditNoteItem
                {
                    CreditNoteId = creditNoteId,
                    InvoiceItemId = invoiceItemId,
                    Quantity = quantity,
                    Price = totalPrice
                };
                context.CreditNoteItems.Add(newCreditNoteItem);

                // Update CreditedQuantity in SalesInvoiceItem
                SalesInvoiceItem invoiceItem = context.SalesInvoiceItems
                    .FirstOrDefault(i => i.SalesInvoiceItmeId == invoiceItemId);

                if (invoiceItem != null)
                {
                    invoiceItem.CreditedQuantity += quantity;

                    // Find related product via SalesOrderItem
                    SalesOrderItem orderItem = context.SalesOrderItems.FirstOrDefault(soi => soi.SalesOrderItemId == invoiceItem.SalesOrderItemId);

                    if (orderItem != null)
                    {
                        Product product = context.Products
                            .FirstOrDefault(p => p.ProductId == orderItem.ProductId);

                        if (product != null)
                        {
                            product.Stock += quantity; // return quantity to stock
                        }
                    }
                }

                context.SaveChanges();

                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }


        // New action for viewing all invoices
        public IActionResult ViewAllInvoices()
        {
            return View();
        }

        // New action for viewing all credit notes
        public IActionResult ViewAllCreditNotes()
        {
            List<CreditNote> creditNotes = context.CreditNotes
                .OrderByDescending(cn => cn.CreditNoteId)
                .ToList();
            return View(creditNotes);
        }
        [HttpPost]
        public JsonResult GetAllInvoicesWithStatus()
        {
            List<SalesInvoice> allInvoices = context.SalesInvoices
                .OrderByDescending(si => si.SalesInvoiceId)
                .ToList();

            var invoiceData = allInvoices.Select(invoice =>
            {
                // Get related sales order
                var salesOrder = context.SalesOrders.FirstOrDefault(so => so.SalesOrderId == invoice.SalesOrderId);

                // Get related customer
                Costumer customer = null;
                if (salesOrder != null)
                {
                    customer = context.Costumers.FirstOrDefault(c => c.CostumerId == salesOrder.CostumerId);
                }

                // Check if credit note exists
                bool hasCreditNote = context.CreditNotes.Any(cn => cn.SalesInvoiceId == invoice.SalesInvoiceId);

                return new
                {
                    invoiceId = invoice.SalesInvoiceId,
                    salesOrderId = invoice.SalesOrderId,
                    customerName = customer?.CostumerName ?? "Unknown Customer",
                    customerContact = customer?.CostumerContactInfo ?? "N/A",
                    date = invoice.InvoiveDate.ToString(), // Note: typo is preserved
                    totalPrice = invoice.Price,
                    hasCreditNote = hasCreditNote
                };
            }).ToList();

            return Json(invoiceData);
        }

    }
}
