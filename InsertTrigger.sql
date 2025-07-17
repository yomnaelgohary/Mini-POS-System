-- insert into Costumer 
 --Values ('Yomna', '014')

 select*
 from Costumer 

 Create Table newCostumerAudit (
 AuditID INT IDENTITY(1,1) PRIMARY KEY,
 CostumerID int,
 CostumerName varchar(50),
 CostumerInfo varchar (50),
 );

 GO
CREATE TRIGGER  trg_newCostumer 
on Costumer 
After Insert 
as 
begin 
Insert into newCostumerAudit (CostumerID, CostumerName,CostumerInfo )
select CostumerID,
        CostumerName,
        CostumerContactInfo
from inserted 
end;

GO

 insert into Costumer 
 Values ('Yomna', '014')
 
 GO
select*
 from Costumer
 GO

 select *
 from newCostumerAudit

 
 insert into Costumer 
 Values ('Yasmeen', '014')
 
 GO

  select *
 from newCostumerAudit