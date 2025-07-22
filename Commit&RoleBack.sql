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


ALTER TABLE Products
ADD Article NTEXT;


UPDATE Products
SET Article = '
Introducing the X-Prime UltraSmart Smartphone – a breakthrough in mobile technology that redefines user experience. Built with precision, speed, and intelligence, the X-Prime is designed for users who demand both performance and elegance. Powered by the next-generation OctaCore A17 processor, this device handles multitasking, gaming, streaming, and business applications with unmatched fluidity.

The UltraSmart features a 6.8-inch AMOLED edge-to-edge display with HDR10+ support, offering vibrant colors, deep blacks, and a 120Hz refresh rate for silky-smooth visuals. Whether youre watching high-definition videos or editing photos, the screen delivers lifelike clarity.

Battery life is one of the standout features of the X-Prime. With a 5200mAh intelligent battery, it adapts to your usage patterns, giving you up to two days of real-world usage. Fast charging (65W wired, 30W wireless) ensures youre never tethered to a power outlet for long.

Camera technology in the UltraSmart is nothing short of revolutionary. The triple-lens system includes a 108MP primary sensor, a 12MP ultra-wide lens, and a 10MP telephoto lens with 5x optical zoom. Advanced computational photography powered by AI enhances every shot—even in low light—while the Pro Video mode lets you capture 8K videos with cinematic stability.

Security is a top priority with the X-Prime. The under-display ultrasonic fingerprint sensor and facial recognition powered by neural processing units ensure both speed and accuracy. Your data is safeguarded with encrypted storage and a secure enclave designed for sensitive operations.

On the software side, the UltraSmart runs UltraOS 4.0 (based on Android 14), offering intuitive UI customizations, productivity-focused features like split-screen multitasking, and advanced privacy tools. It comes with three years of guaranteed OS updates and five years of security patches.

The smartphone also supports Wi-Fi 6E, 5G connectivity, Bluetooth 5.3, NFC, and has dual SIM support. Audio quality is premium thanks to dual stereo speakers tuned by Dolby Atmos, and the device retains a water and dust resistance rating of IP68.

Whether youre a power user, content creator, business professional, or someone who simply wants a beautiful and reliable device, the X-Prime UltraSmart Smartphone sets a new standard. Experience the future—today.

Technical Specifications:
- Display: 6.8” AMOLED, 3200x1440, 120Hz
- Processor: OctaCore A17 (5nm)
- RAM: 12GB LPDDR5X
- Storage: 256GB UFS 4.0
- Battery: 5200mAh with fast and wireless charging
- Rear Camera: 108MP + 12MP + 10MP (5x Zoom)
- Front Camera: 32MP
- OS: UltraOS 4.0 (Android 14)
- Connectivity: 5G, Wi-Fi 6E, Bluetooth 5.3, NFC
- IP Rating: IP68 Dust & Water Resistant

Order now and enjoy exclusive benefits including extended warranty, premium support, and free shipping nationwide. Limited stock available.
'
WHERE ProductID = 1;


select *
from Products 
where ProductID= 1

--SELECT SERVERPROPERTY('Edition'), SERVERPROPERTY('ProductVersion'), SERVERPROPERTY('EngineEdition');
