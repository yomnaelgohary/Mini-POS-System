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
<button class="btn btn-sm btn-success" onclick="openAddToInvoiceModal(${item.productId}, '${item.description}', ${item.price}, ${item.quantity})">
    ➕ Add to Invoice
</button>
        <button class="btn btn-sm btn-primary" onclick="updateQuantity(${order.salesOrderId}, ${item.productId})">Update</button>
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

    $.ajax({
        url: "/SalesOrder/CreateInvoice", 
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            orderId: currentOrderId,
            items: invoiceCart
        }),
        success: function (res) {
            if (res.success) {
                alert("Invoice created successfully!");
                invoiceCart = [];
                renderInvoiceCart();
                $("#orderDetailsModal").modal("hide");
                loadAllOrders(); // refresh orders
            } else {
                alert(res.message || "Failed to create invoice.");
            }
        },
        error: function (xhr, status, error) {
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


function openAddToInvoiceModal(productId, description, price, maxQty) {
    $("#invoiceProductId").val(productId);
    $("#invoiceProductDesc").val(description);
    $("#invoiceProductPrice").val(price);
    $("#invoiceMaxQty").val(maxQty);
    $("#invoiceQuantityInput").val(1);
    $("#addToInvoiceModal").modal("show");
}

function confirmAddToInvoice() {
    const productId = parseInt($("#invoiceProductId").val());
    const description = $("#invoiceProductDesc").val();
    const price = parseFloat($("#invoiceProductPrice").val());
    const maxQty = parseInt($("#invoiceMaxQty").val());
    const qty = parseInt($("#invoiceQuantityInput").val());

    if (isNaN(qty) || qty < 1 || qty > maxQty) {
        alert("Invalid quantity.");
        return;
    }

    console.log(`Add to Invoice: ${description} (x${qty})`);
    // This is where we'll call addToInvoiceCart() in the next step
    $("#addToInvoiceModal").modal("hide");
}
