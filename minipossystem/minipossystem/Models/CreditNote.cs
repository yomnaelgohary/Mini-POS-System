using System;
using System.Collections.Generic;

namespace minipossystem.Models;

public partial class CreditNote
{
    public int CreditNoteId { get; set; }

    public int SalesInvoiceId { get; set; }

    public DateOnly Date { get; set; }

    public int EmployeeId { get; set; }

    public decimal Price { get; set; }

    public virtual ICollection<CreditNoteItem> CreditNoteItems { get; set; } = new List<CreditNoteItem>();

    public virtual Employee Employee { get; set; } = null!;

    public virtual SalesInvoice SalesInvoice { get; set; } = null!;
}
