
var selectedCustumer = null;
var selectedProduct = null;
let orderProducts = [];


function searchCustomer1() {
    var name = $("#searchName").val();
    var mobile = $("#searchMobile").val();

    if (!name && !mobile) {
        alert("Please enter either customer name or mobile number to search.");
        return;
    }
    $.post("/SalesOrder/FindCustomer", { name: name, mobile: mobile }, function (customer) {
        
        var modal = new bootstrap.Modal(document.getElementById('searchCustomerModal'));
        modal.show();

        if (customer) { 
            selectedCustomer = customer;
            $("#customerFoundAlert").show();
            $("#customerNotFoundAlert").hide();
            $("#foundCustomerName").text(customer.costumerName);
            $("#foundCustomerMobile").text(customer.costumerContactInfo);
            $("#foundCustomerId").text(customer.costumerId);
            $("#selectCustomerBtn").removeClass("d-none");
            $("#addCustomerSection").addClass("d-none");
        } else {
            $("#customerFoundAlert").hide();
            $("#customerNotFoundAlert").show();
            $("#selectCustomerBtn").addClass("d-none");
            $("#addCustomerSection").removeClass("d-none");
        }
    }).fail(function (xhr, status, error) {
        console.error("Error occurred:", error);
        alert("Error occurred while searching for customer: " + error);
    });
}
function selectCustomer() {
    var modal = bootstrap.Modal.getInstance(document.getElementById('searchCustomerModal'));
    if (modal) {
        modal.hide();
    }
    $("#selectedCustomerInfo").removeClass("d-none");
    $("#selectedCustomerInfo").html(`
            <div class="d-flex align-items-center">
                <i class="bi bi-check-circle-fill me-2"></i>
                <div>
                    <div class="fw-bold">Selected Customer: ${selectedCustomer.costumerName}</div>
                    <div class="small mt-1">Mobile: ${selectedCustomer.costumerContactInfo} | ID: ${selectedCustomer.costumerId}</div>
                </div>
            </div>
        `);

    $("#searchName").val("");
    $("#searchMobile").val("");

}

function addCustomer() {
    var name = $("#newCustomerName").val();
    var mobile = $("#newCustomerMobile").val();
    if (!name || !mobile) {
        $("#addCustomerResult")
            .removeClass("d-none alert-success")
            .addClass("alert-danger")
            .html(`
                <div class="d-flex align-items-center">
                    <i class="bi bi-exclamation-triangle-fill me-2"></i>
                    <div>Please fill in both customer name and mobile number.</div>
                </div>
            `);
        return;
    }
    $.post("/SalesOrder/AddCustomer", { name: name, mobile: mobile }, function (response) {
        if (response.success) {
            $("#addCustomerResult")
                .removeClass("d-none alert-danger")
                .addClass("alert-success")
                .text("Customer added successfully!");
            $("#newCustomerName").val("");
            $("#newCustomerMobile").val("");
        } 
        else {
            $("#addCustomerResult")
                .removeClass("d-none alert-success")
                .addClass("alert-danger")
                .html(`
                    <div class="d-flex align-items-center">
                        <i class="bi bi-exclamation-triangle-fill me-2"></i>
                        <div>Error: ${response.message}</div>
                    </div>
                `);
        }

    });
}
function searchProduct() {
    //var id from html
    var id = $("#searchProduct").val();
    $.post("/SalesOrder/SearchProduct", { id: id }, function (productresponse) {
        if (productresponse) {
            selectedProduct = productresponse;
            $("#modalProductName").text(productresponse.description);
            $("#modalProductPrice").text(productresponse.sellingPrice);
            $("#modalProductCode").text(productresponse.productCode);
            
            var modal = new bootstrap.Modal(document.getElementById('productModal'));
            modal.show();
        } else {
            alert("Product not found.");
        }
    });
}
    
function addProductToOrder(qty) {
    qty = parseInt(qty); // ensures it's an integer
    if (isNaN(qty) || qty <= 0) {
        alert("Please enter a valid quantity.");
        return;
    }
    else {
        let product = {
            description: selectedProduct.description,
            code: selectedProduct.productCode,
            price: parseFloat(selectedProduct.sellingPrice),
            quantity: qty,
            total: parseFloat(selectedProduct.sellingPrice)

        };
        orderProducts.push(product);
        showintable();
    }
}     
        
function showintable() {
    const tbody = $("#orderTable tbody");  //accesses the <tbody>
    tbody.empty();
    let i = 0;
    while (i < orderProducts.length) {
        const product = orderProducts[i];
        const row = `
            <tr>
                <td>${product.description}</td>
                <td>${product.code}</td>
                <td>${product.price}</td>
                <td>${product.quantity}</td>
                <td>${product.price * product.quantity}</td>
                <td class="text-center">
                    <button class="btn btn-sm btn-danger" onclick="removeProduct(${i})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        tbody.append(row);
        i++;

    }

}

