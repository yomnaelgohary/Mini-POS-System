CREATE TABLE RoleAccess (
    RoleName VARCHAR(100) PRIMARY KEY,

    CanViewSalesOrders BIT NOT NULL DEFAULT 0,
    CanCreateInvoice BIT NOT NULL DEFAULT 0,
    CanCreditInvoice BIT NOT NULL DEFAULT 0,
    CanCreatePurchaseOrder BIT NOT NULL DEFAULT 0,
    CanReceivePurchaseOrderInvoice BIT NOT NULL DEFAULT 0,
    CanCreditPurchaseOrderInvoice BIT NOT NULL DEFAULT 0,
    CanReciveProductstoWH BIT NOT NULL DEFAULT 0,
    CanSupplyProductsFromWH BIT NOT NULL DEFAULT 0
);
INSERT INTO RoleAccess (
    RoleName,
    CanViewSalesOrders,
    CanCreateInvoice,
    CanCreditInvoice,
    CanCreatePurchaseOrder,
    CanReceivePurchaseOrderInvoice,
    CanCreditPurchaseOrderInvoice,
    CanReciveProductstoWH,
    CanSupplyProductsFromWH
)
VALUES (
    'SalesExecutive', 
    1, 1, 1, 
    0, 0, 0, 
    0, 0
);
INSERT INTO RoleAccess (
    RoleName,
    CanViewSalesOrders,
    CanCreateInvoice,
    CanCreditInvoice,
    CanCreatePurchaseOrder,
    CanReceivePurchaseOrderInvoice,
    CanCreditPurchaseOrderInvoice,
    CanReciveProductstoWH,
    CanSupplyProductsFromWH
)
VALUES (
    'ProcurementOfficer', 
    0, 0, 0, 
    1, 1, 1, 
    0, 0
);
INSERT INTO RoleAccess (
    RoleName,
    CanViewSalesOrders,
    CanCreateInvoice,
    CanCreditInvoice,
    CanCreatePurchaseOrder,
    CanReceivePurchaseOrderInvoice,
    CanCreditPurchaseOrderInvoice,
    CanReciveProductstoWH,
    CanSupplyProductsFromWH
)
VALUES (
    'WarehouseController', 
    0, 0, 0, 
    0, 0, 0, 
    1, 1
);
Select *
From RoleAccess;

INSERT INTO Employees (EmployeeRole, EmployeeContactInfo, BranchId)
VALUES 
('SalesExecutive', 'sales1@guc.edu.eg', 1),
('SalesExecutive', 'sales2@guc.edu.eg', 1),
('ProcurementOfficer', 'proc1@guc.edu.eg', 1),
('WarehouseController', 'wh1@guc.edu.eg', 1);


Select *
From Employees 