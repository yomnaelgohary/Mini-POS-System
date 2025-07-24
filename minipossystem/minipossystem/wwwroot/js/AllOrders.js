// Import jQuery and Bootstrap
import $ from "jquery"
import bootstrap from "bootstrap"

let invoiceCart = []
let currentOrderId = null
let creditCart = []
let creditMode = false
let creditList = []
let currentInvoiceItems = []

$(document).ready(() => {
    loadAllOrders()
    initializeEnhancements()
})

function loadAllOrders() {
    // Show loading state
    showLoadingState("#ordersTable tbody", "Loading orders...")

    $.ajax({
        url: "/SalesOrder/GetAllOrders",
        type: "GET",
        success: (orders) => {
            const tbody = $("#ordersTable tbody")
            tbody.empty()

            if (orders.length === 0) {
                tbody.append(`
                    <tr class="animate-fade-in">
                        <td colspan="6" class="text-center text-muted py-5">
                            <i class="fas fa-inbox display-6 d-block mb-2 text-muted"></i>
                            <div class="fw-bold">No orders found</div>
                            <div class="small">Orders will appear here when created</div>
                        </td>
                    </tr>
                `)
                return
            }

            orders.forEach((order, index) => {
                const statusBadge = getStatusBadge(order.status)
                const formattedDate = formatDate(order.orderDate)

                tbody.append(`
                    <tr class="animate-slide-in" style="animation-delay: ${index * 0.1}s">
                        <td>
                            <span class="fw-bold text-primary">#${order.salesOrderId}</span>
                        </td>
                        <td>
                            <div class="d-flex align-items-center">
                                <i class="fas fa-user-circle text-secondary me-2"></i>
                                <span class="fw-semibold">${order.customerName}</span>
                            </div>
                        </td>
                        <td>
                            <div class="d-flex align-items-center">
                                <i class="fas fa-calendar text-secondary me-2"></i>
                                <span>${formattedDate}</span>
                            </div>
                        </td>
                        <td>${statusBadge}</td>
                        <td>
                            <span class="badge bg-info">${order.itemCount} items</span>
                        </td>
                        <td>
                            <button class="btn btn-sm btn-cashetrip-primary btn-enhanced" onclick="viewOrderDetails(${order.salesOrderId})" title="View order details">
                                <i class="fas fa-eye me-1"></i>
                                View
                            </button>
                        </td>
                    </tr>
                `)
            })

            showAlert("Orders loaded successfully", "success", 2000)
        },
        error: (err) => {
            console.error("Failed to fetch orders:", err)
            showAlert("Failed to load orders. Please try again.", "danger")

            const tbody = $("#ordersTable tbody")
            tbody.html(`
                <tr>
                    <td colspan="6" class="text-center text-danger py-4">
                        <i class="fas fa-exclamation-triangle display-6 d-block mb-2"></i>
                        <div class="fw-bold">Error loading orders</div>
                        <div class="small">Please refresh the page to try again</div>
                    </td>
                </tr>
            `)
        },
    })
}

