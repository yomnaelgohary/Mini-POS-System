using Microsoft.AspNetCore.Mvc;

namespace minipossystem.Models
{
    public class WarehouseAddRequest 
    {
        public int WarehouseId { get; set; }
        public List<WarehouseProductInputDTO> Items { get; set; }
    }
}
