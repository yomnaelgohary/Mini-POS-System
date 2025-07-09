using System;
using System.Collections.Generic;

namespace minipossystem.Models;

public partial class Product
{
    internal int Stock;

    public int ProductId { get; set; }

    public string Description { get; set; } = null!;

    public decimal SellingPrice { get; set; }

    public string? ProductCode { get; set; }

    public virtual ICollection<PurchaseOrderItem> PurchaseOrderItems { get; set; } = new List<PurchaseOrderItem>();

    public virtual ICollection<SalesOrderItem> SalesOrderItems { get; set; } = new List<SalesOrderItem>();

    public virtual ICollection<WarehouseProduct> WarehouseProducts { get; set; } = new List<WarehouseProduct>();
}