function viewOrderDetails(orderId) {
    // Show loading overlay
    showLoadingOverlay("Loading order details...")

    $.ajax({
        url: "/SalesOrder/GetOrderDetails?id=" + orderId,
        method: "GET",
        success: (response) => {
            hideLoadingOverlay()

            if (response.success) {
                const order = response.data
                currentOrderId = order.salesOrderId
                loadPreviousInvoices(order.salesOrderId)
                invoiceCart = []

                let html = `
                    <div class="order-header mb-4">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="info-card">
                                    <i class="fas fa-hashtag text-cashetrip-primary"></i>
                                    <div>
                                        <div class="label">Order ID</div>
                                        <div class="value">#${order.salesOrderId}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="info-card">
                                    <i class="fas fa-user text-cashetrip-success"></i>
                                    <div>
                                        <div class="label">Customer</div>
                                        <div class="value">${order.customerName}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="info-card">
                                    <i class="fas fa-calendar text-cashetrip-info"></i>
                                    <div>
                                        <div class="label">Date</div>
                                        <div class="value">${formatDate(order.orderDate)}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="info-card">
                                    <i class="fas fa-info-circle text-cashetrip-warning"></i>
                                    <div>
                                        <div class="label">Status</div>
                                        <div class="value">${getStatusBadge(order.status)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="section-header">
                        <h5><i class="fas fa-boxes me-2"></i>Order Items</h5>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-hover enhanced-table">
                            <thead>
                                <tr>
                                    <th><i class="fas fa-barcode me-1"></i>Product Code</th>
                                    <th><i class="fas fa-tag me-1"></i>Description</th>
                                    <th><i class="fas fa-sort-numeric-up me-1"></i>Quantity</th>
                                    <th><i class="fas fa-dollar-sign me-1"></i>Price</th>
                                    <th><i class="fas fa-calculator me-1"></i>Total</th>
                                    <th><i class="fas fa-cogs me-1"></i>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                `

                order.items.forEach((item, index) => {
                    html += `
                        <tr class="animate-slide-in" style="animation-delay: ${index * 0.1}s">
                            <td>
                                <span class="badge bg-cashetrip-secondary">${item.productCode}</span>
                            </td>
                            <td>
                                <div class="fw-semibold">${item.description}</div>
                            </td>
                            <td>
                                <div class="quantity-display">
                                    <span id="qty_display_${item.productId}" class="fw-bold text-cashetrip-primary">${item.quantity}</span>
                                    <button class="btn btn-sm btn-cashetrip-warning btn-enhanced ms-2" 
                                            onclick="openEditQuantityModal(${order.salesOrderId}, ${item.productId}, ${item.quantity}, ${item.salesOrderItemId})"
                                            title="Edit quantity">
                                        <i class="fas fa-edit me-1"></i>Edit
                                    </button>
                                </div>
                            </td>
                            <td>
                                <span class="fw-semibold text-cashetrip-success">${Number.parseFloat(item.price).toFixed(2)} EGP</span>
                            </td>
                            <td>
                                <span class="fw-bold text-cashetrip-primary">${Number.parseFloat(item.total).toFixed(2)} EGP</span>
                            </td>
                            <td>
                                <div class="btn-group" role="group">
                                    <button class="btn btn-sm btn-cashetrip-success btn-enhanced" 
                                            onclick="openAddToInvoiceModal(${order.salesOrderId}, ${item.salesOrderItemId}, ${item.quantity}, ${item.productId}, '${item.description}', ${item.price})"
                                            title="Add to invoice">
                                        <i class="fas fa-plus-circle me-1"></i>Invoice
                                    </button>
                                    <button class="btn btn-sm btn-cashetrip-danger btn-enhanced" 
                                            onclick="removeItem(${order.salesOrderId}, ${item.productId})"
                                            title="Remove item">
                                        <i class="fas fa-trash me-1"></i>Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `
                })

                html += `
                            </tbody>
                        </table>
                    </div>
                    
                    <div class="section-header mt-4">
                        <h5><i class="fas fa-shopping-cart me-2"></i>Invoice Cart</h5>
                    </div>
                    <div class="invoice-cart-container">
                        <table class="table table-bordered enhanced-table" id="invoiceCartTable">
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
                        <button class="btn btn-cashetrip-primary btn-enhanced mt-2" onclick="submitInvoice()">
                            <i class="fas fa-file-invoice me-2"></i>Create Invoice
                        </button>
                    </div>
                    
                    <div class="section-header mt-4">
                        <h5><i class="fas fa-history me-2"></i>Previous Invoices</h5>
                    </div>
                    <div id="invoiceHistorySection" class="invoice-history-container">
                        <div class="loading-placeholder">
                            <i class="fas fa-spinner fa-spin me-2"></i>Loading invoices...
                        </div>
                    </div>
                `

                $("#orderDetailsModal .modal-body").html(html)
                renderInvoiceCart()

                // Use Bootstrap 5 modal API with enhanced styling
                var orderModal = new bootstrap.Modal(document.getElementById("orderDetailsModal"))
                orderModal.show()

                showAlert("Order details loaded successfully", "success", 2000)
            } else {
                hideLoadingOverlay()
                showAlert("Order not found", "danger")
            }
        },
        error: () => {
            hideLoadingOverlay()
            showAlert("Error loading order details", "danger")
        },
    })
}

function openEditQuantityModal(orderId, productId, currentQty, itemid) {
    $("#editorderId").val(orderId)
    $("#edititemid").val(itemid)
    $("#editProductId").val(productId)
    $("#editQuantityInput").val(currentQty).focus().select()

    var editModal = new bootstrap.Modal(document.getElementById("editQuantityModal"))
    editModal.show()
}

function confirmEditQuantity() {
    const newQty = Number.parseInt($("#editQuantityInput").val())
    const productId = Number.parseInt($("#editProductId").val())
    const orderId = Number.parseInt($("#editorderId").val())
    const itemid = Number.parseInt($("#edititemid").val())

    if (isNaN(newQty) || newQty <= 0) {
        showAlert("Please enter a valid quantity", "warning")
        $("#editQuantityInput").focus().select().addClass("animate-shake")
        setTimeout(() => $("#editQuantityInput").removeClass("animate-shake"), 600)
        return
    }

    // Show loading state
    const saveBtn = $("button[onclick='confirmEditQuantity()']")
    const originalText = saveBtn.html()
    saveBtn.html('<span class="loading-spinner"></span> Saving...').prop("disabled", true)

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
                showAlert("Quantity updated successfully", "success", 3000)
            } else {
                showAlert(response.message || "Update failed", "danger")
            }
        },
    )
        .fail(() => {
            showAlert("Network error occurred", "danger")
        })
        .always(() => {
            saveBtn.html(originalText).prop("disabled", false)
        })
}

