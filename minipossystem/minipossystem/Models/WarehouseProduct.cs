
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace minipossystem.Models;

public partial class WarehouseProduct
{
    public int WarehouseProductId { get; set; }

    public int WarehouseId { get; set; }

    public int ProductId { get; set; }

    public int TotalQuantity { get; set; }
    public int ReservedQuantity { get; set; }

    [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
    public int UnreservedQuantity { get; set; }

    public decimal Price { get; set; }

    public virtual Product Product { get; set; } = null!;

    public virtual Warehouse Warehouse { get; set; } = null!;
}
