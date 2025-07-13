

let invoiceCart = []
let currentOrderId = null
let creditCart = []
let creditMode = false
let creditList = []
let currentInvoiceItems = []

$(document).ready(() => {
    loadAllOrders()
})

function loadAllOrders() {
    $.ajax({
        url: "/SalesOrder/GetAllOrders",
        type: "GET",
        success: (orders) => {
            const tbody = $("#ordersTable tbody")
            tbody.empty()
            if (orders.length === 0) {
                tbody.append(`
                    <tr>
                        <td colspan="6" class="text-center text-muted">No orders found.</td>
                    </tr>
                `)
                return
            }
            orders.forEach((order) => {
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
                `)
            })
        },
        error: (err) => {
            console.error("Failed to fetch orders:", err)
        },
    })
}

function viewOrderDetails(orderId) {
    $.ajax({
        url: "/SalesOrder/GetOrderDetails?id=" + orderId,
        method: "GET",
        success: (response) => {
            if (response.success) {
                const order = response.data
                currentOrderId = order.salesOrderId
                loadPreviousInvoices(order.salesOrderId)
                invoiceCart = []
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
                `
                order.items.forEach((item) => {
                    html += `<tr>
    <td>${item.productCode}</td>
    <td>${item.description}</td>
   <td>
    <span id="qty_display_${item.productId}">${item.quantity}</span>
    <button class="btn btn-sm btn-outline-warning ms-2" onclick="openEditQuantityModal(${order.salesOrderId}, ${item.productId}, ${item.quantity},${item.salesOrderItemId} )">
        Edit Quantity
    </button></td>
    <td>${item.price}</td>
    <td>${item.total}</td>
    <td><button class="btn btn-sm btn-success" onclick="openAddToInvoiceModal(
    ${order.salesOrderId},
    ${item.salesOrderItemId},
    ${item.quantity},
    ${item.productId},
    '${item.description}',
    ${item.price})">
    ➕ Add to Invoice</button>
        <button class="btn btn-sm btn-danger" onclick="removeItem(${order.salesOrderId}, ${item.productId})">Delete</button>
    </td></tr>`
                })
                html += `
                        </tbody>
                    </table><hr><h5>Invoice Cart</h5><table class="table table-bordered" id="invoiceCartTable">
    <thead>
        <tr>
            <th>Description</th>
            <th>Qty</th>
            <th>Unit Price</th>
            <th>Total</th>
            <th>Action</th>
        </tr>
    </thead>
    <tbody></tbody></table><button class="btn btn-primary mt-2" onclick="submitInvoice()">🧾 Create Invoice</button>`
                html += `<hr><h5>Previous Invoices</h5><div id="invoiceHistorySection">
    <p class="text-muted">Loading invoices...</p></div>`
                $("#orderDetailsModal .modal-body").html(html)
                renderInvoiceCart()

                // Use Bootstrap 5 modal API
                var orderModal = new bootstrap.Modal(document.getElementById("orderDetailsModal"))
                orderModal.show()
            } else {
                alert("Order not found.")
            }
        },
        error: () => {
            alert("Error loading order details.")
        },
    })
}

// Rest of the functions remain the same, but update modal calls to use Bootstrap 5 API

function openEditQuantityModal(orderId, productId, currentQty, itemid) {
    $("#editorderId").val(orderId)
    $("#edititemid").val(itemid)
    $("#editProductId").val(productId)
    $("#editQuantityInput").val(currentQty)

    var editModal = new bootstrap.Modal(document.getElementById("editQuantityModal"))
    editModal.show()
}

function confirmEditQuantity() {
    const newQty = Number.parseInt($("#editQuantityInput").val())
    const productId = Number.parseInt($("#editProductId").val())
    const orderId = Number.parseInt($("#editorderId").val())
    const itemid = Number.parseInt($("#edititemid").val())
    console.log("Saving new quantity:", newQty, "for product:", productId, orderId, itemid)
    $.post(
        "/SalesOrder/UpdateQuantityForSalesOrderItem",
        {
            newQty: newQty,
            orderId: orderId,
            itemid: itemid,
        },
        (response) => {
            if (response.success) {
                bootstrap.Modal.getInstance(document.getElementById("editQuantityModal")).hide()
                viewOrderDetails(orderId)
            } else {
                alert(response.message || "Update failed.")
            }
        },
    )
}

function openAddToInvoiceModal(orderid, itemid, maxQty, productId, description, price) {
    $("#invoiceorderid").val(orderid)
    $("#invoiceitemid").val(itemid)
    $("#invoiceMaxQty").val(maxQty)
    $("#invoiceProductId").val(productId)
    $("#invoiceProductDescription").val(description)
    $("#invoiceProductPrice").val(price)
    $("#invoiceQuantityInput").val(1)

    var invoiceModal = new bootstrap.Modal(document.getElementById("addToInvoiceModal"))
    invoiceModal.show()
}

function confirmAddToInvoice() {
    const orderId = Number.parseInt($("#invoiceorderid").val())
    const itemId = Number.parseInt($("#invoiceitemid").val())
    const productId = Number.parseInt($("#invoiceProductId").val())
    const description = $("#invoiceProductDescription").val()
    const unitPrice = Number.parseFloat($("#invoiceProductPrice").val())
    const quantity = Number.parseInt($("#invoiceQuantityInput").val())
    const maxQty = Number.parseInt($("#invoiceMaxQty").val())
    if (isNaN(quantity) || quantity < 1 || quantity > maxQty) {
        alert("Invalid quantity.")
        return
    }
    const total = quantity * unitPrice
    // Add to cart
    invoiceCart.push({
        orderId,
        itemId,
        productId,
        description,
        quantity,
        unitPrice,
        total,
    })
    console.log("Item added to invoice cart:", invoiceCart)
    renderInvoiceCart()
    bootstrap.Modal.getInstance(document.getElementById("addToInvoiceModal")).hide()
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
            <tbody>`
    invoice.items.forEach((item) => {
        html += `
            <tr>
                <td>${item.description}</td>
                <td>${item.quantity}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>${item.total.toFixed(2)}</td>
            </tr>`
    })
    html += `
            </tbody>
        </table>
        <div class="text-end">
            <button class="btn btn-outline-secondary" onclick="closeInvoiceSummary()">Close</button>
        </div>
    `
    $("#invoiceSummaryModal .modal-body").html(html)
    var summaryModal = new bootstrap.Modal(document.getElementById("invoiceSummaryModal"))
    summaryModal.show()
}

function closeInvoiceSummary() {
    bootstrap.Modal.getInstance(document.getElementById("invoiceSummaryModal")).hide()
}

function openCreditModal(productCode, description, maxQty, invoiceId) {
    $("#creditProductCode").val(productCode)
    $("#creditProductDescription").text(description)
    $("#creditSalesOrderId").val(invoiceId)
    $("#creditMaxQty").val(maxQty)
    $("#creditQuantityInput").attr("max", maxQty).val(1)

    var creditModal = new bootstrap.Modal(document.getElementById("creditModal"))
    creditModal.show()
}

function addItemToCreditCart() {
    const productCode = $("#creditProductCode").val()
    const description = $("#creditProductDescription").text()
    const salesOrderId = Number.parseInt($("#creditSalesOrderId").val())
    const maxQty = Number.parseInt($("#creditMaxQty").val())
    const quantity = Number.parseInt($("#creditQuantityInput").val())

    if (isNaN(quantity) || quantity < 1) {
        alert("Enter a valid quantity.")
        return
    }

    // Find the current invoice item to get the invoiced quantity
    const invoiceItem = currentInvoiceItems.find((item) => item.productCode === productCode)
    if (!invoiceItem) {
        alert("Product not found in invoice.")
        return
    }

    // Check if quantity exceeds invoiced quantity
    if (quantity > invoiceItem.invoicedquantity) {
        alert(`Credit quantity (${quantity}) cannot exceed invoiced quantity (${invoiceItem.invoicedquantity}).`)
        return
    }

    // Check if this item is already in credit cart
    const existingCreditItem = creditCart.find((item) => item.productCode === productCode)
    const totalCreditQty = existingCreditItem ? existingCreditItem.quantity + quantity : quantity

    if (totalCreditQty > invoiceItem.invoicedquantity) {
        alert(
            `Total credit quantity (${totalCreditQty}) cannot exceed invoiced quantity (${invoiceItem.invoicedquantity}).`,
        )
        return
    }

    // Check for duplicates and add/update
    if (existingCreditItem) {
        existingCreditItem.quantity += quantity
    } else {
        creditCart.push({ productCode, description, quantity })
    }

    renderCreditCart()
    bootstrap.Modal.getInstance(document.getElementById("creditModal")).hide()
}

function previewInvoice(invoiceid) {
    currentOrderId = invoiceid
    $.get("/SalesOrder/ViewInvoiceItems?invoiceid=" + invoiceid, (items) => {
        // Store current invoice items for validation
        currentInvoiceItems = items
        if (items.length > 0) {
            currentOrderId = items[0].salesOrderId; 
        }
        let html = `
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h6>Invoice Items</h6>
            <button class="btn btn-primary btn-sm" onclick="enableInvoiceCreditMode()">Create Credit</button>
        </div>
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
            <tbody>`
        items.forEach((item) => {
            html += `
            <tr>
                <td>${item.productCode}</td>
                <td>${item.productDescription}</td>
                <td>${item.invoicedquantity}</td>
                <td>${item.itemsprice.toFixed(2)}</td>
                <td>`
            if (creditMode) {
                html += `
                    <button class="btn btn-sm btn-warning"
                        onclick="openCreditModal('${item.productCode}', '${item.productDescription}', ${item.invoicedquantity}, ${invoiceid})">
                        Credit
                    </button>`
            } else {
                html += `<span class="text-muted">-</span>`
            }
            html += `</td></tr>`
        })
        html += `</tbody></table>`
        $("#invoiceDetailsBody").html(html)

        // Show credit section only in credit mode
        if (creditMode) {
            $("#creditCartSection").show()
            renderCreditCart()
        } else {
            $("#creditCartSection").hide()
        }

        var invoiceDetailsModal = new bootstrap.Modal(document.getElementById("invoiceDetailsModal"), {
            backdrop: creditMode ? "static" : true,
            keyboard: !creditMode,
        })
        invoiceDetailsModal.show()
    })
}

function enableInvoiceCreditMode() {
    creditMode = true
    creditCart = []
    $("#creditCartSection").show()
    renderCreditCart()

    // Update modal to prevent closing
    var modal = bootstrap.Modal.getInstance(document.getElementById("invoiceDetailsModal"))
    if (modal) {
        modal.hide()
        setTimeout(() => {
            var newModal = new bootstrap.Modal(document.getElementById("invoiceDetailsModal"), {
                backdrop: "static",
                keyboard: false,
            })
            newModal.show()
        }, 300)
    }

    // Update the invoice items table to show credit buttons
    updateInvoiceItemsForCreditMode()
}

function resetCreditMode() {
    creditMode = false
    creditCart = []
    $("#creditCartSection").hide()

    // Refresh the invoice view to remove credit buttons
    previewInvoice(currentOrderId)
}

function submitInvoiceCredit() {
    if (creditCart.length === 0) {
        alert("No items to credit.")
        return
    }

    // Transform creditCart to match C# expectations
    const transformedItems = creditCart.map(item => {
        const invoiceItem = currentInvoiceItems.find(inv => inv.productCode === item.productCode);
        if (!invoiceItem) {
            alert(`Invoice item not found for product code: ${item.productCode}`);
            return null;
        }

        return {
            itemId: invoiceItem.salesOrderItemId, // ✅ Now this will be available
            quantity: item.quantity,
            unitPrice: invoiceItem.itemsprice / invoiceItem.invoicedquantity,
            total: (invoiceItem.itemsprice / invoiceItem.invoicedquantity) * item.quantity
        };
    }).filter(item => item !== null);

    if (transformedItems.length === 0) {
        alert("No valid items to credit.");
        return;
    }

    console.log("Sending credit request:", {
        orderId: currentOrderId,
        items: transformedItems
    }); 

    $.ajax({
        type: "POST",
        url: "/SalesOrder/CreditInvoiceItems",
        contentType: "application/json",
        data: JSON.stringify({
            orderId: currentOrderId,
            items: transformedItems
        }),
        success: (response) => {
            alert("Credit processed.")
            creditCart = []
            creditMode = false
            $("#creditCartSection").hide()
            bootstrap.Modal.getInstance(document.getElementById("invoiceDetailsModal")).hide()
        },
        error: (xhr) => {
            console.error("Credit error:", xhr.responseText); 
            alert("Error processing credit: " + xhr.responseText)
        },
    })
}

function updateQuantity(orderId, productId) {
    const newQty = Number.parseInt($(`#qty_${productId}`).val())
    if (isNaN(newQty) || newQty < 1) {
        alert("Enter a valid quantity.")
        return
    }
    $.ajax({
        url: "/SalesOrder/UpdateItemQuantity",
        method: "POST",
        data: { orderId, productId, newQuantity: newQty },
        success: (response) => {
            if (response.success) {
                alert("Quantity updated.")
                viewOrderDetails(orderId)
            } else {
                alert(response.message || "Update failed.")
            }
        },
        error: () => {
            alert("Error updating quantity.")
        },
    })
}

function removeItem(orderId, productId) {
    if (!confirm("Are you sure you want to remove this item?")) return
    $.ajax({
        url: "/SalesOrder/RemoveOrderItem",
        method: "POST",
        data: { orderId, productId },
        success: (response) => {
            if (response.success) {
                alert("Item removed.")
                viewOrderDetails(orderId)
            } else {
                alert(response.message || "Delete failed.")
            }
        },
        error: () => {
            alert("Error removing item.")
        },
    })
}

function addToInvoiceCart(productId, description, price, maxQty) {
    const qty = Number.parseInt($(`#qty_${productId}`).val())
    if (isNaN(qty) || qty < 1 || qty > maxQty) {
        alert("Invalid quantity.")
        return
    }
    const existing = invoiceCart.find((item) => item.productId === productId)
    if (existing) {
        existing.quantity += qty
    } else {
        invoiceCart.push({ productId, description, price, quantity: qty })
    }
    renderInvoiceCart()
}

function renderInvoiceCart() {
    const modalTbody = $("#invoiceCartTable tbody")
    const previewTbody = $("#invoicePreviewTable tbody")
    modalTbody.empty()
    if (previewTbody.length) previewTbody.empty()

    if (invoiceCart.length === 0) {
        modalTbody.append(`<tr><td colspan="5" class="text-muted text-center">No items added.</td></tr>`)
        if (previewTbody.length)
            previewTbody.append(`<tr><td colspan="5" class="text-muted text-center">No items added.</td></tr>`)
        return
    }

    invoiceCart.forEach((item, index) => {
        const row = `
            <tr>
                <td>${item.description}</td>
                <td>${item.quantity}</td>
                <td>${item.price ? item.price.toFixed(2) : "0.00"}</td>
                <td>${item.price ? (item.quantity * item.price).toFixed(2) : "0.00"}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="removeFromInvoiceCart(${index})">🗑</button>
                </td>
            </tr>
        `
        modalTbody.append(row)
        if (previewTbody.length) previewTbody.append(row)
    })
}

function removeFromInvoiceCart(index) {
    invoiceCart.splice(index, 1)
    renderInvoiceCart()
}

function submitInvoice() {
    if (invoiceCart.length === 0) {
        alert("Invoice cart is empty.")
        return
    }
    const payload = {
        orderId: currentOrderId,
        items: invoiceCart.map((item) => ({
            itemId: item.itemId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.total,
        })),
    }
    $.ajax({
        url: "/SalesOrder/CreateInvoice",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(payload),
        success: (res) => {
            if (res.success) {
                // Reset state
                invoiceCart = []
                renderInvoiceCart()
                bootstrap.Modal.getInstance(document.getElementById("orderDetailsModal")).hide()
                // Show preview
                showInvoicePreview(res.invoice)
            } else {
                alert(res.message || "Failed to create invoice.")
            }
        },
        error: (xhr) => {
            console.error("Invoice error:", xhr.responseText)
            alert("Error creating invoice: " + xhr.responseText)
        },
    })
}

function loadPreviousInvoices(orderId) {
    $.get(`/SalesOrder/GetInvoicesForOrder?orderId=${orderId}`, (invoices) => {
        const container = $("#invoiceHistorySection")
        container.empty()
        if (!invoices || invoices.length === 0) {
            container.html(`<p class="text-muted">No invoices found for this order.</p>`)
            return
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
        `
        invoices.forEach((inv) => {
            html += `
                <tr>
                    <td>${inv.salesInvoiceId}</td>
                    <td>${inv.invoiveDate}</td>
                    <td>${inv.price.toFixed(2)}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-secondary" onclick="previewInvoice(${inv.salesInvoiceId})">View</button>
                    </td>
                </tr>
            `
        })
        html += `</tbody></table>`
        container.html(html)
    })
}

function renderCreditCart() {
    const tbody = $("#creditCartTable tbody")
    tbody.empty()
    if (creditCart.length === 0) {
        tbody.append(`<tr><td colspan="4" class="text-muted text-center">No items added.</td></tr>`)
        return
    }
    creditCart.forEach((item, index) => {
        tbody.append(`
            <tr>
                <td>${item.productCode}</td>
                <td>${item.description}</td>
                <td>${item.quantity}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="removeFromCreditCart(${index})">🗑</button>
                </td>
            </tr>
        `)
    })
}

function removeFromCreditCart(index) {
    creditCart.splice(index, 1)
    renderCreditCart()
}

function updateInvoiceItemsForCreditMode() {
    // Find all action cells and add credit buttons
    $("#invoiceDetailsBody table tbody tr").each(function () {
        const $row = $(this)
        const $actionCell = $row.find("td:last")
        const productCode = $row.find("td:first").text()
        const description = $row.find("td:nth-child(2)").text()
        const maxQty = Number.parseInt($row.find("td:nth-child(3)").text())

        // Clear existing content and add credit button
        $actionCell.html(`
            <button class="btn btn-sm btn-warning" onclick="openCreditModal('${productCode}', '${description}', ${maxQty}, ${currentOrderId})">
                Credit
            </button>
        `)
    })
}

function confirmCredit() {
    const productCode = $("#creditProductCode").val()
    const salesOrderId = $("#creditSalesOrderId").val()
    const quantity = Number.parseInt($("#creditQuantityInput").val())
    if (isNaN(quantity) || quantity < 1) {
        alert("Enter a valid quantity.")
        return
    }
    $.post("/SalesOrder/CreditItem", { productCode, quantity, salesOrderId }, (response) => {
        if (response.success) {
            alert("Credit applied successfully.")
            bootstrap.Modal.getInstance(document.getElementById("creditModal")).hide()
            viewOrderDetails(salesOrderId) // Refresh the order
        } else {
            alert(response.message || "Failed to credit item.")
        }
    })
}

function confirmInvoiceCredit() {
    creditList = []
    $(".credit-input").each(function () {
        const qty = Number.parseInt($(this).val())
        const max = Number.parseInt($(this).data("max"))
        const productCode = $(this).data("product-code")
        if (!isNaN(qty) && qty > 0 && qty <= max) {
            creditList.push({
                productCode: productCode,
                quantity: qty,
            })
        }
    })
    if (creditList.length === 0) {
        alert("Please enter at least one item to credit.")
        return
    }
    $.ajax({
        type: "POST",
        url: "/SalesOrder/CreditInvoiceItems",
        contentType: "application/json",
        data: JSON.stringify({
            salesOrderId: currentOrderId,
            items: creditList,
        }),
        success: (response) => {
            alert("Credit successful.")
            creditMode = false
            bootstrap.Modal.getInstance(document.getElementById("invoiceDetailsModal")).hide()
        },
        error: () => {
            alert("Error while processing credit.")
        },
    })
}
