CREATE PROCEDURE sp_AddPurchaseOrderItem
    @PurchaseOrderID INT,
    @ProductID INT,
    @Quantity INT,
    @Price DECIMAL(18,2)
AS
BEGIN
 
    IF NOT EXISTS (SELECT 1 FROM PurchaseOrder WHERE PurchaseOrderID = @PurchaseOrderID)
    BEGIN
        RAISERROR('Purchase Order not found.', 16, 1);
        RETURN;
    END

    
    INSERT INTO PurchaseOrderItem (PurchaseOrderID, ProductID, Quantity, Price)
    VALUES (@PurchaseOrderID, @ProductID, @Quantity, @Price);

    UPDATE PurchaseOrder
    SET Price = Price + (@Quantity * @Price)
    WHERE PurchaseOrderID = @PurchaseOrderID;
END
GO

CREATE PROCEDURE sp_MakePurchaseOrder
@VendorID int, 
@EmployeeID int,
@Price DECIMAL(18,2) OUTPUT,
@PurchaseOrderID INT OUTPUT
AS 
BEGIN 
INSERT INTO PurchaseOrder (VendorID, EmployeeID, Price, Date, Status)
    VALUES (@VendorID, @EmployeeID, 0,GETDATE(), 'Pending');
	SET @PurchaseOrderID = SCOPE_IDENTITY();
    SET @Price = 0; 
END
GO

DECLARE @PurchaseOrderID INT;
DECLARE @TotalPrice DECIMAL(18,2);
EXEC sp_MakePurchaseOrder
    @VendorID = 1,          -- Set this to a real VendorID from your table
    @EmployeeID = 2,        -- Set this to a real EmployeeID from your table
    @Price = @TotalPrice OUTPUT,
    @PurchaseOrderID = @PurchaseOrderID OUTPUT;
-- Add Item 1
EXEC sp_AddPurchaseOrderItem
    @PurchaseOrderID = @PurchaseOrderID,
    @ProductID = 1,         -- Real ProductID
    @Quantity = 5,
    @Price = 240.00;

-- Add Item 2
EXEC sp_AddPurchaseOrderItem
    @PurchaseOrderID = @PurchaseOrderID,
    @ProductID = 3,         -- Real ProductID
    @Quantity = 2,
    @Price = 3100.00;
SELECT * FROM PurchaseOrder WHERE PurchaseOrderID = @PurchaseOrderID;
SELECT * FROM PurchaseOrderItem WHERE PurchaseOrderID = @PurchaseOrderID;
