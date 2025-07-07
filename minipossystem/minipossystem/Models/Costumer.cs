using System;
using System.Collections.Generic;

namespace minipossystem.Models;

public partial class Costumer
{
    public int CostumerId { get; set; }

    public string CostumerName { get; set; } = null!;

    public string CostumerContactInfo { get; set; } = null!;

    public virtual ICollection<SalesOrder> SalesOrders { get; set; } = new List<SalesOrder>();
}
