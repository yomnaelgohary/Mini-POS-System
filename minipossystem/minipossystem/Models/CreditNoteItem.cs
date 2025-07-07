using System;
using System.Collections.Generic;

namespace minipossystem.Models;

public partial class CreditNoteItem
{
    public int CreditNoteItemId { get; set; }

    public int CreditNoteId { get; set; }

    public int InvoiceItemId { get; set; }

    public int Quantity { get; set; }

    public decimal Price { get; set; }

    public virtual CreditNote CreditNote { get; set; } = null!;

    public virtual SalesInvoiceItem InvoiceItem { get; set; } = null!;
}
