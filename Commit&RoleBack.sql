BEGIN TRANSACTION;

BEGIN TRY
    
    INSERT INTO SalesOrder (CostumerID, EmployeeID, OrderDate, Status)
    VALUES (1, 1, GETDATE(), 'pending');

    DECLARE @SalesOrderID INT = SCOPE_IDENTITY();

    
    INSERT INTO SalesOrderItem (SalesOrderID, ProductID, Quantity, Price)
    VALUES
        (@SalesOrderID, 2, 2, 10.0),
        (@SalesOrderID, 3, 1, 15.5);

    COMMIT;
	 PRINT 'Transaction committed successfully.';
END TRY
BEGIN CATCH
    ROLLBACK;
	PRINT 'Transaction failed and rolled back.';
    THROW;
END CATCH

SELECT * FROM SalesOrder ORDER BY SalesOrderID DESC;
SELECT * FROM SalesOrderItem ORDER BY SalesOrderItemID DESC;

