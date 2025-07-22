function loadPurchaseInvoices() {
    $.ajax({
        url: "/Warehouse/GetPurchaseInvoices",
        method: "GET",
        success: function (data) {
            $("#invoiceSection").show();
            $("#invoiceHeader").text("Purchase Invoices");

            const tbody = $("#invoiceTable tbody");
            tbody.empty();

            if (!data || data.length === 0) {
                tbody.append("<tr><td colspan='7' class='text-center'>No purchase invoices found.</td></tr>");
                return;
            }

            data.forEach(item => {
                tbody.append(`
        <tr>
            <td>${item.invoiceId}</td>
            <td>${item.purchaseOrderId}</td>
            <td>${item.invoicePrice}</td>
            <td>${item.invoiceDate}</td>
            <td>${item.orderDate}</td>
            <td>${item.total}</td>
            <td>${item.status}</td>
            <td>
                <button class="btn btn-sm btn-info" onclick="viewInvoiceDetails(${item.invoiceId})">
                    View Details
                </button>
            </td>
        </tr>
    `);
            });

        },
        error: function () {
            alert("Error loading purchase invoices.");
        }
    });
}

function viewInvoiceDetails(invoiceId) {
    $.ajax({
        url: `/Warehouse/GetInvoiceItems?invoiceId=${invoiceId}`,
        method: "GET",
        success: function (items) {
            const tbody = $("#invoiceItemsBody");
            tbody.empty();

            if (!items || items.length === 0) {
                tbody.append("<tr><td colspan='4' class='text-center'>No items found for this invoice.</td></tr>");
            } else {
                items.forEach(item => {
                    tbody.append(`
                        <tr>
                            <td>${item.product}</td>
                            <td>${item.quantity}</td>
                            <td>${item.unitPrice}</td>
                            <td>${item.total}</td>
                        </tr>
                    `);
                });
            }

            // Show the modal
            $("#invoiceDetailsModal").modal("show");
        },
        error: function () {
            alert("Failed to load invoice details.");
        }
    });
}

