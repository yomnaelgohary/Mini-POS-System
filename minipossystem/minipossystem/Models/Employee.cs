using System;
using System.Collections.Generic;

namespace minipossystem.Models;

public partial class Employee
{
    public int EmployeeId { get; set; }

    public string EmployeeRole { get; set; } = null!;

    public string EmployeeContactInfo { get; set; } = null!;

    public int BranchId { get; set; }

    public virtual Branch Branch { get; set; } = null!;

    public virtual ICollection<CreditNote> CreditNotes { get; set; } = new List<CreditNote>();

    public virtual ICollection<PurchaseOrderInvoiceItem> PurchaseOrderInvoiceItems { get; set; } = new List<PurchaseOrderInvoiceItem>();

    public virtual ICollection<PurchaseOrder> PurchaseOrders { get; set; } = new List<PurchaseOrder>();

    public virtual ICollection<SalesOrder> SalesOrders { get; set; } = new List<SalesOrder>();
}
