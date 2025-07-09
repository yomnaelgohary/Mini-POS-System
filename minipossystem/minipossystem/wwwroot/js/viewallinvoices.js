var currentCreditInvoiceId = null
var currentEditInvoiceId = null
var creditNoteItems = []
var $ = window.$
var bootstrap = window.bootstrap

function loadAllInvoices() {
    $.post("/SalesOrder/GetAllInvoicesWithStatus", {}, (invoices) => {
        displayInvoices(invoices)
    }).fail((xhr, status, error) => {
        console.error("Error loading invoices:", error)
        alert("Error loading invoices: " + error)
    })
}

function displayInvoices(invoices) {
    var tbody = $("#invoicesTable tbody")
    tbody.empty()

    if (!invoices || invoices.length === 0) {
        tbody.append(`
            <tr>
                <td colspan="8" class="text-center text-muted py-5">
                    <i class="bi bi-receipt display-6 d-block mb-2 text-muted"></i>
                    No invoices found.
                </td>
            </tr>
        `)
        return
    }

    invoices.forEach((invoice) => {
        var statusBadge = invoice.hasCreditNote
            ? '<span class="status-badge status-has-credit">Has Credit Note</span>'
            : '<span class="status-badge status-active">Active</span>'

        var actions = ""
        if (invoice.hasCreditNote) {
            actions += `<button class="btn btn-sm btn-primary me-1" onclick="editInvoice(${invoice.invoiceId})" title="Edit Invoice">
                            <i class="bi bi-pencil"></i>
                        </button>`
        }
        actions += `<button class="btn btn-sm btn-warning" onclick="createCreditNote(${invoice.invoiceId})" title="Create Credit Note">
                        <i class="bi bi-arrow-return-left"></i>
                    </button>`

        var row = `
            <tr>
                <td>${invoice.invoiceId}</td>
                <td>${invoice.salesOrderId}</td>
                <td>${invoice.customerName}</td>
                <td>${invoice.customerContact}</td>
                <td>${invoice.date}</td>
                <td class="fw-bold text-success">${invoice.totalPrice.toFixed(2)} EGP</td>
                <td>${statusBadge}</td>
                <td class="text-center">${actions}</td>
            </tr>
        `
        tbody.append(row)
    })
}

