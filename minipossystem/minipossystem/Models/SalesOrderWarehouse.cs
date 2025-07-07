using System;
using System.Collections.Generic;

namespace minipossystem.Models;

public partial class SalesOrderWarehouse
{
    public int SalesOrderWarehouseId { get; set; }

    public int SalesOrderItemId { get; set; }

    public int WarehouseId { get; set; }

    public int Quantity { get; set; }

    public virtual SalesOrderItem SalesOrderItem { get; set; } = null!;

    public virtual Warehouse Warehouse { get; set; } = null!;
}
