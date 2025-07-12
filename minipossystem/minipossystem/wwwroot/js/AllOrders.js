let invoiceCart = [];
let currentOrderId = null;

$(document).ready(function () {
    loadAllOrders();
});

function loadAllOrders() {
    $.ajax({
        url: "/SalesOrder/GetAllOrders",
        type: "GET",
        success: function (orders) {
            const tbody = $("#ordersTable tbody");
            tbody.empty();

            if (orders.length === 0) {
                tbody.append(`
                    <tr>
                        <td colspan="6" class="text-center text-muted">No orders found.</td>
                    </tr>
                `);
                return;
            }

            orders.forEach(order => {
                tbody.append(`
                    <tr>
                        <td>${order.salesOrderId}</td>
                        <td>${order.customerName}</td>
                        <td>${order.orderDate}</td>
                        <td>${order.status}</td>
                        <td>${order.itemCount}</td>
                        <td>
                            <button class="btn btn-sm btn-info" onclick="viewOrderDetails(${order.salesOrderId})">
                                View
                            </button>
                        </td>
                    </tr>
                `);
            });
        },
        error: function (err) {
            console.error("Failed to fetch orders:", err);
        }
    });
}

function viewOrderDetails(orderId) {
    $.ajax({
        url: "/SalesOrder/GetOrderDetails?id=" + orderId,
        method: "GET",
        success: function (response) {
            if (response.success) {
                const order = response.data;
                currentOrderId = order.salesOrderId;
                loadPreviousInvoices(order.salesOrderId);

                invoiceCart = [];

                let html = `
                    <p><strong>Order ID:</strong> ${order.salesOrderId}</p>
                    <p><strong>Customer:</strong> ${order.customerName}</p>
                    <p><strong>Date:</strong> ${order.orderDate}</p>
                    <p><strong>Status:</strong> ${order.status}</p>
                    <hr>
                    <h5>Items</h5>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Product Code</th>
                                <th>Description</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Total</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                `;

                order.items.forEach(item => {
                    html += `
<tr>
    <td>${item.productCode}</td>
    <td>${item.description}</td>
   <td>
    <span id="qty_display_${item.productId}">${item.quantity}</span>
    <button class="btn btn-sm btn-outline-warning ms-2" onclick="openEditQuantityModal(${order.salesOrderId}, ${item.productId}, ${item.quantity},${item.salesOrderItemId} )">
        Edit Quantity
    </button>
</td>

    <td>${item.price}</td>
    <td>${item.total}</td>
    <td>
<button class="btn btn-sm btn-success" onclick="openAddToInvoiceModal(
    ${order.salesOrderId},
    ${item.salesOrderItemId},
    ${item.quantity},
    ${item.productId},
    '${item.description}',
    ${item.price}
)"
>
    ➕ Add to Invoice
</button>
        <button class="btn btn-sm btn-danger" onclick="removeItem(${order.salesOrderId}, ${item.productId})">Delete</button>
    </td>
</tr>
`;
                });

                html += `
                        </tbody>
                    </table>
<hr>
<h5>Invoice Cart</h5>
<table class="table table-bordered" id="invoiceCartTable">
    <thead>
        <tr>
            <th>Description</th>
            <th>Qty</th>
            <th>Unit Price</th>
            <th>Total</th>
            <th>Action</th>
        </tr>
    </thead>
    <tbody></tbody>
</table>
<button class="btn btn-primary mt-2" onclick="submitInvoice()">🧾 Create Invoice</button>
`;

                html += `
<hr>
<h5>Previous Invoices</h5>
<div id="invoiceHistorySection">
    <p class="text-muted">Loading invoices...</p>
</div>
`;

                $("#orderDetailsModal .modal-body").html(html);
                renderInvoiceCart();



                $("#orderDetailsModal").modal("show");
            } else {
                alert("Order not found.");
            }
        },
        error: function () {
            alert("Error loading order details.");
        }
    });
}

function updateQuantity(orderId, productId) {
    const newQty = parseInt($(`#qty_${productId}`).val());
    if (isNaN(newQty) || newQty < 1) {
        alert("Enter a valid quantity.");
        return;
    }

    $.ajax({
        url: "/SalesOrder/UpdateItemQuantity",
        method: "POST",
        data: { orderId, productId, newQuantity: newQty },
        success: function (response) {
            if (response.success) {
                alert("Quantity updated.");
                viewOrderDetails(orderId);
            } else {
                alert(response.message || "Update failed.");
            }
        },
        error: function () {
            alert("Error updating quantity.");
        }
    });
}

