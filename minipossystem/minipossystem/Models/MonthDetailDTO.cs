using Microsoft.AspNetCore.Mvc;
//class for GetMonthDetails Strode procedure 
namespace minipossystem.Models
{
    public class MonthDetailDTO
    {
        public int SalesOrderItemID { get; set; }
        public decimal Price { get; set; }
    }
}