function openAddToInvoiceModal(orderid, itemid, maxQty, productId, description, price) {
    $("#invoiceorderid").val(orderid)
    $("#invoiceitemid").val(itemid)
    $("#invoiceMaxQty").val(maxQty)
    $("#invoiceProductId").val(productId)
    $("#invoiceProductDescription").val(description)
    $("#invoiceProductPrice").val(price)
    $("#invoiceQuantityInput").val(1).focus().select()

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
        showAlert(`Invalid quantity. Must be between 1 and ${maxQty}`, "warning")
        $("#invoiceQuantityInput").focus().select().addClass("animate-shake")
        setTimeout(() => $("#invoiceQuantityInput").removeClass("animate-shake"), 600)
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
    showAlert(`Added ${description} to invoice cart`, "success", 3000)
}

function showInvoicePreview(invoice) {
    let html = `
        <div class="invoice-preview-header">
            <div class="row">
                <div class="col-md-6">
                    <h5 class="text-cashetrip-primary">
                        <i class="fas fa-file-invoice me-2"></i>
                        Invoice #${invoice.invoiceId}
                    </h5>
                </div>
                <div class="col-md-6 text-end">
                    <span class="badge bg-cashetrip-success fs-6">Created Successfully</span>
                </div>
            </div>
        </div>
        
        <div class="invoice-info-grid">
            <div class="info-item">
                <i class="fas fa-hashtag text-cashetrip-primary"></i>
                <div>
                    <div class="label">Order ID</div>
                    <div class="value">#${invoice.orderId}</div>
                </div>
            </div>
            <div class="info-item">
                <i class="fas fa-calendar text-cashetrip-info"></i>
                <div>
                    <div class="label">Date</div>
                    <div class="value">${formatDate(invoice.date)}</div>
                </div>
            </div>
            <div class="info-item">
                <i class="fas fa-dollar-sign text-cashetrip-success"></i>
                <div>
                    <div class="label">Total Price</div>
                    <div class="value fw-bold">${invoice.total.toFixed(2)} EGP</div>
                </div>
            </div>
        </div>
        
        <hr />
        <div class="table-responsive">
            <table class="table table-bordered enhanced-table">
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Qty</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
    `

    invoice.items.forEach((item, index) => {
        html += `
            <tr class="animate-slide-in" style="animation-delay: ${index * 0.1}s">
                <td class="fw-semibold">${item.description}</td>
                <td><span class="badge bg-cashetrip-info">${item.quantity}</span></td>
                <td class="text-cashetrip-success fw-semibold">${item.price.toFixed(2)} EGP</td>
                <td class="text-cashetrip-primary fw-bold">${item.total.toFixed(2)} EGP</td>
            </tr>
        `
    })

    html += `
                </tbody>
            </table>
        </div>
        <div class="text-end mt-3">
            <button class="btn btn-cashetrip-secondary btn-enhanced" onclick="closeInvoiceSummary()">
                <i class="fas fa-times me-2"></i>Close
            </button>
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
    $("#creditQuantityInput").attr("max", maxQty).val(1).focus().select()

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
        showAlert("Enter a valid quantity", "warning")
        $("#creditQuantityInput").focus().select().addClass("animate-shake")
        setTimeout(() => $("#creditQuantityInput").removeClass("animate-shake"), 600)
        return
    }

    // Find the current invoice item to get the invoiced quantity
    const invoiceItem = currentInvoiceItems.find((item) => item.productCode === productCode)
    if (!invoiceItem) {
        showAlert("Product not found in invoice", "danger")
        return
    }

    // Check if quantity exceeds invoiced quantity
    if (quantity > invoiceItem.invoicedquantity) {
        showAlert(
            `Credit quantity (${quantity}) cannot exceed invoiced quantity (${invoiceItem.invoicedquantity})`,
            "warning",
        )
        return
    }

    // Check if this item is already in credit cart
    const existingCreditItem = creditCart.find((item) => item.productCode === productCode)
    const totalCreditQty = existingCreditItem ? existingCreditItem.quantity + quantity : quantity

    if (totalCreditQty > invoiceItem.invoicedquantity) {
        showAlert(
            `Total credit quantity (${totalCreditQty}) cannot exceed invoiced quantity (${invoiceItem.invoicedquantity})`,
            "warning",
        )
        return
    }

    // Check for duplicates and add/update
    if (existingCreditItem) {
        existingCreditItem.quantity += quantity
        showAlert(`Updated credit quantity for ${description}`, "info", 3000)
    } else {
        creditCart.push({ productCode, description, quantity })
        showAlert(`Added ${description} to credit cart`, "success", 3000)
    }

    renderCreditCart()
    bootstrap.Modal.getInstance(document.getElementById("creditModal")).hide()
}

function previewInvoice(invoiceid) {
    currentOrderId = invoiceid
    showLoadingOverlay("Loading invoice details...")

    $.get("/SalesOrder/ViewInvoiceItems?invoiceid=" + invoiceid, (items) => {
        hideLoadingOverlay()

        // Store current invoice items for validation
        currentInvoiceItems = items
        if (items.length > 0) {
            currentOrderId = items[0].salesOrderId
        }

        let html = `
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="mb-0">
                    <i class="fas fa-file-invoice me-2"></i>
                    Invoice Items
                </h6>
                <button class="btn btn-cashetrip-primary btn-sm btn-enhanced" onclick="enableInvoiceCreditMode()">
                    <i class="fas fa-undo me-2"></i>Create Credit
                </button>
            </div>
            <div class="table-responsive">
                <table class="table table-bordered enhanced-table">
                    <thead>
                        <tr>
                            <th>Product Code</th>
                            <th>Description</th>
                            <th>Invoiced Qty</th>
                            <th>Total Price</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
        `

        items.forEach((item, index) => {
            html += `
                <tr class="animate-slide-in" style="animation-delay: ${index * 0.1}s">
                    <td><span class="badge bg-cashetrip-secondary">${item.productCode}</span></td>
                    <td class="fw-semibold">${item.productDescription}</td>
                    <td><span class="badge bg-cashetrip-info">${item.invoicedquantity}</span></td>
                    <td class="fw-bold text-cashetrip-success">${item.itemsprice.toFixed(2)} EGP</td>
                    <td>
            `

            if (creditMode) {
                html += `
                    <button class="btn btn-sm btn-cashetrip-warning btn-enhanced"
                        onclick="openCreditModal('${item.productCode}', '${item.productDescription}', ${item.invoicedquantity}, ${invoiceid})">
                        <i class="fas fa-undo me-1"></i>Credit
                    </button>
                `
            } else {
                html += `<span class="text-muted">-</span>`
            }

            html += `</td></tr>`
        })

        html += `</tbody></table></div>`

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
    }).fail(() => {
        hideLoadingOverlay()
        showAlert("Error loading invoice details", "danger")
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
    showAlert("Credit mode enabled", "info", 3000)
}

function resetCreditMode() {
    creditMode = false
    creditCart = []
    $("#creditCartSection").hide()
    // Refresh the invoice view to remove credit buttons
    previewInvoice(currentOrderId)
    showAlert("Credit mode disabled", "info", 2000)
}

function submitInvoiceCredit() {
    if (creditCart.length === 0) {
        showAlert("No items to credit", "warning")
        return
    }

    showLoadingOverlay("Processing credit...")

    // Transform creditCart to match C# expectations
    const transformedItems = creditCart
        .map((item) => {
            const invoiceItem = currentInvoiceItems.find((inv) => inv.productCode === item.productCode)
            if (!invoiceItem) {
                showAlert(`Invoice item not found for product code: ${item.productCode}`, "danger")
                return null
            }
            return {
                itemId: invoiceItem.salesOrderItemId,
                quantity: item.quantity,
                unitPrice: invoiceItem.itemsprice / invoiceItem.invoicedquantity,
                total: (invoiceItem.itemsprice / invoiceItem.invoicedquantity) * item.quantity,
            }
        })
        .filter((item) => item !== null)

    if (transformedItems.length === 0) {
        hideLoadingOverlay()
        showAlert("No valid items to credit", "warning")
        return
    }

    console.log("Sending credit request:", {
        orderId: currentOrderId,
        items: transformedItems,
    })

    $.ajax({
        type: "POST",
        url: "/SalesOrder/CreditInvoiceItems",
        contentType: "application/json",
        data: JSON.stringify({
            orderId: currentOrderId,
            items: transformedItems,
        }),
        success: (response) => {
            hideLoadingOverlay()
            showAlert("Credit processed successfully", "success")
            creditCart = []
            creditMode = false
            $("#creditCartSection").hide()
            bootstrap.Modal.getInstance(document.getElementById("invoiceDetailsModal")).hide()
        },
        error: (xhr) => {
            hideLoadingOverlay()
            console.error("Credit error:", xhr.responseText)
            showAlert("Error processing credit: " + xhr.responseText, "danger")
        },
    })
}

function updateQuantity(orderId, productId) {
    const newQty = Number.parseInt($(`#qty_${productId}`).val())
    if (isNaN(newQty) || newQty < 1) {
        showAlert("Enter a valid quantity", "warning")
        return
    }

    showLoadingOverlay("Updating quantity...")

    $.ajax({
        url: "/SalesOrder/UpdateItemQuantity",
        method: "POST",
        data: { orderId, productId, newQuantity: newQty },
        success: (response) => {
            hideLoadingOverlay()
            if (response.success) {
                showAlert("Quantity updated successfully", "success")
                viewOrderDetails(orderId)
            } else {
                showAlert(response.message || "Update failed", "danger")
            }
        },
        error: () => {
            hideLoadingOverlay()
            showAlert("Error updating quantity", "danger")
        },
    })
}

