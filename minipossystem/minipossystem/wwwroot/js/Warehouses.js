let toBeAddedList = [];

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
                tbody.append("<tr><td colspan='8' class='text-center'>No purchase invoices found.</td></tr>");
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
            toBeAddedList = [];
            $('#toBeAddedBody').empty();

            if (!items || items.length === 0) {
                tbody.append("<tr><td colspan='5' class='text-center'>No items found for this invoice.</td></tr>");
                return;
            }

            items.forEach(item => {
                tbody.append(`
        <tr>
            <td>${item.product}</td>
            <td>${item.quantity}</td>
            <td>${item.unitPrice}</td>
            <td>${item.total}</td>
            <td>
                <button class="btn btn-sm btn-success" onclick="openQuantityModal(${item.itemId}, '${item.product}', ${item.quantity})">
                    ➕ Add
                </button>
            </td>
        </tr>
    `);
            });


            loadWarehousesForPopup();
            $('#invoiceDetailsModal').modal('show');
        },
        error: function () {
            alert("Failed to load invoice items.");
        }
    });
}

function loadWarehousesForPopup() {
    const branchId = $('#hiddenBranchId').val();

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

function addToWarehouseList(itemId, productName, maxQty) {
    const qtyInput = $(`#qtyInput_${itemId}`);
    const newQty = parseInt(qtyInput.val());

    if (!newQty || newQty <= 0) {
        alert("Enter a valid quantity.");
        return;
    }

    const existingItem = toBeAddedList.find(x => x.itemId === itemId);

    if (existingItem) {
        const updatedQty = existingItem.quantity + newQty;

        if (updatedQty > maxQty) {
            alert(`Total quantity exceeds available stock (${maxQty}).`);
            return;
        }

        existingItem.quantity = updatedQty;

        $(`#toBeAddedRow_${itemId} td:nth-child(2)`).text(updatedQty);
    } else {
        if (newQty > maxQty) {
            alert(`Cannot add more than available quantity (${maxQty}).`);
            return;
        }

        toBeAddedList.push({
            itemId,
            productName,
            quantity: newQty
        });

        $('#toBeAddedBody').append(`
            <tr id="toBeAddedRow_${itemId}">
                <td>${productName}</td>
                <td>${newQty}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="removeFromWarehouseList(${itemId})">
                        ❌ Remove
                    </button>
                </td>
            </tr>
        `);
    }

    // Clear input field
    qtyInput.val('');
}


function removeFromWarehouseList(itemId) {
    toBeAddedList = toBeAddedList.filter(x => x.itemId !== itemId);
    $(`#toBeAddedRow_${itemId}`).remove();
}
function openQuantityModal(itemId, productName, maxQty) {
    $('#modalItemId').val(itemId);
    $('#modalProductName').text(`Product: ${productName}`);
    $('#modalProductNameHidden').val(productName);
    $('#modalProductMaxQty').val(maxQty);
    $('#modalQuantityInput').val('');
    $('#quantityModal').modal('show');
}
function confirmQuantity() {
    const itemId = parseInt($('#modalItemId').val());
    const qty = parseInt($('#modalQuantityInput').val());
    const maxQty = parseInt($('#modalProductMaxQty').val());
    const productName = $('#modalProductNameHidden').val();

    if (!qty || qty <= 0) {
        alert("Enter a valid quantity.");
        return;
    }

    if (qty > maxQty) {
        alert(`Cannot add more than available quantity (${maxQty}).`);
        return;
    }

    
    if (toBeAddedList.find(x => x.itemId === itemId)) {
        alert("Item already added.");
        return;
    }

    // Add to list
    toBeAddedList.push({
        itemId,
        productName,
        quantity: qty
    });

    $('#toBeAddedBody').append(`
        <tr id="toBeAddedRow_${itemId}">
            <td>${productName}</td>
            <td>${qty}</td>
            <td>
                <button class="btn btn-sm btn-danger" onclick="removeFromWarehouseList(${itemId})">
                    ❌ Remove
                </button>
            </td>
        </tr>
    `);

    $('#quantityModal').modal('hide');
}
 