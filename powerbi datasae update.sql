SELECT 
    so.SalesOrderID, 
    so.CostumerID, 
    so.EmployeeID, 
    so.OrderDate, 
    so.Status, 
    
    soi.ProductID, 
    soi.Quantity, 
    soi.Price, 
    soi.Total AS SalesOrderItemTotalPrice,

    si.SalesInvoiceID, 
    si.InvoiveDate, 
    si.Price AS SalesInvoicePrice, 
    si.IsCredit, 

    sii.InvoivedQuantity, 
    sii.Total AS InvoicedItemTotal,
	sii.CreditedQuantity


FROM SalesOrder so 
LEFT JOIN SalesOrderItem soi 
    ON so.SalesOrderID = soi.SalesOrderID 
LEFT JOIN SalesInvoice si 
    ON so.SalesOrderID = si.SalesOrderID 
LEFT JOIN SalesInvoiceItem sii 
    ON si.SalesInvoiceID = sii.SalesInvoiceID;

select *
from SalesInvoice si left join SalesInvoiceItem sii on si.SalesInvoiceID=sii.SalesInvoiceItmeID 


ALTER TABLE SalesInvoiceItem
ADD ProductID INT,
    Quantity INT,
    UnitPrice DECIMAL(18,2),
    Total AS (InvoicedQuantity * UnitPrice) PERSISTED;

select * 
from SalesInvoiceItem

--ALTER TABLE SalesInvoiceItem
--DROP COLUMN Total;

--ALTER TABLE SalesInvoiceItem
--DROP COLUMN Quantity;

--ALTER TABLE SalesInvoiceItem
--ADD Total AS (InvoivedQuantity * UnitPrice) PERSISTED;

ALTER TABLE SalesInvoiceItem
ADD CONSTRAINT FK_SalesInvoiceItem_Product
FOREIGN KEY (ProductID)
REFERENCES Products(ProductID);


INSERT INTO SalesInvoiceItem 
(SalesInvoiceID, SalesOrderItemID, CreditedQuantity, InvoivedQuantity, ProductID, UnitPrice)
VALUES
(101, 201, 0, 2, 31, 50.00),
(101, 202, 1, 3, 32, 20.00),
(102, 203, 0, 5, 33, 15.00),
(102, 204, 2, 4, 34, 30.00),
(103, 205, 0, 1, 35, 100.00),
(104, 206, 0, 10, 36, 5.00);

go
CREATE VIEW FactSales AS
SELECT 
    so.SalesOrderID, 
    so.CostumerID, 
    so.EmployeeID, 
    so.OrderDate, 
    so.Status, 
    
    soi.ProductID, 
    soi.Quantity, 
    soi.Price, 
    soi.Total AS SalesOrderItemTotalPrice,

    si.SalesInvoiceID, 
    si.InvoiveDate, 
    si.Price AS SalesInvoicePrice, 
    si.IsCredit, 

    sii.InvoivedQuantity, 
    sii.Total AS InvoicedItemTotal,
    sii.CreditedQuantity

FROM SalesOrder so 
LEFT JOIN SalesOrderItem soi 
    ON so.SalesOrderID = soi.SalesOrderID 
LEFT JOIN SalesInvoice si 
    ON so.SalesOrderID = si.SalesOrderID 
LEFT JOIN SalesInvoiceItem sii 
    ON si.SalesInvoiceID = sii.SalesInvoiceID;


	select *
	from FactSales



