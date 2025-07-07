using System;
using System.Collections.Generic;

namespace minipossystem.Models;

public partial class Warehouse
{
    public int WarehouseId { get; set; }

    public string WarehouseName { get; set; } = null!;

    public int BranchId { get; set; }

    public virtual Branch Branch { get; set; } = null!;

    public virtual ICollection<SalesOrderWarehouse> SalesOrderWarehouses { get; set; } = new List<SalesOrderWarehouse>();

    public virtual ICollection<WarehouseProduct> WarehouseProducts { get; set; } = new List<WarehouseProduct>();
}
