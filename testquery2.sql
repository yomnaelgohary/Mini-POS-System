SELECT * 
FROM SalesOrder
ORDER BY SalesOrderId DESC

SELECT * 
FROM SalesOrderItem
WHERE SalesOrderId = (
    SELECT TOP 1 SalesOrderId 
    FROM SalesOrder 
    ORDER BY SalesOrderId DESC
);

SELECT so.SalesOrderId, so.OrderDate, so.Status, soi.ProductId, soi.Quantity, soi.Price
FROM SalesOrder so
JOIN SalesOrderItem soi ON so.SalesOrderId = soi.SalesOrderId
ORDER BY so.SalesOrderId DESC;
