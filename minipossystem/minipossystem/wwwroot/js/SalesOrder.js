// Declare the $ variable and bootstrap variable before using them
var $ = window.jQuery;
var bootstrap = window.bootstrap;

var selectedCustomer = null;
var selectedProduct = null;
let orderProducts = [];

// Enhanced search customer function with better UI feedback
function searchCustomer1() {
    var name = $("#searchName").val().trim();
    var mobile = $("#searchMobile").val().trim();

    if (!name && !mobile) {
        showAlert("Please enter either customer name or mobile number to search.", "warning");
        return;
    }

    // Show loading state
    const searchBtn = $("button[onclick='searchCustomer1()']");
    const originalText = searchBtn.html();
    searchBtn.html('<span class="loading-spinner"></span> Searching...').prop('disabled', true);

    $.post("/SalesOrder/FindCustomer", { name: name, mobile: mobile }, function (customer) {
        var modal = new bootstrap.Modal(document.getElementById('searchCustomerModal'));
        modal.show();

        if (customer) {
            selectedCustomer = customer;
            $("#customerFoundAlert").show().addClass('animate-fade-in');
            $("#customerNotFoundAlert").hide();
            $("#foundCustomerName").text(customer.costumerName);
            $("#foundCustomerMobile").text(customer.costumerContactInfo);
            $("#foundCustomerId").text(customer.costumerId);
            $("#selectCustomerBtn").removeClass("d-none").addClass('animate-slide-up');
            $("#addCustomerSection").addClass("d-none");
        } else {
            $("#customerFoundAlert").hide();
            $("#customerNotFoundAlert").show().addClass('animate-fade-in');
            $("#selectCustomerBtn").addClass("d-none");
            $("#addCustomerSection").removeClass("d-none").addClass('animate-slide-up');
        }
    }).fail(function (xhr, status, error) {
        console.error("Error occurred:", error);
        showAlert("Error occurred while searching for customer: " + error, "danger");
    }).always(function () {
        // Restore button state
        searchBtn.html(originalText).prop('disabled', false);
    });
}

// Enhanced select customer function with better visual feedback
function selectCustomer() {
    var modal = bootstrap.Modal.getInstance(document.getElementById('searchCustomerModal'));
    if (modal) {
        modal.hide();
    }

    // Enhanced customer info display
    $("#selectedCustomerInfo").removeClass("d-none").addClass('animate-fade-in');
    $("#selectedCustomerInfo").html(`
        <div class="d-flex align-items-center">
            <div class="me-3">
                <i class="fas fa-user-check text-success" style="font-size: 2rem;"></i>
            </div>
            <div class="flex-grow-1">
                <div class="fw-bold fs-5 text-success">Selected Customer: ${selectedCustomer.costumerName}</div>
                <div class="small mt-1 text-muted">
                    <i class="fas fa-phone me-1"></i>Mobile: ${selectedCustomer.costumerContactInfo} | 
                    <i class="fas fa-id-card me-1"></i>ID: ${selectedCustomer.costumerId}
                </div>
            </div>
            <div>
                <button class="btn btn-outline-secondary btn-sm" onclick="clearSelectedCustomer()">
                    <i class="fas fa-times"></i> Change
                </button>
            </div>
        </div>
    `);

    // Clear search fields with animation
    $("#searchName").val("").addClass('animate-pulse');
    $("#searchMobile").val("").addClass('animate-pulse');

    setTimeout(() => {
        $("#searchName, #searchMobile").removeClass('animate-pulse');
    }, 1000);

    showAlert("Customer selected successfully!", "success", 3000);
}

// New function to clear selected customer
function clearSelectedCustomer() {
    selectedCustomer = null;
    $("#selectedCustomerInfo").addClass("d-none").removeClass('animate-fade-in');
    $("#searchName").focus();
}