function editInvoice(invoiceId) {
    currentEditInvoiceId = invoiceId
    $.post("/SalesOrder/GetInvoiceDetailsForEdit", { invoiceId: invoiceId }, (invoiceDetails) => {
        if (invoiceDetails) {
            // Populate invoice information
            $("#editInvoiceId").text(invoiceDetails.invoiceId)
            $("#editOrderId").text(invoiceDetails.salesOrderId)
            $("#editCustomerName").text(invoiceDetails.customerName)
            $("#editInvoiceDate").text(invoiceDetails.date)

            // Populate invoice items for editing
            var tbody = $("#editInvoiceItemsTable tbody")
            tbody.empty()

            if (invoiceDetails.items && invoiceDetails.items.length > 0) {
                invoiceDetails.items.forEach((item) => {
                    var row = `
                        <tr data-item-id="${item.invoiceItemId}">
                            <td>${item.productDescription}</td>
                            <td>${item.productCode}</td>
                            <td>${item.unitPrice.toFixed(2)} EGP</td>
                            <td>${item.currentQuantity}</td>
                            <td>
                                <input type="number" class="form-control edit-qty-input" 
                                       value="${item.currentQuantity}" min="0" 
                                       data-item-id="${item.invoiceItemId}"
                                       data-unit-price="${item.unitPrice}"
                                       onchange="updateEditItemTotal(this)">
                            </td>
                            <td class="edit-item-total">${(item.unitPrice * item.currentQuantity).toFixed(2)} EGP</td>
                            <td class="text-center">
                                <button class="btn btn-sm btn-success" onclick="updateInvoiceItem(${item.invoiceItemId})" title="Update Item">
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
                        <td colspan="7" class="text-center text-muted py-3">
                            No items found for this invoice.
                        </td>
                    </tr>
                `)
            }

            updateEditInvoiceTotal()
            var modal = new bootstrap.Modal(document.getElementById("editInvoiceModal"))
            modal.show()
        } else {
            alert("Invoice not found.")
        }
    }).fail((xhr, status, error) => {
        console.error("Error loading invoice details:", error)
        alert("Error loading invoice details: " + error)
    })
}

function updateEditItemTotal(input) {
    var quantity = Number.parseInt(input.value) || 0
    var unitPrice = Number.parseFloat(input.getAttribute("data-unit-price"))
    var totalPrice = quantity * unitPrice

    var row = input.closest("tr")
    var totalCell = row.querySelector(".edit-item-total")
    totalCell.textContent = totalPrice.toFixed(2) + " EGP"

    updateEditInvoiceTotal()
}

function updateEditInvoiceTotal() {
    var total = 0
    $(".edit-item-total").each(function () {
        var text = $(this).text().replace(" EGP", "")
        var amount = Number.parseFloat(text) || 0
        total += amount
    })
    $("#editInvoiceTotal").text(total.toFixed(2) + " EGP")
}

function updateInvoiceItem(itemId) {
    var row = $(`tr[data-item-id="${itemId}"]`)
    var quantityInput = row.find(".edit-qty-input")
    var newQuantity = Number.parseInt(quantityInput.val()) || 0
    var unitPrice = Number.parseFloat(quantityInput.attr("data-unit-price"))

    $.post(
        "/SalesOrder/UpdateInvoiceItem",
        {
            invoiceItemId: itemId,
            newQuantity: newQuantity,
            unitPrice: unitPrice,
        },
        (response) => {
            if (response.success) {
                alert("Item updated successfully!")
                updateEditItemTotal(quantityInput[0])
            } else {
                alert("Error updating item: " + response.message)
            }
        },
    ).fail((xhr, status, error) => {
        console.error("Error updating item:", error)
        alert("Error updating item: " + error)
    })
}

function saveInvoiceChanges() {
    var newTotal = Number.parseFloat($("#editInvoiceTotal").text().replace(" EGP", ""))

    $.post(
        "/SalesOrder/UpdateInvoiceTotal",
        {
            invoiceId: currentEditInvoiceId,
            newTotal: newTotal,
        },
        (response) => {
            if (response.success) {
                alert("Invoice updated successfully!")
                var modal = bootstrap.Modal.getInstance(document.getElementById("editInvoiceModal"))
                if (modal) {
                    modal.hide()
                }
                loadAllInvoices()
            } else {
                alert("Error updating invoice: " + response.message)
            }
        },
    ).fail((xhr, status, error) => {
        console.error("Error updating invoice:", error)
        alert("Error updating invoice: " + error)
    })
}

function createCreditNote(invoiceId) {
    currentCreditInvoiceId = invoiceId
    $.post("/SalesOrder/GetInvoiceDetails", { invoiceId: invoiceId }, (invoiceDetails) => {
        if (invoiceDetails) {
            // Populate invoice information
            $("#creditInvoiceId").text(invoiceDetails.invoiceId)
            $("#creditCustomerName").text(invoiceDetails.customerName)
            $("#creditCustomerContact").text(invoiceDetails.customerContact)
            $("#creditInvoiceDate").text(invoiceDetails.date)

            // Populate invoice items for credit note selection
            var tbody = $("#creditNoteItemsTable tbody")
            tbody.empty()
            creditNoteItems = []

            if (invoiceDetails.items && invoiceDetails.items.length > 0) {
                invoiceDetails.items.forEach((item) => {
                    var row = `
                        <tr data-item-id="${item.invoiceItemId}">
                            <td>
                                <input type="checkbox" class="credit-item-checkbox" 
                                       data-item-id="${item.invoiceItemId}"
                                       data-unit-price="${item.unitPrice}"
                                       data-max-qty="${item.quantity}"
                                       onchange="updateCreditItemSelection(this)">
                            </td>
                            <td>${item.productDescription}</td>
                            <td>${item.productCode}</td>
                            <td>${item.unitPrice.toFixed(2)} EGP</td>
                            <td>${item.quantity}</td>
                            <td>
                                <input type="number" class="form-control credit-qty-input" 
                                       value="0" min="0" max="${item.quantity}"
                                       data-item-id="${item.invoiceItemId}"
                                       onchange="updateCreditQuantity(this)" disabled>
                            </td>
                            <td class="credit-item-total">0.00 EGP</td>
                        </tr>
                    `
                    tbody.append(row)
                })
            } else {
                tbody.append(`
                    <tr>
                        <td colspan="7" class="text-center text-muted py-3">
                            No items found for this invoice.
                        </td>
                    </tr>
                `)
            }

            var modal = new bootstrap.Modal(document.getElementById("createCreditNoteModal"))
            modal.show()
        } else {
            alert("Invoice not found.")
        }
    }).fail((xhr, status, error) => {
        console.error("Error loading invoice details:", error)
        alert("Error loading invoice details: " + error)
    })
}

function toggleAllCreditItems() {
    var selectAll = $("#selectAllCreditItems").is(":checked")
    $(".credit-item-checkbox").each(function () {
        $(this).prop("checked", selectAll)
        updateCreditItemSelection(this)
    })
}

function updateCreditItemSelection(checkbox) {
    var itemId = $(checkbox).data("item-id")
    var maxQty = $(checkbox).data("max-qty")
    var qtyInput = $(`.credit-qty-input[data-item-id="${itemId}"]`)

    if ($(checkbox).is(":checked")) {
        qtyInput.prop("disabled", false)
        qtyInput.val(maxQty)
        updateCreditQuantity(qtyInput[0])
    } else {
        qtyInput.prop("disabled", true)
        qtyInput.val(0)
        updateCreditQuantity(qtyInput[0])
    }
}

function updateCreditQuantity(input) {
    var itemId = $(input).data("item-id")
    var quantity = Number.parseInt($(input).val()) || 0
    var checkbox = $(`.credit-item-checkbox[data-item-id="${itemId}"]`)
    var unitPrice = Number.parseFloat(checkbox.data("unit-price"))
    var totalPrice = quantity * unitPrice

    var row = $(input).closest("tr")
    var totalCell = row.find(".credit-item-total")
    totalCell.text(totalPrice.toFixed(2) + " EGP")

    updateCreditNoteTotal()
}

function updateCreditNoteTotal() {
    var total = 0
    $(".credit-item-total").each(function () {
        var text = $(this).text().replace(" EGP", "")
        var amount = Number.parseFloat(text) || 0
        total += amount
    })
    $("#creditNoteTotal").text(total.toFixed(2) + " EGP")
}

function submitCreditNote() {
    // Collect selected items
    var selectedItems = []
    var totalAmount = 0

    $(".credit-item-checkbox:checked").each(function () {
        var itemId = $(this).data("item-id")
        var unitPrice = Number.parseFloat($(this).data("unit-price"))
        var qtyInput = $(`.credit-qty-input[data-item-id="${itemId}"]`)
        var quantity = Number.parseInt(qtyInput.val()) || 0

        if (quantity > 0) {
            var itemTotal = unitPrice * quantity
            selectedItems.push({
                invoiceItemId: itemId,
                quantity: quantity,
                totalPrice: itemTotal,
            })
            totalAmount += itemTotal
        }
    })

    if (selectedItems.length === 0) {
        alert("Please select at least one item with quantity greater than 0 for refund.")
        return
    }

    if (
        !confirm(
            `Are you sure you want to create a credit note for ${totalAmount.toFixed(2)} EGP? This will process a refund for the selected items.`,
        )
    ) {
        return
    }

    // Create the credit note
    $.post(
        "/SalesOrder/CreateCreditNote",
        {
            invoiceId: currentCreditInvoiceId,
            totalAmount: totalAmount,
        },
        (response) => {
            if (response.success) {
                var creditNoteId = response.creditNoteId

                // Add items to credit note
                var itemIndex = 0
                function addNextItem() {
                    if (itemIndex < selectedItems.length) {
                        var item = selectedItems[itemIndex]
                        $.post(
                            "/SalesOrder/AddToCreditNoteItem",
                            {
                                creditNoteId: creditNoteId,
                                invoiceItemId: item.invoiceItemId,
                                quantity: item.quantity,
                                totalPrice: item.totalPrice,
                            },
                            () => {
                                itemIndex++
                                addNextItem()
                            },
                        )
                    } else {
                        alert(
                            "Credit Note created successfully! Credit Note ID: " +
                            creditNoteId +
                            "\nRefund Amount: " +
                            totalAmount.toFixed(2) +
                            " EGP",
                        )
                        var modal = bootstrap.Modal.getInstance(document.getElementById("createCreditNoteModal"))
                        if (modal) {
                            modal.hide()
                        }
                        // Refresh the invoices list
                        loadAllInvoices()
                    }
                }
                addNextItem()
            } else {
                alert("Error creating credit note: " + response.message)
            }
        },
    ).fail((xhr, status, error) => {
        console.error("Error creating credit note:", error)
        alert("Error creating credit note: " + error)
    })
}

// Initialize the page
$(document).ready(() => {
    loadAllInvoices()
})
