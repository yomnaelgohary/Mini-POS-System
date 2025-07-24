
EXEC sp_rename 'WarehouseProducts.Quantity', 'TotalQuantity', 'COLUMN';

ALTER TABLE WarehouseProducts
ADD ReservedQuantity INT NOT NULL DEFAULT 0;

ALTER TABLE WarehouseProducts
ADD UnreservedQuantity AS (TotalQuantity - ReservedQuantity);

select *
from WarehouseProducts
select * 
from Warehouses


INSERT INTO WarehouseProducts(WarehouseId, ProductId, TotalQuantity, ReservedQuantity, Price)
VALUES
(1, 30, 100, 20, 50.00), 
(1, 20, 200, 50, 30.00),
(2, 2, 150, 0, 75.00),   
(2, 1, 120, 60, 40.00), 
(3, 5, 90, 10, 20.00); 

ALTER TABLE Employees
ADD Password NVARCHAR(100) NOT NULL DEFAULT '1234';  
 
select *
from Employees


ALTER TABLE PurchaseOrder
ADD BranchId INT NOT NULL DEFAULT 1;  

ALTER TABLE PurchaseOrder
ADD CONSTRAINT FK_PurchaseOrders_Branch
    FOREIGN KEY (BranchId) REFERENCES Branches(BranchId);

select *
from PurchaseOrderInvoice

select*
from PurchaseOrderInvoiceItem p
where p.PurchaseOrderInvoiceID =40


