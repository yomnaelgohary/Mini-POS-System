using System;
using System.Collections.Generic;

namespace minipossystem.Models;

public partial class WarehouseProduct
{
    public int WarehouseProductId { get; set; }

    public int WarehouseId { get; set; }

    public int ProductId { get; set; }

    public int Quantity { get; set; }

    public decimal Price { get; set; }

    public virtual Product Product { get; set; } = null!;

    public virtual Warehouse Warehouse { get; set; } = null!;
}
