namespace minipossystem.Models
{
    public class InvoiceItemDto
    {
        public int ItemId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal Total { get; set; }
    }
}
