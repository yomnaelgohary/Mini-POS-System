
EXEC sp_rename 'WarehouseProducts.Quantity', 'TotalQuantity', 'COLUMN';

ALTER TABLE WarehouseProducts
ADD ReservedQuantity INT NOT NULL DEFAULT 0;

ALTER TABLE WarehouseProducts
ADD UnreservedQuantity AS (TotalQuantity - ReservedQuantity);
