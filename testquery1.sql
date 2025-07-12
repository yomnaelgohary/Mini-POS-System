SELECT *
FROM SalesInvoice;

SELECT *
FROM SalesInvoiceItem;
 
 INSERT INTO SalesInvoice (SalesOrderId,  Price)
VALUES (8, 0);
SELECT TOP 1 SalesInvoiceId
FROM SalesInvoice
ORDER BY SalesInvoiceId DESC;
-- Add an item from SalesOrderItem with ID = 23
INSERT INTO SalesInvoiceItem (SalesInvoiceId, SalesOrderItemId)
VALUES (12, 23);

-- Another item
INSERT INTO SalesInvoiceItem (SalesInvoiceId, SalesOrderItemId)
VALUES (12, 24);
SELECT 
    SUM(soi.Quantity * soi.Price) AS InvoiceTotal
FROM SalesInvoiceItem sii
JOIN SalesOrderItem soi ON sii.SalesOrderItemId = soi.SalesOrderItemId
WHERE sii.SalesInvoiceId = 12;
UPDATE SalesInvoice
SET Price = (
    SELECT SUM(soi.Quantity * soi.Price)
    FROM SalesInvoiceItem sii
    JOIN SalesOrderItem soi ON sii.SalesOrderItemId = soi.SalesOrderItemId
    WHERE sii.SalesInvoiceId = 12
)
WHERE SalesInvoiceId = 12;
SELECT 
    si.SalesInvoiceId,
    si.SalesOrderId,
    si.InvoiveDate,
    si.Price AS TotalPrice,
    
    soi.Quantity,
    soi.Price AS UnitPrice,
    soi.Quantity * soi.Price AS LineTotal
FROM SalesInvoice si
JOIN SalesInvoiceItem sii ON si.SalesInvoiceId = sii.SalesInvoiceId
JOIN SalesOrderItem soi ON sii.SalesOrderItemId = soi.SalesOrderItemId
WHERE si.SalesInvoiceId = 12;
