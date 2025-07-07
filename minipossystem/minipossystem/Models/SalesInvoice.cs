using System;
using System.Collections.Generic;

namespace minipossystem.Models;

public partial class SalesInvoice
{
    public int SalesInvoiceId { get; set; }

    public int SalesOrderId { get; set; }

    public DateOnly InvoiveDate { get; set; }

    public decimal Price { get; set; }

    public virtual ICollection<CreditNote> CreditNotes { get; set; } = new List<CreditNote>();

    public virtual ICollection<SalesInvoiceItem> SalesInvoiceItems { get; set; } = new List<SalesInvoiceItem>();

    public virtual SalesOrder SalesOrder { get; set; } = null!;
}
