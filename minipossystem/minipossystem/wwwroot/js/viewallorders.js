// Import jQuery and Bootstrap
var $ = window.jQuery
var bootstrap = window.bootstrap

var currentOrderId = null
var orderItemsToUpdate = []
var currentInvoiceOrderId = null
var invoiceItems = []

function loadAllOrders() {
    $.post("/SalesOrder/GetAllSalesOrders", {}, (orders) => {
        displayOrders(orders)
    }).fail((xhr, status, error) => {
        console.error("Error loading orders:", error)
        alert("Error loading orders: " + error)
    })
}

function searchOrderById() {
    var orderId = $("#searchOrderId").val()
    if (!orderId) {
        alert("Please enter a Sales Order ID to search.")
        return
    }

    $.post("/SalesOrder/SearchSalesOrder", { orderId: Number.parseInt(orderId) }, (orders) => {
        if (orders && orders.length > 0) {
            displayOrders(orders)
        } else {
            displayOrders([])
        }
    }).fail((xhr, status, error) => {
        console.error("Error searching order:", error)
        alert("Error searching order: " + error)
    })
}

function displayOrders(orders) {
    const tbody = $("#ordersTable tbody")
    tbody.empty()

    if (!orders || orders.length === 0) {
        tbody.append(`
            <tr>
                <td colspan="6" class="text-center text-muted py-5">
                    <i class="bi bi-inbox display-6 d-block mb-2 text-muted"></i>
                    No orders found.
                </td>
            </tr>
        `)
        return
    }

    orders.forEach((order) => {
        const statusClass = order.status.toLowerCase() === "pending" ? "status-pending" : "status-completed"
        const row = `
            <tr>
                <td>${order.salesOrderId}</td>
                <td>${order.costumerId}</td>
                <td>${order.employeeId}</td>
                <td>${order.orderDate}</td>
                <td><span class="badge ${statusClass}">${order.status}</span></td>
                <td class="text-center">
                    <button class="btn btn-sm btn-primary me-1" onclick="editOrder(${order.salesOrderId})" title="Edit Order">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-danger me-1" onclick="deleteOrder(${order.salesOrderId})" title="Delete Order">
                        <i class="bi bi-trash"></i>
                    </button>
                    <button class="btn btn-sm btn-success" onclick="createInvoice(${order.salesOrderId})" title="Create Invoice">
                        <i class="bi bi-receipt"></i>
                    </button>
                </td>
            </tr>
        `
        tbody.append(row)
    })
}

function editOrder(orderId) {
    currentOrderId = orderId
    $.post("/SalesOrder/GetSalesOrderDetails", { orderId: orderId }, (orderDetails) => {
        if (orderDetails) {
            // Populate order information
            $("#editOrderId").text(orderDetails.salesOrderId)
            $("#editCustomerId").text(orderDetails.costumerId)
            $("#editOrderDate").text(orderDetails.orderDate)
            $("#editOrderStatus").text(orderDetails.status)

            // Populate order items
            const tbody = $("#editOrderItemsTable tbody")
            tbody.empty()
            orderItemsToUpdate = []

            if (orderDetails.items && orderDetails.items.length > 0) {
                orderDetails.items.forEach((item) => {
                    const row = `
                        <tr data-item-id="${item.salesOrderItemId}">
                            <td>${item.productDescription}</td>
                            <td>${item.productCode}</td>
                            <td>${item.unitPrice.toFixed(2)} EGP</td>
                            <td>
                                <input type="number" class="form-control quantity-input" 
                                       value="${item.quantity}" min="1" 
                                       data-item-id="${item.salesOrderItemId}"
                                       data-unit-price="${item.unitPrice}"
                                       onchange="updateItemTotal(this)">
                            </td>
                            <td class="item-total">${item.totalPrice.toFixed(2)} EGP</td>
                            <td class="text-center">
                                <button class="btn btn-sm btn-success" onclick="updateQuantity(${item.salesOrderItemId})" title="Update Quantity">
                                    <i class="bi bi-check"></i>
                                </button>
                            </td>
                        </tr>
                    `
                    tbody.append(row)
                })
            } else {
                tbody.append(`
                    <tr>
                        <td colspan="6" class="text-center text-muted py-3">
                            No items found for this order.
                        </td>
                    </tr>
                `)
            }

            // Show the modal
            var modal = new bootstrap.Modal(document.getElementById("editOrderModal"))
            modal.show()
        } else {
            alert("Order not found.")
        }
    }).fail((xhr, status, error) => {
        console.error("Error loading order details:", error)
        alert("Error loading order details: " + error)
    })
}

