namespace minipossystem.Models
{
    public class InvoiceRequest

    {

        public int OrderId { get; set; }
        public List<InvoiceItemDto> Items { get; set; }

    }
}