// Enhanced add customer function with better validation and feedback
function addCustomer() {
    var name = $("#newCustomerName").val().trim();
    var mobile = $("#newCustomerMobile").val().trim();

    if (!name || !mobile) {
        $("#addCustomerResult")
            .removeClass("d-none alert-success")
            .addClass("alert-danger animate-shake")
            .html(`
                <div class="d-flex align-items-center">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    <div>Please fill in both customer name and mobile number.</div>
                </div>
            `);

        // Remove shake animation after it completes
        setTimeout(() => {
            $("#addCustomerResult").removeClass('animate-shake');
        }, 600);
        return;
    }

    // Show loading state
    const addBtn = $("button[onclick='addCustomer()']");
    const originalText = addBtn.html();
    addBtn.html('<span class="loading-spinner"></span> Adding Customer...').prop('disabled', true);

    $.post("/SalesOrder/AddCustomer", { name: name, mobile: mobile }, function (response) {
        if (response.success) {
            $("#addCustomerResult")
                .removeClass("d-none alert-danger")
                .addClass("alert-success animate-fade-in")
                .html(`
                    <div class="d-flex align-items-center">
                        <i class="fas fa-check-circle me-2"></i>
                        <div>Customer added successfully!</div>
                    </div>
                `);

            // Clear form fields with success animation
            $("#newCustomerName, #newCustomerMobile").val("").addClass('animate-success');
            setTimeout(() => {
                $("#newCustomerName, #newCustomerMobile").removeClass('animate-success');
            }, 1000);
        } else {
            $("#addCustomerResult")
                .removeClass("d-none alert-success")
                .addClass("alert-danger animate-shake")
                .html(`
                    <div class="d-flex align-items-center">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        <div>Error: ${response.message}</div>
                    </div>
                `);
        }
    }).fail(function (xhr, status, error) {
        $("#addCustomerResult")
            .removeClass("d-none alert-success")
            .addClass("alert-danger animate-shake")
            .html(`
                <div class="d-flex align-items-center">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    <div>Network error occurred. Please try again.</div>
                </div>
            `);
    }).always(function () {
        // Restore button state
        addBtn.html(originalText).prop('disabled', false);
    });
}

// Enhanced search product function with better feedback
function searchProduct() {
    var id = $("#searchProduct").val().trim();

    if (!id) {
        showAlert("Please enter a Product ID or scan barcode.", "warning");
        $("#searchProduct").focus().addClass('animate-shake');
        setTimeout(() => {
            $("#searchProduct").removeClass('animate-shake');
        }, 600);
        return;
    }

    // Show loading state
    const searchBtn = $("button[onclick='searchProduct()']");
    const originalText = searchBtn.html();
    searchBtn.html('<span class="loading-spinner"></span> Searching...').prop('disabled', true);

    $.post("/SalesOrder/SearchProduct", { id: id }, function (productresponse) {
        if (productresponse) {
            selectedProduct = productresponse;

            // Enhanced modal content
            $("#modalProductName").text(productresponse.description);
            $("#modalProductPrice").html(`${productresponse.sellingPrice} <span class="text-muted">EGP</span>`);
            $("#modalProductCode").text(productresponse.productCode);
            $("#modalProductQty").val(1).focus();

            var modal = new bootstrap.Modal(document.getElementById('productModal'));
            modal.show();

            // Clear search field
            $("#searchProduct").val("").addClass('animate-success');
            setTimeout(() => {
                $("#searchProduct").removeClass('animate-success');
            }, 1000);
        } else {
            showAlert("Product not found. Please check the Product ID and try again.", "danger");
            $("#searchProduct").focus().select().addClass('animate-shake');
            setTimeout(() => {
                $("#searchProduct").removeClass('animate-shake');
            }, 600);
        }
    }).fail(function (xhr, status, error) {
        showAlert("Error occurred while searching for product: " + error, "danger");
    }).always(function () {
        // Restore button state
        searchBtn.html(originalText).prop('disabled', false);
    });
}

// Enhanced add product to order function with better validation
function addProductToOrder(qty) {
    qty = parseInt(qty);

    if (isNaN(qty) || qty <= 0) {
        showAlert("Please enter a valid quantity (must be greater than 0).", "warning");
        $("#modalProductQty").focus().select().addClass('animate-shake');
        setTimeout(() => {
            $("#modalProductQty").removeClass('animate-shake');
        }, 600);
        return;
    }

    // Check if product already exists in order
    const existingProductIndex = orderProducts.findIndex(p => p.id === selectedProduct.productId);

    if (existingProductIndex !== -1) {
        // Update existing product quantity
        orderProducts[existingProductIndex].quantity += qty;
        showAlert(`Updated quantity for ${selectedProduct.description}`, "info", 3000);
    } else {
        // Add new product
        let product = {
            id: selectedProduct.productId,
            description: selectedProduct.description,
            code: selectedProduct.productCode,
            price: parseFloat(selectedProduct.sellingPrice),
            quantity: qty,
        };
        orderProducts.push(product);
        showAlert(`Added ${selectedProduct.description} to order`, "success", 3000);
    }

    showintable();

    // Close modal with animation
    var modal = bootstrap.Modal.getInstance(document.getElementById('productModal'));
    if (modal) {
        modal.hide();
    }

    // Focus back to product search
    $("#searchProduct").focus();
}