function updateItemTotal(input) {
    const quantity = Number.parseInt(input.value)
    const unitPrice = Number.parseFloat(input.getAttribute("data-unit-price"))
    const totalPrice = quantity * unitPrice

    const row = input.closest("tr")
    const totalCell = row.querySelector(".item-total")
    totalCell.textContent = totalPrice.toFixed(2) + " EGP"
}

function updateQuantity(itemId) {
    const row = $(`tr[data-item-id="${itemId}"]`)
    const quantityInput = row.find(".quantity-input")
    const newQuantity = Number.parseInt(quantityInput.val())
    const unitPrice = Number.parseFloat(quantityInput.attr("data-unit-price"))

    if (isNaN(newQuantity) || newQuantity <= 0) {
        alert("Please enter a valid quantity.")
        return
    }

    $.post(
        "/SalesOrder/UpdateOrderItemQuantity",
        {
            orderItemId: itemId,
            newQuantity: newQuantity,
            unitPrice: unitPrice,
        },
        (response) => {
            if (response.success) {
                // Update the total price display
                const totalPrice = newQuantity * unitPrice
                row.find(".item-total").text(totalPrice.toFixed(2) + " EGP")

                // Show success message
                alert("Quantity updated successfully!")
            } else {
                alert("Error updating quantity: " + response.message)
            }
        },
    ).fail((xhr, status, error) => {
        console.error("Error updating quantity:", error)
        alert("Error updating quantity: " + error)
    })
}

function saveOrderChanges() {
    alert("All changes have been saved individually. You can close this window.")
    var modal = bootstrap.Modal.getInstance(document.getElementById("editOrderModal"))
    if (modal) {
        modal.hide()
    }
    // Refresh the orders list
    loadAllOrders()
}

function deleteOrder(orderId) {
    currentOrderId = orderId
    $("#deleteOrderId").text(orderId)
    var modal = new bootstrap.Modal(document.getElementById("deleteConfirmModal"))
    modal.show()
}

function confirmDeleteOrder() {
    $.post("/SalesOrder/DeleteSalesOrder", { orderId: currentOrderId }, (response) => {
        if (response.success) {
            alert("Sales order deleted successfully!")
            var modal = bootstrap.Modal.getInstance(document.getElementById("deleteConfirmModal"))
            if (modal) {
                modal.hide()
            }
            // Refresh the orders list
            loadAllOrders()
        } else {
            alert("Error deleting order: " + response.message)
        }
    }).fail((xhr, status, error) => {
        console.error("Error deleting order:", error)
        alert("Error deleting order: " + error)
    })
}

function createInvoice(orderId) {
    currentInvoiceOrderId = orderId
    $.post("/SalesOrder/GetSalesOrderForInvoice", { orderId: orderId }, (orderDetails) => {
        if (orderDetails) {
            // Populate order information
            $("#invoiceOrderId").text(orderDetails.salesOrderId)
            $("#invoiceCustomerName").text(orderDetails.customerName)
            $("#invoiceCustomerContact").text(orderDetails.customerContact)
            $("#invoiceOrderDate").text(orderDetails.orderDate)

            // Populate order items for invoice selection
            const tbody = $("#invoiceItemsTable tbody")
            tbody.empty()
            invoiceItems = []

            if (orderDetails.items && orderDetails.items.length > 0) {
                orderDetails.items.forEach((item) => {
                    const row = `
                        <tr data-item-id="${item.salesOrderItemId}">
                            <td>
                                <input type="checkbox" class="invoice-item-checkbox" 
                                       data-item-id="${item.salesOrderItemId}"
                                       data-unit-price="${item.unitPrice}"
                                       data-max-qty="${item.quantity}"
                                       onchange="updateInvoiceItemSelection(this)">
                            </td>
                            <td>${item.productDescription}</td>
                            <td>${item.productCode}</td>
                            <td>${item.unitPrice.toFixed(2)} EGP</td>
                            <td>${item.quantity}</td>
                            <td>
                                <input type="number" class="form-control invoice-qty-input" 
                                       value="0" min="0" max="${item.quantity}"
                                       data-item-id="${item.salesOrderItemId}"
                                       onchange="updateInvoiceQuantity(this)" disabled>
                            </td>
                            <td class="invoice-item-total">0.00 EGP</td>
                        </tr>
                    `
                    tbody.append(row)
                })
            } else {
                tbody.append(`
                    <tr>
                        <td colspan="7" class="text-center text-muted py-3">
                            No items found for this order.
                        </td>
                    </tr>
                `)
            }

            // Show the modal
            var modal = new bootstrap.Modal(document.getElementById("createInvoiceModal"))
            modal.show()
        } else {
            alert("Order not found.")
        }
    }).fail((xhr, status, error) => {
        console.error("Error loading order details:", error)
        alert("Error loading order details: " + error)
    })
}

