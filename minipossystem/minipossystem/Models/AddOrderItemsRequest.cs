namespace minipossystem.Models;
    public class AddOrderItemsRequest
    {
        public int OrderId { get; set; }
        public List<OrderProductDto> Products { get; set; }
    }



