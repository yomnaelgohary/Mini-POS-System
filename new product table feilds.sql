GO
CREATE PROCEDURE UpdatingProductCostAndQuantity
    @BranchId INT,
    @ProductId INT,
    @AddedQuantity INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @OldQuantity INT;
    DECLARE @OldAvgCost DECIMAL(18,2);
    DECLARE @NewUnitPrice DECIMAL(18,2);
    DECLARE @NewAvgCost DECIMAL(18,2);

    
    SELECT 
        @OldQuantity = ISNULL(SUM(wp.TotalQuantity), 0)
    FROM WarehouseProducts wp
    JOIN Warehouses w ON wp.WarehouseId = w.WarehouseId
    WHERE wp.ProductId = @ProductId AND w.BranchId = @BranchId;

   
    SELECT 
        @OldAvgCost = AvrgCost
    FROM Products
    WHERE ProductId = @ProductId;

    SELECT TOP 1
        @NewUnitPrice = i.Price
    FROM PurchaseOrderInvoiceItem i
    JOIN PurchaseOrderItem po ON i.PurchaseOrderItemId = po.PurchaseOrderItemId
    WHERE po.ProductId = @ProductId
    ORDER BY i.PurchaseInvoiceItemId DESC;

    IF (@OldQuantity + @AddedQuantity) > 0
        SET @NewAvgCost = 
            ((@OldQuantity * @OldAvgCost) + (@AddedQuantity * @NewUnitPrice)) 
            / (@OldQuantity + @AddedQuantity);
    ELSE
        SET @NewAvgCost = @NewUnitPrice;

   
    UPDATE Products
    SET AvrgCost = @NewAvgCost
    WHERE ProductId = @ProductId;

   
END;

SELECT SUM(wp.TotalQuantity) AS BranchTotalQuantity
FROM WarehouseProducts wp
JOIN Warehouses w ON wp.WarehouseId = w.WarehouseId
WHERE wp.ProductId = 1 AND w.BranchId = 1;

SELECT AvrgCost
FROM Products
WHERE ProductId = 1;

SELECT TOP 1 i.Price
FROM PurchaseOrderInvoiceItem i
JOIN PurchaseOrderItem po ON i.PurchaseOrderItemId = po.PurchaseOrderItemId
WHERE po.ProductId = 1
ORDER BY i.PurchaseInvoiceItemId DESC;

EXEC UpdatingProductCostAndQuantity @BranchId = 1, @ProductId = 1, @AddedQuantity = 10;

SELECT AvrgCost
FROM Products
WHERE ProductId = 1;