function removeItem(orderId, productId) {
    if (!confirm("Are you sure you want to remove this item?")) return

    showLoadingOverlay("Removing item...")

    $.ajax({
        url: "/SalesOrder/RemoveOrderItem",
        method: "POST",
        data: { orderId, productId },
        success: (response) => {
            hideLoadingOverlay()
            if (response.success) {
                showAlert("Item removed successfully", "success")
                viewOrderDetails(orderId)
            } else {
                showAlert(response.message || "Delete failed", "danger")
            }
        },
        error: () => {
            hideLoadingOverlay()
            showAlert("Error removing item", "danger")
        },
    })
}

function addToInvoiceCart(productId, description, price, maxQty) {
    const qty = Number.parseInt($(`#qty_${productId}`).val())
    if (isNaN(qty) || qty < 1 || qty > maxQty) {
        showAlert("Invalid quantity", "warning")
        return
    }

    const existing = invoiceCart.find((item) => item.productId === productId)
    if (existing) {
        existing.quantity += qty
        showAlert(`Updated quantity for ${description}`, "info", 3000)
    } else {
        invoiceCart.push({ productId, description, price, quantity: qty })
        showAlert(`Added ${description} to invoice cart`, "success", 3000)
    }

    renderInvoiceCart()
}

function renderInvoiceCart() {
    const modalTbody = $("#invoiceCartTable tbody")
    const previewTbody = $("#invoicePreviewTable tbody")
    modalTbody.empty()
    if (previewTbody.length) previewTbody.empty()

    if (invoiceCart.length === 0) {
        const emptyRow = `
            <tr class="animate-fade-in">
                <td colspan="5" class="text-muted text-center py-4">
                    <i class="fas fa-shopping-cart display-6 d-block mb-2 text-muted"></i>
                    <div class="fw-bold">Invoice cart is empty</div>
                    <div class="small">Add items to create an invoice</div>
                </td>
            </tr>
        `
        modalTbody.append(emptyRow)
        if (previewTbody.length) previewTbody.append(emptyRow)
        return
    }

    invoiceCart.forEach((item, index) => {
        const row = `
            <tr class="animate-slide-in" style="animation-delay: ${index * 0.1}s">
                <td class="fw-semibold">${item.description}</td>
                <td><span class="badge bg-cashetrip-info">${item.quantity}</span></td>
                <td class="text-cashetrip-success fw-semibold">${item.price ? item.price.toFixed(2) : "0.00"} EGP</td>
                <td class="text-cashetrip-primary fw-bold">${item.price ? (item.quantity * item.price).toFixed(2) : "0.00"} EGP</td>
                <td>
                    <button class="btn btn-cashetrip-danger btn-sm btn-enhanced" onclick="removeFromInvoiceCart(${index})" title="Remove from cart">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `
        modalTbody.append(row)
        if (previewTbody.length) previewTbody.append(row)
    })
}

