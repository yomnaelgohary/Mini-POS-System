---- insert into Costumer 
-- --Values ('Yomna', '014')

---- select*
---- from Costumer 

-- Create Table newCostumerAudit (
-- AuditID INT IDENTITY(1,1) PRIMARY KEY,
-- CostumerID int,
-- CostumerName varchar(50),
-- CostumerInfo varchar (50),
-- );

---- GO
----CREATE TRIGGER  trg_newCostumer 
----on Costumer 
----After Insert 
----as 
----begin 
----Insert into newCostumerAudit (CostumerID, CostumerName,CostumerInfo )
----select CostumerID,
----        CostumerName,
----        CostumerContactInfo
----from inserted 
----end;

----GO

---- insert into Costumer 
---- Values ('Yomna', '014')
 
---- GO
----select*
---- from Costumer
---- GO

---- select *
---- from newCostumerAudit

 
---- insert into Costumer 
---- Values ('Yasmeen', '014')
 
---- GO

----  select *
---- from newCostumerAudit

--Go 
--create table AuditCostumerUpdate(
--AuditID int identity (1,1) Primary Key,
--CostumerID int,
--CostumerName varchar(50),
--CostumerContactInfo varchar(50)
--);

----Go 
----create trigger trg_CostumerUpdate
----on Costumer 
----after Update 
----as
----begin
----Insert into AuditCostumerUpdate (CostumerID,OldContactInfo, NewContactInfo)
----Select i.CostumerID, d.CostumerContactInfo, i.CostumerContactInfo
----from inserted i inner join deleted d on i.CostumerID = d.CostumerID
----end;
----Go 

----update Costumer 
----set CostumerContactInfo = '0111111'
----where CostumerID = 1151;
----Go 
----select *
----from AuditCostumerUpdate 
----GO 

--EXEC sp_rename 'AuditCostumerUpdate.CostumerName', 'OldContactInfo', 'COLUMN';

--EXEC sp_rename 'AuditCostumerUpdate.CostumerContactInfo', 'NewContactInfo', 'COLUMN';


--GO 
--create table AuditDeletedCostumer (
--AuditID int identity (1,1) primary key,
--CostumerName varchar(50),
--CostumerContactInfo varchar(50)
--);
----GO
----Create Trigger trg_DeletedCostumer 
----on Costumer 
----after Delete 
----as 
----begin 
----Insert into AuditDeletedCostumer( CostumerName, CostumerContactInfo)
----select CostumerName, CostumerContactInfo
----from deleted 
----end;
----Go 
----delete 
----from Costumer
----where CostumerID=161;
----go 
----select *
----from AuditDeletedCostumer
----go
----select* 
----from Costumer



--INSERT INTO Costumer (CostumerName, CostumerContactInfo)
--VALUES ('Yomna Test2', '0123456789');
--GO

--UPDATE Costumer
--SET CostumerContactInfo = '0100000000'
--WHERE CostumerID = 1154;
--GO


--DELETE FROM Costumer
--WHERE CostumerID = 1154;
--GO

--SELECT * FROM newCostumerAudit;
--SELECT * FROM AuditCostumerUpdate;
--SELECT * FROM AuditDeletedCostumer;
--SELECT * FROM Costumer;
--GO
----EXEC sp_help Costumer;
--DROP TRIGGER trg_CostumerUpdate;
--GO
--CREATE TRIGGER trg_CostumerUpdate
--ON Costumer
--AFTER UPDATE
--AS
--BEGIN
--    INSERT INTO AuditCostumerUpdate (CostumerID, OldContactInfo, NewContactInfo)
--    SELECT i.CostumerID, d.CostumerContactInfo, i.CostumerContactInfo
--    FROM inserted i
--    INNER JOIN deleted d ON i.CostumerID = d.CostumerID;
--END;
--GO
