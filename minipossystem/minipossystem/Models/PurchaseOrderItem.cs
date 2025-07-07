using System;
using System.Collections.Generic;

namespace minipossystem.Models;

public partial class PurchaseOrderItem
{
    public int PurchaseOrderItemId { get; set; }

    public int PurchaseOrderId { get; set; }

    public int ProductId { get; set; }

    public int Quantity { get; set; }

    public decimal Price { get; set; }

    public virtual Product Product { get; set; } = null!;

    public virtual PurchaseOrder PurchaseOrder { get; set; } = null!;

    public virtual ICollection<PurchaseOrderInvoiceItem> PurchaseOrderInvoiceItems { get; set; } = new List<PurchaseOrderInvoiceItem>();
}
