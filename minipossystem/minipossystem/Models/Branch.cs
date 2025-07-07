using System;
using System.Collections.Generic;

namespace minipossystem.Models;

public partial class Branch
{
    public int BranchId { get; set; }

    public string BranchName { get; set; } = null!;

    public string BranchAddress { get; set; } = null!;

    public int CompanyId { get; set; }

    public virtual Company Company { get; set; } = null!;

    public virtual ICollection<Employee> Employees { get; set; } = new List<Employee>();

    public virtual ICollection<PurchaseOrderInvoiceItem> PurchaseOrderInvoiceItems { get; set; } = new List<PurchaseOrderInvoiceItem>();

    public virtual ICollection<Warehouse> Warehouses { get; set; } = new List<Warehouse>();
}