// Enhanced table display function with better styling and animations
function showintable() {
    const tbody = $("#orderTable tbody");
    tbody.empty();

    if (orderProducts.length === 0) {
        tbody.html(`
            <tr id="emptyOrderRow" class="animate-fade-in">
                <td colspan="6" class="empty-state">
                    <i class="fas fa-shopping-cart"></i>
                    <div class="fw-bold">No products added yet</div>
                    <div class="small">Search and add products to create your order</div>
                </td>
            </tr>
        `);
        updateOrderTotal();
        return;
    }

    let totalAmount = 0;

    orderProducts.forEach((product, index) => {
        const itemTotal = product.price * product.quantity;
        totalAmount += itemTotal;

        const row = `
            <tr class="animate-slide-in" style="animation-delay: ${index * 0.1}s">
                <td>
                    <div class="fw-semibold">${product.description}</div>
                </td>
                <td>
                    <span class="badge bg-secondary">${product.code}</span>
                </td>
                <td>
                    <span class="fw-semibold text-success">${product.price.toFixed(2)} EGP</span>
                </td>
                <td>
                    <div class="d-flex align-items-center">
                        <button class="btn btn-outline-secondary btn-sm me-2" onclick="updateQuantity(${index}, -1)">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="fw-bold mx-2">${product.quantity}</span>
                        <button class="btn btn-outline-secondary btn-sm ms-2" onclick="updateQuantity(${index}, 1)">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </td>
                <td>
                    <span class="fw-bold text-primary">${itemTotal.toFixed(2)} EGP</span>
                </td>
                <td class="text-center">
                    <button class="btn btn-sm btn-outline-danger" onclick="removeProduct(${index})" title="Remove item">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        tbody.append(row);
    });

    updateOrderTotal();
}

// New function to update quantity with +/- buttons
function updateQuantity(index, change) {
    if (orderProducts[index]) {
        orderProducts[index].quantity += change;

        if (orderProducts[index].quantity <= 0) {
            removeProduct(index);
        } else {
            showintable();
        }
    }
}

// Enhanced remove product function
function removeProduct(index) {
    if (confirm(`Are you sure you want to remove "${orderProducts[index].description}" from the order?`)) {
        const removedProduct = orderProducts[index].description;
        orderProducts.splice(index, 1);
        showintable();
        showAlert(`Removed ${removedProduct} from order`, "info", 3000);
    }
}

// New function to update order total with animation
function updateOrderTotal() {
    const total = orderProducts.reduce((sum, product) => sum + (product.price * product.quantity), 0);
    const totalElement = $("#orderTotal");

    // Animate total change
    totalElement.addClass('animate-pulse');
    setTimeout(() => {
        totalElement.text(total.toFixed(2)).removeClass('animate-pulse');
    }, 300);
}

// Enhanced submit order function with better validation and feedback
function submitOrder() {
    if (selectedCustomer == null) {
        showAlert("Please select a customer before submitting the order.", "warning");
        $("#searchName").focus();
        return;
    }

    if (orderProducts.length === 0) {
        showAlert("Please add at least one product to the order.", "warning");
        $("#searchProduct").focus();
        return;
    }

    // Show loading overlay
    showLoadingOverlay("Creating order...");

    let CustomerId = selectedCustomer.costumerId;

    $.post("/SalesOrder/CreateNewOrder", { CustomerId: CustomerId }, function (response) {
        if (response.success) {
            let newOrderId = response.orderId;
            let data = {
                orderId: newOrderId,
                products: orderProducts
            };

            updateLoadingOverlay("Adding products to order...");

            $.ajax({
                type: "POST",
                url: "/SalesOrder/AddItemsToOrder",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (result) {
                    if (result.success) {
                        hideLoadingOverlay();
                        resetOrderForm();

                        // Show success modal with enhanced styling
                        let modal = new bootstrap.Modal(document.getElementById('orderSuccessModal'));
                        modal.show();

                        showAlert("Order submitted successfully!", "success", 5000);
                    } else {
                        hideLoadingOverlay();
                        showAlert("Error adding products to order: " + (result.message || "Unknown error"), "danger");
                    }
                },
                error: function (xhr, status, error) {
                    hideLoadingOverlay();
                    showAlert("Error occurred while adding products: " + error, "danger");
                }
            });
        } else {
            hideLoadingOverlay();
            showAlert("Error creating order: " + (response.message || "Unknown error"), "danger");
        }
    }).fail(function (xhr, status, error) {
        hideLoadingOverlay();
        showAlert("Network error occurred: " + error, "danger");
    });
}

// New function to reset order form
function resetOrderForm() {
    orderProducts = [];
    showintable();
    selectedProduct = null;
    selectedCustomer = null;
    $("#selectedCustomerInfo").addClass("d-none").html("");
    $("#searchName").val("");
    $("#searchMobile").val("");
    $("#searchProduct").val("");
    $("#modalProductQty").val("");
    $("#customerFoundAlert").hide();
    $("#customerNotFoundAlert").hide();
    $("#addCustomerResult").addClass("d-none").text("");
}

// New function to reset order (for cancel button)
function resetOrder() {
    if (orderProducts.length > 0 || selectedCustomer) {
        if (confirm("Are you sure you want to cancel this order? All data will be lost.")) {
            resetOrderForm();
            showAlert("Order cancelled successfully.", "info", 3000);
        }
    } else {
        showAlert("No order to cancel.", "info", 2000);
    }
}

// Utility function to show alerts with better styling
function showAlert(message, type = "info", duration = 5000) {
    const alertId = 'alert-' + Date.now();
    const alertClass = type === "success" ? "alert-success" :
        type === "warning" ? "alert-warning" :
            type === "danger" ? "alert-danger" :
                type === "info" ? "alert-info" : "alert-primary";

    const icon = type === "success" ? "fas fa-check-circle" :
        type === "warning" ? "fas fa-exclamation-triangle" :
            type === "danger" ? "fas fa-exclamation-circle" :
                type === "info" ? "fas fa-info-circle" : "fas fa-bell";

    const alertHtml = `
        <div id="${alertId}" class="alert ${alertClass} alert-dismissible fade show animate-slide-down" 
             style="position: fixed; top: 20px; right: 20px; z-index: 9999; min-width: 300px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
            <div class="d-flex align-items-center">
                <i class="${icon} me-2"></i>
                <div class="flex-grow-1">${message}</div>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        </div>
    `;

    $('body').append(alertHtml);

    // Auto-dismiss after duration
    setTimeout(() => {
        $(`#${alertId}`).alert('close');
    }, duration);
}

