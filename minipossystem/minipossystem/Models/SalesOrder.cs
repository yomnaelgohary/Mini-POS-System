using System;
using System.Collections.Generic;

namespace minipossystem.Models;

public partial class SalesOrder
{
    public int SalesOrderId { get; set; }

    public int CostumerId { get; set; }

    public int EmployeeId { get; set; }

    public DateOnly OrderDate { get; set; }

    public string Status { get; set; } = null!;

    public virtual Costumer Costumer { get; set; } = null!;

    public virtual Employee Employee { get; set; } = null!;

    public virtual ICollection<SalesInvoice> SalesInvoices { get; set; } = new List<SalesInvoice>();

    public virtual ICollection<SalesOrderItem> SalesOrderItems { get; set; } = new List<SalesOrderItem>();
}
