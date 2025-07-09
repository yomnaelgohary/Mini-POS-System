var selectedCustomer = null
var selectedProduct = null
let orderProducts = []
const $ = window.$ // Declare the $ variable
const bootstrap = window.bootstrap // Declare the bootstrap variable

function searchCustomer1() {
    var name = $("#searchName").val()
    var mobile = $("#searchMobile").val()

    if (!name && !mobile) {
        alert("Please enter either customer name or mobile number to search.")
        return
    }

    $.post("/SalesOrder/FindCustomer", { name: name, mobile: mobile }, (customer) => {
        var modal = new bootstrap.Modal(document.getElementById("searchCustomerModal"))
        modal.show()

        if (customer) {
            selectedCustomer = customer
            $("#customerFoundAlert").show()
            $("#customerNotFoundAlert").hide()
            $("#foundCustomerName").text(customer.costumerName)
            $("#foundCustomerMobile").text(customer.costumerContactInfo)
            $("#foundCustomerId").text(customer.costumerId)
            $("#selectCustomerBtn").removeClass("d-none")
            $("#addCustomerSection").addClass("d-none")
        } else {
            $("#customerFoundAlert").hide()
            $("#customerNotFoundAlert").show()
            $("#selectCustomerBtn").addClass("d-none")
            $("#addCustomerSection").removeClass("d-none")
        }
    }).fail((xhr, status, error) => {
        console.error("Error occurred:", error)
        alert("Error occurred while searching for customer: " + error)
    })
}

function selectCustomer() {
    var modal = bootstrap.Modal.getInstance(document.getElementById("searchCustomerModal"))
    if (modal) {
        modal.hide()
    }

    $("#selectedCustomerInfo").removeClass("d-none")
    $("#selectedCustomerInfo").html(`
        <div class="d-flex align-items-center">
            <i class="bi bi-check-circle-fill me-2"></i>
            <div>
                <div class="fw-bold">Selected Customer: ${selectedCustomer.costumerName}</div>
                <div class="small mt-1">Mobile: ${selectedCustomer.costumerContactInfo} | ID: ${selectedCustomer.costumerId}</div>
            </div>
        </div>
    `)

    $("#searchName").val("")
    $("#searchMobile").val("")
}

function addCustomer() {
    var name = $("#newCustomerName").val()
    var mobile = $("#newCustomerMobile").val()

    if (!name || !mobile) {
        $("#addCustomerResult")
            .removeClass("d-none alert-success")
            .addClass("alert-danger")
            .html(`
                <div class="d-flex align-items-center">
                    <i class="bi bi-exclamation-triangle-fill me-2"></i>
                    <div>Please fill in both customer name and mobile number.</div>
                </div>
            `)
        return
    }

    $.post("/SalesOrder/AddCustomer", { name: name, mobile: mobile }, (response) => {
        if (response.success) {
            $("#addCustomerResult")
                .removeClass("d-none alert-danger")
                .addClass("alert-success")
                .text("Customer added successfully!")
            $("#newCustomerName").val("")
            $("#newCustomerMobile").val("")
        } else {
            $("#addCustomerResult")
                .removeClass("d-none alert-success")
                .addClass("alert-danger")
                .html(`
                    <div class="d-flex align-items-center">
                        <i class="bi bi-exclamation-triangle-fill me-2"></i>
                        <div>Error: ${response.message}</div>
                    </div>
                `)
        }
    })
}

function searchProduct() {
    var id = $("#searchProduct").val()
    $.post("/SalesOrder/SearchProduct", { id: id }, (productresponse) => {
        if (productresponse) {
            selectedProduct = productresponse
            $("#modalProductName").text(productresponse.description)
            $("#modalProductPrice").text(productresponse.sellingPrice + " EGP")
            $("#modalProductCode").text(productresponse.productCode)
            $("#modalProductQty").val(1)
            var modal = new bootstrap.Modal(document.getElementById("productModal"))
            modal.show()
        } else {
            alert("Product not found.")
        }
    })
}

