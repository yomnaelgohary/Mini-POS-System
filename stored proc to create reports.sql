-- CREATE PROCEDURE GetTotalSalesPerMonth
-- @FromDate DATE,
-- @ToDate DATE
--AS
--BEGIN
--Select FORMAT(so.OrderDate, 'yyyy-MM') as salesmonth ,sum (soi.Price* soi.Quantity)AS Totalsales
--From SalesOrder so inner join SalesOrderItem soi on so.SalesOrderID = soi.SalesOrderID
--WHERE so.OrderDate >= @FromDate AND so.OrderDate < @ToDate
--GROUP BY FORMAT(so.OrderDate, 'yyyy-MM')
--Order By salesmonth
--END
 
--EXEC GetTotalSalesPerMonth '2025-01-01', '2026-01-01';




Select FORMAT(so.OrderDate, 'yyyy-MM') as salesmonth ,sum (soi.Price* soi.Quantity)AS Totalsales
From SalesOrder so inner join SalesOrderItem soi on so.SalesOrderID = soi.SalesOrderID
GROUP BY FORMAT(so.OrderDate, 'yyyy-MM')
Order By salesmonth

Select Month (so.OrderDate) as Month,Year (so.OrderDate)as Year ,sum (soi.Price* soi.Quantity)AS Totalsales
From SalesOrder so inner join SalesOrderItem soi on so.SalesOrderID = soi.SalesOrderID
GROUP BY Month (so.OrderDate), Year (so.OrderDate)
Order By month, year

Select so.SalesOrderID,Month (so.OrderDate) as month, sum (soi.Price* soi.Quantity)AS TotalOrderPrice
From SalesOrder so inner join SalesOrderItem soi on so.SalesOrderID = soi.SalesOrderID
GROUP BY so.SalesOrderID, Month (so.OrderDate) 
Order By month

select *
from SalesOrderItem


DROP PROCEDURE IF EXISTS GetTotalSalesPerMonth;
GO

CREATE PROCEDURE GetTotalSalesPerMonth
 @FromDate DATE,
 @ToDate DATE
AS
BEGIN
    SELECT 
        FORMAT(so.OrderDate, 'yyyy-MM') AS salesmonth,
        SUM(soi.Price * soi.Quantity) AS Totalsales
    FROM SalesOrder so
    INNER JOIN SalesOrderItem soi ON so.SalesOrderID = soi.SalesOrderID
    WHERE so.OrderDate >= @FromDate AND so.OrderDate < @ToDate
    GROUP BY FORMAT(so.OrderDate, 'yyyy-MM')
    ORDER BY salesmonth
END
GO

EXEC GetTotalSalesPerMonth '2025-01-01', '2026-01-01';



GO

CREATE PROCEDURE GetMonthDetails
 @Date DATE
AS
BEGIN
    SELECT 
        --FORMAT(so.OrderDate, 'yyyy-MM') AS salesmonth,
		soi.SalesOrderItemID,
		sum (p.SellingPrice*soi.Quantity) as price
		   
    FROM SalesOrder so
    INNER JOIN SalesOrderItem soi ON so.SalesOrderID = soi.SalesOrderID
	INNER JOIN Products p ON soi.ProductID =p.ProductID
    WHERE FORMAT(so.OrderDate, 'yyyy-MM')= FORMAT(@Date, 'yyyy-MM')
    Group by soi.SalesOrderItemID 
END
GO
EXEC GetMonthDetails @Date = '2025-04-01'



    SELECT 
        --FORMAT(so.OrderDate, 'yyyy-MM') AS salesmonth,
		soi.SalesOrderItemID,
		sum (p.SellingPrice*soi.Quantity) as price
		   
    FROM SalesOrder so
    INNER JOIN SalesOrderItem soi ON so.SalesOrderID = soi.SalesOrderID
	INNER JOIN Products p ON soi.SalesOrderItemID =p.ProductID
    WHERE FORMAT(so.OrderDate, 'yyyy-MM')= '2025-04'
    Group by soi.SalesOrderItemID, price 
	
  -- select *
   --from SalesOrder
 --  where Format (SalesOrder.OrderDate, 'yyyy-MM')= '2025-04'
    
	    SELECT 
        --FORMAT(so.OrderDate, 'yyyy-MM') AS salesmonth,
		soi.SalesOrderItemID,
		p.SellingPrice,
		soi.Quantity
		   
    FROM SalesOrder so
    INNER JOIN SalesOrderItem soi ON so.SalesOrderID = soi.SalesOrderID
	INNER JOIN Products p ON soi.SalesOrderItemID =p.ProductID
    WHERE FORMAT(so.OrderDate, 'yyyy-MM')= '2025-04'
    

   select *
   from SalesOrderItem

   select *
   from Products