function toggleAllInvoiceItems() {
    const selectAll = $("#selectAllInvoiceItems").is(":checked")
    $(".invoice-item-checkbox").each(function () {
        $(this).prop("checked", selectAll)
        updateInvoiceItemSelection(this)
    })
}

function updateInvoiceItemSelection(checkbox) {
    const itemId = $(checkbox).data("item-id")
    const maxQty = $(checkbox).data("max-qty")
    const qtyInput = $(`.invoice-qty-input[data-item-id="${itemId}"]`)

    if ($(checkbox).is(":checked")) {
        qtyInput.prop("disabled", false)
        qtyInput.val(maxQty)
        updateInvoiceQuantity(qtyInput[0])
    } else {
        qtyInput.prop("disabled", true)
        qtyInput.val(0)
        updateInvoiceQuantity(qtyInput[0])
    }
}

function updateInvoiceQuantity(input) {
    const itemId = $(input).data("item-id")
    const quantity = Number.parseInt($(input).val()) || 0
    const checkbox = $(`.invoice-item-checkbox[data-item-id="${itemId}"]`)
    const unitPrice = Number.parseFloat(checkbox.data("unit-price"))
    const totalPrice = quantity * unitPrice

    const row = $(input).closest("tr")
    const totalCell = row.find(".invoice-item-total")
    totalCell.text(totalPrice.toFixed(2) + " EGP")

    updateInvoiceTotal()
}

function updateInvoiceTotal() {
    let total = 0
    $(".invoice-item-total").each(function () {
        const text = $(this).text().replace(" EGP", "")
        const amount = Number.parseFloat(text) || 0
        total += amount
    })
    $("#invoiceTotal").text(total.toFixed(2) + " EGP")
}

function submitInvoice() {
    // Collect selected items
    const selectedItems = []
    let totalAmount = 0

    $(".invoice-item-checkbox:checked").each(function () {
        const itemId = $(this).data("item-id")
        const unitPrice = Number.parseFloat($(this).data("unit-price"))
        const qtyInput = $(`.invoice-qty-input[data-item-id="${itemId}"]`)
        const quantity = Number.parseInt(qtyInput.val()) || 0

        if (quantity > 0) {
            const itemTotal = unitPrice * quantity
            selectedItems.push({
                orderItemId: itemId,
                quantity: quantity,
                totalPrice: itemTotal,
            })
            totalAmount += itemTotal
        }
    })

    if (selectedItems.length === 0) {
        alert("Please select at least one item with quantity greater than 0.")
        return
    }

    // Create the invoice
    $.post(
        "/SalesOrder/CreateSalesInvoice",
        {
            salesOrderId: currentInvoiceOrderId,
            totalAmount: totalAmount,
        },
        (response) => {
            if (response.success) {
                const invoiceId = response.invoiceId

                // Add items to invoice
                let itemIndex = 0
                function addNextItem() {
                    if (itemIndex < selectedItems.length) {
                        const item = selectedItems[itemIndex]
                        $.post(
                            "/SalesOrder/AddToSalesInvoiceItem",
                            {
                                invoiceId: invoiceId,
                                orderItemId: item.orderItemId,
                                quantity: item.quantity,
                                totalPrice: item.totalPrice,
                            },
                            () => {
                                itemIndex++
                                addNextItem()
                            },
                        )
                    } else {
                        alert("Invoice created successfully! Invoice ID: " + invoiceId)
                        var modal = bootstrap.Modal.getInstance(document.getElementById("createInvoiceModal"))
                        if (modal) {
                            modal.hide()
                        }
                        // Refresh the orders list
                        loadAllOrders()
                    }
                }
                addNextItem()
            } else {
                alert("Error creating invoice: " + response.message)
            }
        },
    ).fail((xhr, status, error) => {
        console.error("Error creating invoice:", error)
        alert("Error creating invoice: " + error)
    })
}

// Initialize the page
$(document).ready(() => {
    loadAllOrders()
})
