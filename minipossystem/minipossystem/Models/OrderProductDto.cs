namespace minipossystem.Models
{
    public class OrderProductDto
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public string Code { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public int Total { get; set; }
    }
}
