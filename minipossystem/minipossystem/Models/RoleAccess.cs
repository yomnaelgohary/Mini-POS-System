using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace minipossystem.Models;
[Table("RoleAccess")]
public class RoleAccess
{
    [Key]
    public string RoleName { get; set; } = null!;
    public bool CanViewSalesOrders { get; set; }
    public bool CanCreateInvoice { get; set; }
    public bool CanCreditInvoice { get; set; }
    public bool CanCreatePurchaseOrder { get; set; }
    public bool CanReceivePurchaseOrderInvoice { get; set; }
    public bool CanCreditPurchaseOrderInvoice { get; set; }
    public bool CanReciveProductstoWH { get; set; }
    public bool CanSupplyProductsFromWH { get; set; }
}
