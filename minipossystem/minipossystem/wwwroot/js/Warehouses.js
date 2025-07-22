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
        url: '/Warehouse/GetInvoiceItems?invoiceId=' + invoiceId,
        method: 'GET',
        success: function (items) {
            const tbody = $('#invoiceItemsBody');
            tbody.empty();

            if (!items || items.length === 0) {
                tbody.append("<tr><td colspan='4' class='text-center'>No items found for this invoice.</td></tr>");
                return;
            }

            items.forEach(item => {
                tbody.append(`
                    <tr>
                        <td>${item.productName}</td>
                        <td>${item.quantity}</td>
                        <td>${item.unitPrice}</td>
                        <td>${item.total}</td>
                    </tr>
                `);
            });

            // ✅ Load warehouses and show modal
            loadWarehousesForPopup();
            $('#invoiceDetailsModal').modal('show');
        },
        error: function () {
            alert("Failed to load invoice items.");
        }
    });
}


function loadWarehousesForPopup() {
    const branchId = $('#hiddenBranchId').val();  // ✔ matches HTML

    if (!branchId) {
        console.error("Branch ID not found in session.");
        return;
    }

    $.ajax({
        url: `/Warehouse/GetWarehousesForBranch?branchId=${branchId}`,
        method: 'GET',
        success: function (warehouses) {
            const dropdown = $('#warehouseSelectForPopup');
            dropdown.empty();
            dropdown.append(`<option value="">-- Select a Warehouse --</option>`);

            warehouses.forEach(w => {
                dropdown.append(`<option value="${w.warehouseId}">${w.warehouseName}</option>`);
            });
        },
        error: function () {
            alert("Error loading warehouses.");
        }
    });
}
