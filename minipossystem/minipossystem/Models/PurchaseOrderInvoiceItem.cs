using System;
using System.Collections.Generic;

namespace minipossystem.Models;

public partial class PurchaseOrderInvoiceItem
{
    public int PurchaseInvoiceItemId { get; set; }

    public int PurchaseOrderInvoiceId { get; set; }

    public int PurchaseOrderItemId { get; set; }

    public int EmployeeId { get; set; }

    public int BranchId { get; set; }

    public int Quantity { get; set; }

    public decimal Price { get; set; }

    public virtual Branch Branch { get; set; } = null!;

    public virtual Employee Employee { get; set; } = null!;

    public virtual PurchaseOrderInvoice PurchaseOrderInvoice { get; set; } = null!;

    public virtual PurchaseOrderItem PurchaseOrderItem { get; set; } = null!;
}
