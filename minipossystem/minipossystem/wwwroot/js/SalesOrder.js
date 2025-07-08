
function searchCustomer() {
    var name = $("#searchName").val();
    var mobile = $("#searchMobile").val();

    $.post("/SalesOrder/FindCustomer", { name: name, mobile: mobile }, function (customer) {

        if (customer) {
            $("#customerResult")
                .removeClass("d-none")
                .removeClass("alert-warning")
                .addClass("alert-success")
                .text("Customer Found: " + customer.costumerName + " (ID: " + customer.costumerId + ")");
        } else {
            $("#customerResult")
                .removeClass("d-none")
                .removeClass("alert-success")
                .addClass("alert-warning")
                .text("Customer not found. Please add a new one.");
        }
    });
}

function addCustomer() {
    var name = $("#newCustomerName").val();
    var mobile = $("#newCustomerMobile").val();

    $.post("/SalesOrder/AddCustomer", { name: name, mobile: mobile }, function (response) {
        if (response.success) {
            $("#addCustomerResult")
                .removeClass("d-none alert-danger")
                .addClass("alert-success")
                .text("Customer added successfully!");

            // Optional: close modal after 1 second
            setTimeout(function () {
                $("#addCustomerModal").modal('hide');
                location.reload(); // refresh page if needed
            }, 1000);
        } else {
            $("#addCustomerResult")
                .removeClass("d-none alert-success")
                .addClass("alert-danger")
                .text("Error: " + response.message);
        }
    });
}
function searchProduct() {
    //var id from html
    var id = $("#searchProduct").val();
    $.post("/SalesOrder/SearchProduct", { id: id }, function (productresponse) {
        if (productresponse) {
            currentProduct = productresponse;
            $("#modalProductName").text(productresponse.description);
            $("#modalProductPrice").text(productresponse.sellingPrice);
            $("#modalProductCode").text(productresponse.productCode);
            $("#modalProductQty").val(1);
            var modal = new bootstrap.Modal(document.getElementById('productModal'));
            modal.show();
        } else {
            alert("Product not found.");
        }
    });
}
    
        
        


