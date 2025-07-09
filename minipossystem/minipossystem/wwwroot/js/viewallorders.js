var currentOrderId = null
var orderItemsToUpdate = []
var $ = window.$ // Declare the $ variable
var bootstrap = window.bootstrap // Declare the bootstrap variable

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
                    <button class="btn btn-sm btn-danger" onclick="deleteOrder(${order.salesOrderId})" title="Delete Order">
                        <i class="bi bi-trash"></i>
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

// Initialize the page
$(document).ready(() => {
    loadAllOrders()
})
