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




    }
}
