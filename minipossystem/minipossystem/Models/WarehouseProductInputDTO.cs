using Microsoft.AspNetCore.Mvc;

namespace minipossystem.Models
{
    public class WarehouseProductInputDTO 
    {
        public int ProductId { get; set; }
        public decimal UnitPrice { get; set; }
        public int Quantity { get; set; }
    }
    
}
