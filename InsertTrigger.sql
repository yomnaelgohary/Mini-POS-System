-- insert into Costumer 
 --Values ('Yomna', '014')

-- select*
-- from Costumer 

-- Create Table newCostumerAudit (
-- AuditID INT IDENTITY(1,1) PRIMARY KEY,
-- CostumerID int,
-- CostumerName varchar(50),
-- CostumerInfo varchar (50),
-- );

-- GO
--CREATE TRIGGER  trg_newCostumer 
--on Costumer 
--After Insert 
--as 
--begin 
--Insert into newCostumerAudit (CostumerID, CostumerName,CostumerInfo )
--select CostumerID,
--        CostumerName,
--        CostumerContactInfo
--from inserted 
--end;

--GO

-- insert into Costumer 
-- Values ('Yomna', '014')
 
-- GO
--select*
-- from Costumer
-- GO

-- select *
-- from newCostumerAudit

 
-- insert into Costumer 
-- Values ('Yasmeen', '014')
 
-- GO

--  select *
-- from newCostumerAudit

Go 
create table AuditCostumerUpdate(
AuditID int identity (1,1) Primary Key,
CostumerID int,
CostumerName varchar(50),
CostumerContactInfo varchar(50)
);

Go 
create trigger trg_CostumerUpdate
on Costumer 
after Update 
as
begin
Insert into AuditCostumerUpdate (CostumerID,CostumerName, CostumerContactInfo)
Select i.CostumerID, d.CostumerContactInfo, i.CostumerContactInfo
from inserted i inner join deleted d on i.CostumerID = d.CostumerID
end;
Go 

update Costumer 
set CostumerContactInfo = '0111111'
where CostumerID = 1151;
Go 
select *
from AuditCostumerUpdate 
GO 

EXEC sp_rename 'AuditCostumerUpdate.CostumerName', 'OldContactInfo', 'COLUMN';

EXEC sp_rename 'AuditCostumerUpdate.CostumerContactInfo', 'NewContactInfo', 'COLUMN';