// Loading overlay functions
function showLoadingOverlay(message = "Loading...") {
    const overlayHtml = `
        <div id="loadingOverlay" class="loading-overlay">
            <div class="loading-content">
                <div class="loading-spinner-large"></div>
                <div class="loading-text">${message}</div>
            </div>
        </div>
    `;

    $('body').append(overlayHtml);
}

function updateLoadingOverlay(message) {
    $('#loadingOverlay .loading-text').text(message);
}

function hideLoadingOverlay() {
    $('#loadingOverlay').fadeOut(300, function () {
        $(this).remove();
    });
}

// Add CSS animations and loading overlay styles
$(document).ready(function () {
    const styles = `
        <style>
            .animate-fade-in {
                animation: fadeIn 0.5s ease-in-out;
            }
            
            .animate-slide-up {
                animation: slideUp 0.5s ease-out;
            }
            
            .animate-slide-in {
                animation: slideIn 0.5s ease-out;
            }
            
            .animate-slide-down {
                animation: slideDown 0.3s ease-out;
            }
            
            .animate-shake {
                animation: shake 0.6s ease-in-out;
            }
            
            .animate-pulse {
                animation: pulse 0.6s ease-in-out;
            }
            
            .animate-success {
                animation: successPulse 1s ease-in-out;
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
            
            .loading-text {
                font-size: 1.2rem;
                font-weight: 500;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideUp {
                from { transform: translateY(20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            
            @keyframes slideIn {
                from { transform: translateX(-20px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes slideDown {
                from { transform: translateY(-20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
            
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
            
            @keyframes successPulse {
                0%, 100% { border-color: #e2e8f0; }
                50% { border-color: #10b981; }
            }
            
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        </style>
    `;

    $('head').append(styles);

    // Initialize tooltips if Bootstrap is available
    if (typeof bootstrap !== 'undefined') {
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }

    // Add keyboard shortcuts
    $(document).keydown(function (e) {
        // Ctrl/Cmd + Enter to submit order
        if ((e.ctrlKey || e.metaKey) && e.keyCode === 13) {
            e.preventDefault();
            submitOrder();
        }

        // Escape to close modals
        if (e.keyCode === 27) {
            $('.modal').modal('hide');
        }
    });

    // Auto-focus on product search when customer is selected
    $(document).on('shown.bs.modal', '#searchCustomerModal', function () {
        $('#newCustomerName').focus();
    });

    $(document).on('shown.bs.modal', '#productModal', function () {
        $('#modalProductQty').focus().select();
    });
});