function addProductToOrder(qty) {
    qty = Number.parseInt(qty)
    if (isNaN(qty) || qty <= 0) {
        alert("Please enter a valid quantity.")
        return
    }

    const product = {
        id: selectedProduct.productId,
        description: selectedProduct.description,
        code: selectedProduct.productCode,
        price: Number.parseFloat(selectedProduct.sellingPrice),
        quantity: qty,
        total: Number.parseFloat(selectedProduct.sellingPrice) * qty,
    }

    orderProducts.push(product)
    showintable()
    updateOrderTotal()

    const modal = bootstrap.Modal.getInstance(document.getElementById("productModal"))
    if (modal) modal.hide()
    $("#searchProduct").val("")
    $("#modalProductQty").val(1)
}

function showintable() {
    const tbody = $("#orderTable tbody")
    tbody.empty()

    if (orderProducts.length === 0) {
        tbody.append(`
            <tr id="emptyOrderRow">
                <td colspan="6" class="text-center text-muted py-5">
                    <i class="bi bi-cart-x display-6 d-block mb-2 text-muted"></i>
                    No products added yet. Search and add products to create your order.
                </td>
            </tr>
        `)
        return
    }

    let i = 0
    while (i < orderProducts.length) {
        const product = orderProducts[i]
        const row = `
            <tr>
                <td>${product.description}</td>
                <td>${product.code}</td>
                <td>${product.price.toFixed(2)} EGP</td>
                <td>${product.quantity}</td>
                <td>${product.total.toFixed(2)} EGP</td>
                <td class="text-center">
                    <button class="btn btn-sm btn-danger" onclick="removeProduct(${i})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `
        tbody.append(row)
        i++
    }
}

function removeProduct(index) {
    orderProducts.splice(index, 1)
    showintable()
    updateOrderTotal()
}

function updateOrderTotal() {
    let total = 0
    for (let i = 0; i < orderProducts.length; i++) {
        total += orderProducts[i].total
    }
    $("#orderTotal").text(total.toFixed(2))
}

function resetOrder() {
    if (confirm("Are you sure you want to cancel this order? All data will be lost.")) {
        orderProducts = []
        selectedCustomer = null
        selectedProduct = null
        showintable()
        updateOrderTotal()
        $("#selectedCustomerInfo").addClass("d-none")
        $("#searchName").val("")
        $("#searchMobile").val("")
        $("#searchProduct").val("")
    }
}

function submitOrder() {
    if (selectedCustomer == null) {
        alert("Please select a customer first.")
        return
    }
    if (orderProducts.length === 0) {
        alert("No products in order.")
        return
    }

    var customerid = selectedCustomer.costumerId

    $.post("/SalesOrder/createSalesOrder", { customerid: customerid }, (response1) => {
        var selectedSalesOrderId = response1.salesOrderId

        var i = 0
        function sendNextProduct() {
            if (i < orderProducts.length) {
                var p = orderProducts[i]
                $.post(
                    "/SalesOrder/addToSalesItem",
                    {
                        orderId: selectedSalesOrderId,
                        productId: p.id,
                        productquantity: p.quantity,
                        totalprice: p.total, // Fixed: now passing total price instead of unit price
                    },
                    () => {
                        i++
                        sendNextProduct()
                    },
                )
            } else {
                alert("Order submitted successfully!")
                // Reset the form
                orderProducts = []
                selectedCustomer = null
                selectedProduct = null
                showintable()
                updateOrderTotal()
                $("#selectedCustomerInfo").addClass("d-none")
                $("#searchName").val("")
                $("#searchMobile").val("")
                $("#searchProduct").val("")
            }
        }
        sendNextProduct()
    })
}

// Initialize the page
$(document).ready(() => {
    showintable()
    updateOrderTotal()
})
