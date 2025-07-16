using Microsoft.AspNetCore.Mvc;
//Class for GetTotalSalesPerMonth Stored Procedure 
namespace minipossystem.Models
{
    public class MonthlySalesDTO 
    {
        public string SalesMonth { get; set; }
        public decimal TotalSales { get; set; }
    }
}