function removeItem(orderId, productId) {
    if (!confirm("Are you sure you want to remove this item?")) return;

    $.ajax({
        url: "/SalesOrder/RemoveOrderItem",
        method: "POST",
        data: { orderId, productId },
        success: function (response) {
            if (response.success) {
                alert("Item removed.");
                viewOrderDetails(orderId);
            } else {
                alert(response.message || "Delete failed.");
            }
        },
        error: function () {
            alert("Error removing item.");
        }
    });
}

function addToInvoiceCart(productId, description, price, maxQty) {
    let qty = parseInt($(`#qty_${productId}`).val());

    if (isNaN(qty) || qty < 1 || qty > maxQty) {
        alert("Invalid quantity.");
        return;
    }

    const existing = invoiceCart.find(item => item.productId === productId);
    if (existing) {
        existing.quantity += qty;
    } else {
        invoiceCart.push({ productId, description, price, quantity: qty });
    }

    renderInvoiceCart();
}

function renderInvoiceCart() {
    const tbody = $("#invoiceCartTable tbody");
    tbody.empty();

    invoiceCart.forEach((item, index) => {
        tbody.append(`
            <tr>
                <td>${item.description}</td>
                <td>${item.quantity}</td>
                <td>${item.price}</td>
                <td>${item.quantity * item.price}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="removeFromInvoiceCart(${index})">🗑</button>
                </td>
            </tr>
        `);
    });
}

function removeFromInvoiceCart(index) {
    invoiceCart.splice(index, 1);
    renderInvoiceCart();
}

function submitInvoice() {
    if (invoiceCart.length === 0) {
        alert("Invoice cart is empty.");
        return;
    }

    const payload = {
        orderId: currentOrderId,
        items: invoiceCart.map(item => ({
            itemId: item.itemId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.total
        }))
    };

    $.ajax({
        url: "/SalesOrder/CreateInvoice",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(payload),
        success: function (res) {
            if (res.success) {
                // Reset state
                invoiceCart = [];
                renderInvoiceCart();
                $("#orderDetailsModal").modal("hide");

                // Show preview
                showInvoicePreview(res.invoice);
            } else {
                alert(res.message || "Failed to create invoice.");
            }
        },
        error: function (xhr) {
            console.error("Invoice error:", xhr.responseText);
            alert("Error creating invoice: " + xhr.responseText);
        }
    });
}


function openEditQuantityModal(orderId, productId, currentQty, itemid) {
    $("#editorderId").val(orderId);
    $("#edititemid").val(itemid);
    $("#editProductId").val(productId);
    $("#editQuantityInput").val(currentQty);
    $("#editQuantityModal").modal("show");
}

function confirmEditQuantity() {
    const newQty = parseInt($("#editQuantityInput").val());
    const productId = parseInt($("#editProductId").val());
    const orderId = parseInt($("#editorderId").val());
    const itemid = parseInt($("#edititemid").val());

    console.log("Saving new quantity:", newQty, "for product:", productId, orderId, itemid);

    $.post("/SalesOrder/UpdateQuantityForSalesOrderItem",
        {
            newQty: newQty,
            orderId: orderId,
            itemid: itemid
        },
        function (response) {
            if (response.success) {
                $("#editQuantityModal").modal("hide");
                viewOrderDetails(orderId);
            } else {
                alert(response.message || "Update failed.");
            }
        }
    );
}


function openAddToInvoiceModal(orderid, itemid, maxQty, productId, description, price) {
    $("#invoiceorderid").val(orderid);
    $("#invoiceitemid").val(itemid);
    $("#invoiceMaxQty").val(maxQty);
    $("#invoiceProductId").val(productId);
    $("#invoiceProductDescription").val(description);
    $("#invoiceProductPrice").val(price);
    $("#invoiceQuantityInput").val(1);
    $("#addToInvoiceModal").modal("show");
}

let toBeInvoicedItems = [];
function confirmAddToInvoice() {
    const orderId = parseInt($("#invoiceorderid").val());
    const itemId = parseInt($("#invoiceitemid").val());
    const productId = parseInt($("#invoiceProductId").val());
    const description = $("#invoiceProductDescription").val();
    const unitPrice = parseFloat($("#invoiceProductPrice").val());
    const quantity = parseInt($("#invoiceQuantityInput").val());
    const maxQty = parseInt($("#invoiceMaxQty").val());

    if (isNaN(quantity) || quantity < 1 || quantity > maxQty) {
        alert("Invalid quantity.");
        return;
    }

    const total = quantity * unitPrice;

    // Add to cart
    invoiceCart.push({
        orderId,
        itemId,
        productId,
        description,
        quantity,
        unitPrice,
        total
    });

    console.log("Item added to invoice cart:", invoiceCart);
    renderInvoiceCart();
    $("#addToInvoiceModal").modal("hide");
}

