using System;
using System.Collections.Generic;

namespace minipossystem.Models;

public partial class PurchaseOrderInvoice
{
    public int PurchaseOrderInvoiceId { get; set; }

    public int PurchaseOrderId { get; set; }

    public decimal Price { get; set; }

    public DateOnly Date { get; set; }

    public virtual PurchaseOrder PurchaseOrder { get; set; } = null!;

    public virtual ICollection<PurchaseOrderInvoiceItem> PurchaseOrderInvoiceItems { get; set; } = new List<PurchaseOrderInvoiceItem>();
}
