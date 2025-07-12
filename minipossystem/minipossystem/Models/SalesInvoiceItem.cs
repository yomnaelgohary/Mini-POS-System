using System;
using System.Collections.Generic;

namespace minipossystem.Models;

public partial class SalesInvoiceItem
{
    public int SalesInvoiceItmeId { get; set; }

    public int SalesInvoiceId { get; set; }

    public int SalesOrderItemId { get; set; }
    public int InvoivedQuantity { get; set; }

    public virtual ICollection<CreditNoteItem> CreditNoteItems { get; set; } = new List<CreditNoteItem>();

    public virtual SalesInvoice SalesInvoice { get; set; } = null!;

    public virtual SalesOrderItem SalesOrderItem { get; set; } = null!;
}