function removeFromInvoiceCart(index) {
    const removedItem = invoiceCart[index].description
    invoiceCart.splice(index, 1)
    renderInvoiceCart()
    showAlert(`Removed ${removedItem} from invoice cart`, "info", 2000)
}

function submitInvoice() {
    if (invoiceCart.length === 0) {
        showAlert("Invoice cart is empty", "warning")
        return
    }

    showLoadingOverlay("Creating invoice...")

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
            hideLoadingOverlay()
            if (res.success) {
                // Reset state
                invoiceCart = []
                renderInvoiceCart()
                bootstrap.Modal.getInstance(document.getElementById("orderDetailsModal")).hide()
                // Show preview
                showInvoicePreview(res.invoice)
                showAlert("Invoice created successfully", "success")
            } else {
                showAlert(res.message || "Failed to create invoice", "danger")
            }
        },
        error: (xhr) => {
            hideLoadingOverlay()
            console.error("Invoice error:", xhr.responseText)
            showAlert("Error creating invoice: " + xhr.responseText, "danger")
        },
    })
}

function loadPreviousInvoices(orderId) {
    $.get(`/SalesOrder/GetInvoicesForOrder?orderId=${orderId}`, (invoices) => {
        const container = $("#invoiceHistorySection")
        container.empty()

        if (!invoices || invoices.length === 0) {
            container.html(`
                <div class="text-center py-4 text-muted">
                    <i class="fas fa-file-invoice display-6 d-block mb-2"></i>
                    <div class="fw-bold">No invoices found</div>
                    <div class="small">Invoices for this order will appear here</div>
                </div>
            `)
            return
        }

        let html = `
            <div class="table-responsive">
                <table class="table table-sm table-bordered enhanced-table">
                    <thead>
                        <tr>
                            <th><i class="fas fa-hashtag me-1"></i>Invoice #</th>
                            <th><i class="fas fa-calendar me-1"></i>Date</th>
                            <th><i class="fas fa-dollar-sign me-1"></i>Total</th>
                            <th><i class="fas fa-cogs me-1"></i>Action</th>
                        </tr>
                    </thead>
                    <tbody>
        `

        invoices.forEach((inv, index) => {
            html += `
                <tr class="animate-slide-in" style="animation-delay: ${index * 0.1}s">
                    <td><span class="fw-bold text-cashetrip-primary">#${inv.salesInvoiceId}</span></td>
                    <td>${formatDate(inv.invoiveDate)}</td>
                    <td class="fw-bold text-cashetrip-success">${inv.price.toFixed(2)} EGP</td>
                    <td>
                        <button class="btn btn-sm btn-cashetrip-secondary btn-enhanced" onclick="previewInvoice(${inv.salesInvoiceId})" title="View invoice">
                            <i class="fas fa-eye me-1"></i>View
                        </button>
                    </td>
                </tr>
            `
        })

        html += `</tbody></table></div>`
        container.html(html)
    }).fail(() => {
        const container = $("#invoiceHistorySection")
        container.html(`
            <div class="text-center py-4 text-danger">
                <i class="fas fa-exclamation-triangle display-6 d-block mb-2"></i>
                <div class="fw-bold">Error loading invoices</div>
                <div class="small">Please try refreshing the page</div>
            </div>
        `)
    })
}

