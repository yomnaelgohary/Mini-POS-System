using System;
using System.Collections.Generic;

namespace minipossystem.Models;

public partial class PurchaseOrder
{
    public int PurchaseOrderId { get; set; }

    public int VendorId { get; set; }

    public int EmployeeId { get; set; }

    public decimal? Price { get; set; }

    public DateOnly? Date { get; set; }

    public string? Status { get; set; }

    public virtual Employee Employee { get; set; } = null!;

    public virtual ICollection<PurchaseOrderInvoice> PurchaseOrderInvoices { get; set; } = new List<PurchaseOrderInvoice>();

    public virtual ICollection<PurchaseOrderItem> PurchaseOrderItems { get; set; } = new List<PurchaseOrderItem>();

    public virtual Vendor Vendor { get; set; } = null!;
}
