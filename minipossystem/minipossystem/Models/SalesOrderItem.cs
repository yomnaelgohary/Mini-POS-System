using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace minipossystem.Models;

public partial class SalesOrderItem
{
    public int SalesOrderItemId { get; set; }

    public int SalesOrderId { get; set; }

    public int ProductId { get; set; }

    public int Quantity { get; set; }

    public decimal Price { get; set; }
    [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
    public decimal Total { get; set; }


    public virtual Product Product { get; set; } = null!;

    public virtual ICollection<SalesInvoiceItem> SalesInvoiceItems { get; set; } = new List<SalesInvoiceItem>();

    public virtual SalesOrder SalesOrder { get; set; } = null!;

    public virtual ICollection<SalesOrderWarehouse> SalesOrderWarehouses { get; set; } = new List<SalesOrderWarehouse>();
}