function renderCreditCart() {
    const tbody = $("#creditCartTable tbody")
    tbody.empty()

    if (creditCart.length === 0) {
        tbody.append(`
            <tr class="animate-fade-in">
                <td colspan="4" class="text-muted text-center py-4">
                    <i class="fas fa-undo display-6 d-block mb-2 text-muted"></i>
                    <div class="fw-bold">No items to credit</div>
                    <div class="small">Add items to create a credit</div>
                </td>
            </tr>
        `)
        return
    }

    creditCart.forEach((item, index) => {
        tbody.append(`
            <tr class="animate-slide-in" style="animation-delay: ${index * 0.1}s">
                <td><span class="badge bg-cashetrip-secondary">${item.productCode}</span></td>
                <td class="fw-semibold">${item.description}</td>
                <td><span class="badge bg-cashetrip-warning">${item.quantity}</span></td>
                <td>
                    <button class="btn btn-sm btn-cashetrip-danger btn-enhanced" onclick="removeFromCreditCart(${index})" title="Remove from credit cart">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `)
    })
}

function removeFromCreditCart(index) {
    const removedItem = creditCart[index].description
    creditCart.splice(index, 1)
    renderCreditCart()
    showAlert(`Removed ${removedItem} from credit cart`, "info", 2000)
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
            <button class="btn btn-sm btn-cashetrip-warning btn-enhanced" onclick="openCreditModal('${productCode}', '${description}', ${maxQty}, ${currentOrderId})">
                <i class="fas fa-undo me-1"></i>Credit
            </button>
        `)
    })
}

function confirmCredit() {
    const productCode = $("#creditProductCode").val()
    const salesOrderId = $("#creditSalesOrderId").val()
    const quantity = Number.parseInt($("#creditQuantityInput").val())

    if (isNaN(quantity) || quantity < 1) {
        showAlert("Enter a valid quantity", "warning")
        return
    }

    showLoadingOverlay("Processing credit...")

    $.post("/SalesOrder/CreditItem", { productCode, quantity, salesOrderId }, (response) => {
        hideLoadingOverlay()
        if (response.success) {
            showAlert("Credit applied successfully", "success")
            bootstrap.Modal.getInstance(document.getElementById("creditModal")).hide()
            viewOrderDetails(salesOrderId) // Refresh the order
        } else {
            showAlert(response.message || "Failed to credit item", "danger")
        }
    }).fail(() => {
        hideLoadingOverlay()
        showAlert("Network error occurred", "danger")
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
        showAlert("Please enter at least one item to credit", "warning")
        return
    }

    showLoadingOverlay("Processing credit...")

    $.ajax({
        type: "POST",
        url: "/SalesOrder/CreditInvoiceItems",
        contentType: "application/json",
        data: JSON.stringify({
            salesOrderId: currentOrderId,
            items: creditList,
        }),
        success: (response) => {
            hideLoadingOverlay()
            showAlert("Credit successful", "success")
            creditMode = false
            bootstrap.Modal.getInstance(document.getElementById("invoiceDetailsModal")).hide()
        },
        error: () => {
            hideLoadingOverlay()
            showAlert("Error while processing credit", "danger")
        },
    })
}

// Utility Functions
function initializeEnhancements() {
    // Add enhanced styles with CasheTrip theme colors
    const styles = `
        <style>
            :root {
                --cashetrip-primary: #1e3a8a;
                --cashetrip-primary-hover: #1e40af;
                --cashetrip-secondary: #64748b;
                --cashetrip-success: #059669;
                --cashetrip-danger: #dc2626;
                --cashetrip-warning: #d97706;
                --cashetrip-info: #0284c7;
                --cashetrip-light: #f8fafc;
                --cashetrip-dark: #0f172a;
            }
            
            .animate-fade-in {
                animation: fadeIn 0.5s ease-in-out;
            }
            
            .animate-slide-in {
                animation: slideIn 0.5s ease-out;
            }
            
            .animate-shake {
                animation: shake 0.6s ease-in-out;
            }
            
            .loading-spinner {
                display: inline-block;
                width: 16px;
                height: 16px;
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                border-top-color: white;
                animation: spin 1s ease-in-out infinite;
            }
            
            .loading-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(15, 23, 42, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                backdrop-filter: blur(5px);
            }
            
            .loading-content {
                text-align: center;
                color: white;
            }
            
            .loading-spinner-large {
                width: 50px;
                height: 50px;
                border: 4px solid rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                border-top-color: white;
                animation: spin 1s ease-in-out infinite;
                margin: 0 auto 20px;
            }
            
            /* CasheTrip Button Styles */
            .btn-cashetrip-primary {
                background-color: var(--cashetrip-primary);
                border-color: var(--cashetrip-primary);
                color: white;
            }
            
            .btn-cashetrip-primary:hover {
                background-color: var(--cashetrip-primary-hover);
                border-color: var(--cashetrip-primary-hover);
                color: white;
            }
            
            .btn-cashetrip-secondary {
                background-color: var(--cashetrip-secondary);
                border-color: var(--cashetrip-secondary);
                color: white;
            }
            
            .btn-cashetrip-secondary:hover {
                background-color: #475569;
                border-color: #475569;
                color: white;
            }
            
            .btn-cashetrip-success {
                background-color: var(--cashetrip-success);
                border-color: var(--cashetrip-success);
                color: white;
            }
            
            .btn-cashetrip-success:hover {
                background-color: #047857;
                border-color: #047857;
                color: white;
            }
            
            .btn-cashetrip-danger {
                background-color: var(--cashetrip-danger);
                border-color: var(--cashetrip-danger);
                color: white;
            }
            
            .btn-cashetrip-danger:hover {
                background-color: #b91c1c;
                border-color: #b91c1c;
                color: white;
            }
            
            .btn-cashetrip-warning {
                background-color: var(--cashetrip-warning);
                border-color: var(--cashetrip-warning);
                color: white;
            }
            
            .btn-cashetrip-warning:hover {
                background-color: #c2410c;
                border-color: #c2410c;
                color: white;
            }
            
            .btn-cashetrip-info {
                background-color: var(--cashetrip-info);
                border-color: var(--cashetrip-info);
                color: white;
            }
            
            .btn-cashetrip-info:hover {
                background-color: #0369a1;
                border-color: #0369a1;
                color: white;
            }
            
            /* CasheTrip Badge Styles */
            .bg-cashetrip-primary {
                background-color: var(--cashetrip-primary) !important;
            }
            
            .bg-cashetrip-secondary {
                background-color: var(--cashetrip-secondary) !important;
            }
            
            .bg-cashetrip-success {
                background-color: var(--cashetrip-success) !important;
            }
            
            .bg-cashetrip-danger {
                background-color: var(--cashetrip-danger) !important;
            }
            
            .bg-cashetrip-warning {
                background-color: var(--cashetrip-warning) !important;
            }
            
            .bg-cashetrip-info {
                background-color: var(--cashetrip-info) !important;
            }
            
            /* CasheTrip Text Colors */
            .text-cashetrip-primary {
                color: var(--cashetrip-primary) !important;
            }
            
            .text-cashetrip-secondary {
                color: var(--cashetrip-secondary) !important;
            }
            
            .text-cashetrip-success {
                color: var(--cashetrip-success) !important;
            }
            
            .text-cashetrip-danger {
                color: var(--cashetrip-danger) !important;
            }
            
            .text-cashetrip-warning {
                color: var(--cashetrip-warning) !important;
            }
            
            .text-cashetrip-info {
                color: var(--cashetrip-info) !important;
            }
            
            .btn-enhanced {
                transition: all 0.3s ease;
                font-weight: 500;
            }
            
            .btn-enhanced:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }
            
            .enhanced-table {
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }
            
            .enhanced-table thead th {
                background: linear-gradient(135deg, var(--cashetrip-dark) 0%, var(--cashetrip-secondary) 100%);
                color: white;
                border: none;
                font-weight: 600;
                padding: 1rem;
            }
            
            .enhanced-table tbody td {
                padding: 0.8rem;
                border-color: #e2e8f0;
                vertical-align: middle;
            }
            
            .enhanced-table tbody tr:hover {
                background-color: var(--cashetrip-light);
            }
            
            .order-header {
                background: linear-gradient(135deg, var(--cashetrip-light) 0%, #e2e8f0 100%);
                border-radius: 12px;
                padding: 1.5rem;
                margin-bottom: 1.5rem;
            }
            
            .info-card {
                display: flex;
                align-items: center;
                padding: 1rem;
                background: white;
                border-radius: 8px;
                margin-bottom: 1rem;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            
            .info-card i {
                font-size: 1.5rem;
                margin-right: 1rem;
                width: 30px;
                text-align: center;
            }
            
            .info-card .label {
                font-size: 0.8rem;
                color: var(--cashetrip-secondary);
                font-weight: 500;
            }
            
            .info-card .value {
                font-size: 1rem;
                font-weight: 600;
                color: var(--cashetrip-dark);
            }
            
            .section-header {
                border-bottom: 2px solid #e2e8f0;
                padding-bottom: 0.5rem;
                margin-bottom: 1rem;
            }
            
            .section-header h5 {
                color: var(--cashetrip-dark);
                font-weight: 700;
                margin: 0;
            }
            
            .invoice-cart-container,
            .invoice-history-container {
                background: var(--cashetrip-light);
                border-radius: 12px;
                padding: 1.5rem;
                border: 1px solid #e2e8f0;
            }
            
            .invoice-preview-header {
                background: linear-gradient(135deg, var(--cashetrip-light) 0%, #e2e8f0 100%);
                border-radius: 12px;
                padding: 1.5rem;
                margin-bottom: 1.5rem;
            }
            
            .invoice-info-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem;
                margin-bottom: 1.5rem;
            }
            
            .info-item {
                display: flex;
                align-items: center;
                padding: 1rem;
                background: white;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            
            .info-item i {
                font-size: 1.5rem;
                margin-right: 1rem;
                width: 30px;
                text-align: center;
            }
            
            .info-item .label {
                font-size: 0.8rem;
                color: var(--cashetrip-secondary);
                font-weight: 500;
            }
            
            .info-item .value {
                font-size: 1rem;
                font-weight: 600;
                color: var(--cashetrip-dark);
            }
            
            .quantity-display {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .loading-placeholder {
                text-align: center;
                padding: 2rem;
                color: var(--cashetrip-secondary);
            }
            
            /* Modal Enhancements */
            .modal-header {
                background: linear-gradient(135deg, var(--cashetrip-primary) 0%, var(--cashetrip-primary-hover) 100%);
                color: white;
                border-bottom: none;
            }
            
            .modal-header .btn-close {
                filter: invert(1);
            }
            
            .modal-footer {
                border-top: 1px solid #e2e8f0;
                background-color: var(--cashetrip-light);
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideIn {
                from { transform: translateX(-20px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
            
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        </style>
    `

    $("head").append(styles)
}

function getStatusBadge(status) {
    const statusMap = {
        Pending: "bg-cashetrip-warning",
        Completed: "bg-cashetrip-success",
        Cancelled: "bg-cashetrip-danger",
        Processing: "bg-cashetrip-info",
        Shipped: "bg-cashetrip-primary",
    }

    const badgeClass = statusMap[status] || "bg-cashetrip-secondary"
    return `<span class="badge ${badgeClass}">${status}</span>`
}

function formatDate(dateString) {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    })
}

function showAlert(message, type = "info", duration = 5000) {
    const alertId = "alert-" + Date.now()
    const alertClass =
        type === "success"
            ? "alert-success"
            : type === "warning"
                ? "alert-warning"
                : type === "danger"
                    ? "alert-danger"
                    : type === "info"
                        ? "alert-info"
                        : "alert-primary"

    const icon =
        type === "success"
            ? "fas fa-check-circle"
            : type === "warning"
                ? "fas fa-exclamation-triangle"
                : type === "danger"
                    ? "fas fa-exclamation-circle"
                    : type === "info"
                        ? "fas fa-info-circle"
                        : "fas fa-bell"

    const alertHtml = `
        <div id="${alertId}" class="alert ${alertClass} alert-dismissible fade show animate-slide-in" 
             style="position: fixed; top: 20px; right: 20px; z-index: 9999; min-width: 300px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); border-radius: 12px;">
            <div class="d-flex align-items-center">
                <i class="${icon} me-2"></i>
                <div class="flex-grow-1">${message}</div>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        </div>
    `

    $("body").append(alertHtml)

    // Auto-dismiss after duration
    setTimeout(() => {
        $(`#${alertId}`).alert("close")
    }, duration)
}

function showLoadingOverlay(message = "Loading...") {
    const overlayHtml = `
        <div id="loadingOverlay" class="loading-overlay">
            <div class="loading-content">
                <div class="loading-spinner-large"></div>
                <div class="loading-text" style="font-size: 1.2rem; font-weight: 500;">${message}</div>
            </div>
        </div>
    `

    $("body").append(overlayHtml)
}

function hideLoadingOverlay() {
    $("#loadingOverlay").fadeOut(300, function () {
        $(this).remove()
    })
}

function showLoadingState(selector, message) {
    $(selector).html(`
        <tr>
            <td colspan="6" class="text-center py-4">
                <i class="fas fa-spinner fa-spin me-2"></i>
                ${message}
            </td>
        </tr>
    `)
}