function renderInvoiceCart() {
    const modalTbody = $("#invoiceCartTable tbody");
    const previewTbody = $("#invoicePreviewTable tbody");

    modalTbody.empty();
    previewTbody.empty();

    if (invoiceCart.length === 0) {
        modalTbody.append(`<tr><td colspan="5" class="text-muted text-center">No items added.</td></tr>`);
        previewTbody.append(`<tr><td colspan="5" class="text-muted text-center">No items added.</td></tr>`);
        return;
    }

    invoiceCart.forEach((item, index) => {
        const row = `
            <tr>
                <td>${item.description}</td>
                <td>${item.quantity}</td>
                <td>${item.unitPrice.toFixed(2)}</td>
                <td>${(item.quantity * item.unitPrice).toFixed(2)}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="removeFromInvoiceCart(${index})">🗑</button>
                </td>
            </tr>
        `;

        modalTbody.append(row);
        previewTbody.append(row);
    });
}


function removeFromInvoiceCart(index) {
    invoiceCart.splice(index, 1);
    renderInvoiceCart();
}

function showInvoicePreview(invoice) {
    let html = `
        <h5>Invoice #${invoice.invoiceId}</h5>
        <p><strong>Order ID:</strong> ${invoice.orderId}</p>
        <p><strong>Date:</strong> ${invoice.date}</p>
        <p><strong>Total Price:</strong> ${invoice.total.toFixed(2)}</p>
        <hr />
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Description</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>`;

    invoice.items.forEach(item => {
        html += `
            <tr>
                <td>${item.description}</td>
                <td>${item.quantity}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>${item.total.toFixed(2)}</td>
            </tr>`;
    });

    html += `
            </tbody>
        </table>
        <div class="text-end">
            <button class="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
        </div>
    `;

    $("#invoiceSummaryModal .modal-body").html(html);
    $("#invoiceSummaryModal").modal("show");
}


function loadPreviousInvoices(orderId) {
    $.get(`/SalesOrder/GetInvoicesForOrder?orderId=${orderId}`, function (invoices) {
        const container = $("#invoiceHistorySection");
        container.empty();

        if (!invoices || invoices.length === 0) {
            container.html(`<p class="text-muted">No invoices found for this order.</p>`);
            return;
        }

        let html = `
            <table class="table table-sm table-bordered">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
        `;

        invoices.forEach(inv => {
            html += `
                <tr>
                    <td>${inv.salesInvoiceId}</td>
                    <td>${inv.invoiveDate}</td>
                    <td>${inv.price.toFixed(2)}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-secondary" onclick="previewInvoice(${inv.salesInvoiceId})">View</button>
                    </td>
                </tr>
            `;
        });

        html += `</tbody></table>`;
        container.html(html);
    });
}

function previewInvoice(invoiceid) {
    $.get("/SalesOrder/ViewInvoiceItems?invoiceid=" + invoiceid, function (items) {
        let html = `
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Product Code</th>
                    <th>Description</th>
                    <th>Invoiced Qty</th>
                    <th>Total Price</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>`;

        items.forEach(item => {
            html += `
            <tr>
                <td>${item.productCode}</td>
                <td>${item.productDescription}</td>
                <td>${item.invoicedquantity}</td>
                <td>${item.itemsprice.toFixed(2)}</td>
                <td>
<button class="btn btn-sm btn-warning" onclick="openCreditModal('${item.productCode}', ${item.invoicedquantity}, ${currentOrderId})">Credit</button>
                </td>
            </tr>`;
        });

        html += `</tbody></table>`;

        $("#invoiceDetailsBody").html(html);
        $("#invoiceDetailsModal").modal("show");
    });
}

function openCreditModal(productCode, maxQty, salesOrderId) {
    $("#creditProductCode").val(productCode);
    $("#creditSalesOrderId").val(salesOrderId);
    $("#creditQuantityInput").attr("max", maxQty).val(1);
    $("#creditModal").modal("show");
}

function confirmCredit() {
    const productCode = $("#creditProductCode").val();
    const salesOrderId = $("#creditSalesOrderId").val();
    const quantity = parseInt($("#creditQuantityInput").val());

    if (isNaN(quantity) || quantity < 1) {
        alert("Enter a valid quantity.");
        return;
    }

    $.post("/SalesOrder/CreditItem", { productCode, quantity, salesOrderId }, function (response) {
        if (response.success) {
            alert("Credit applied successfully.");
            $("#creditModal").modal("hide");
            viewOrderDetails(salesOrderId); // Refresh the order
        } else {
            alert(response.message || "Failed to credit item.");
        }
    });
}


