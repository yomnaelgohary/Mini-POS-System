USE [mini-pos-system]
GO
/****** Object:  Table [dbo].[Branches]    Script Date: 7/6/2025 11:44:51 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Branches](
	[BranchID] [int] IDENTITY(1,1) NOT NULL,
	[BranchName] [varchar](50) NOT NULL,
	[BranchAddress] [varchar](50) NOT NULL,
	[CompanyID] [int] NOT NULL,
 CONSTRAINT [PK_Branches] PRIMARY KEY CLUSTERED 
(
	[BranchID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Company]    Script Date: 7/6/2025 11:44:51 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Company](
	[CompanyID] [int] IDENTITY(1,1) NOT NULL,
	[CompanyName] [varchar](50) NOT NULL,
	[CompanyAddress] [varchar](50) NOT NULL,
	[CompanyContactInfo] [varchar](50) NOT NULL,
 CONSTRAINT [PK_Company] PRIMARY KEY CLUSTERED 
(
	[CompanyID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Costumer]    Script Date: 7/6/2025 11:44:51 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Costumer](
	[CostumerID] [int] IDENTITY(1,1) NOT NULL,
	[CostumerName] [nchar](10) NOT NULL,
	[CostumerContactInfo] [nchar](10) NOT NULL,
 CONSTRAINT [PK_Costumer] PRIMARY KEY CLUSTERED 
(
	[CostumerID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CreditNote]    Script Date: 7/6/2025 11:44:51 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CreditNote](
	[CreditNoteID] [int] IDENTITY(1,1) NOT NULL,
	[SalesInvoiceID] [int] NOT NULL,
	[Date] [date] NOT NULL,
	[EmployeeID] [int] NOT NULL,
	[Price] [decimal](18, 2) NOT NULL,
 CONSTRAINT [PK_CreditNote] PRIMARY KEY CLUSTERED 
(
	[CreditNoteID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CreditNoteItem]    Script Date: 7/6/2025 11:44:51 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CreditNoteItem](
	[CreditNoteItemID] [int] IDENTITY(1,1) NOT NULL,
	[CreditNoteID] [int] NOT NULL,
	[InvoiceItemID] [int] NOT NULL,
	[Quantity] [int] NOT NULL,
	[Price] [decimal](18, 2) NOT NULL,
 CONSTRAINT [PK_CreditNoteItem] PRIMARY KEY CLUSTERED 
(
	[CreditNoteItemID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Employees]    Script Date: 7/6/2025 11:44:51 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Employees](
	[EmployeeID] [int] IDENTITY(1,1) NOT NULL,
	[EmployeeRole] [varchar](50) NOT NULL,
	[EmployeeContactInfo] [varchar](50) NOT NULL,
	[BranchID] [int] NOT NULL,
 CONSTRAINT [PK_Employees] PRIMARY KEY CLUSTERED 
(
	[EmployeeID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Products]    Script Date: 7/6/2025 11:44:51 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Products](
	[ProductID] [int] IDENTITY(1,1) NOT NULL,
	[Description] [varchar](255) NOT NULL,
	[SellingPrice] [decimal](18, 2) NOT NULL,
	[ProductCode] [varchar](25) NULL,
 CONSTRAINT [PK_Products] PRIMARY KEY CLUSTERED 
(
	[ProductID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PurchaseOrder]    Script Date: 7/6/2025 11:44:51 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PurchaseOrder](
	[PurchaseOrderID] [int] IDENTITY(1,1) NOT NULL,
	[VendorID] [int] NOT NULL,
	[EmployeeID] [int] NOT NULL,
	[Price] [decimal](18, 2) NULL,
	[Date] [date] NULL,
	[Status] [varchar](50) NULL,
 CONSTRAINT [PK_PurchaseOrder] PRIMARY KEY CLUSTERED 
(
	[PurchaseOrderID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PurchaseOrderInvoice]    Script Date: 7/6/2025 11:44:51 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PurchaseOrderInvoice](
	[PurchaseOrderInvoiceID] [int] IDENTITY(1,1) NOT NULL,
	[PurchaseOrderID] [int] NOT NULL,
	[Price] [decimal](18, 0) NOT NULL,
	[Date] [date] NOT NULL,
 CONSTRAINT [PK_PurchaseOrderInvoice] PRIMARY KEY CLUSTERED 
(
	[PurchaseOrderInvoiceID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PurchaseOrderInvoiceItem]    Script Date: 7/6/2025 11:44:51 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PurchaseOrderInvoiceItem](
	[purchaseInvoiceItemID] [int] IDENTITY(1,1) NOT NULL,
	[PurchaseOrderInvoiceID] [int] NOT NULL,
	[PurchaseOrderItemID] [int] NOT NULL,
	[EmployeeID] [int] NOT NULL,
	[BranchID] [int] NOT NULL,
	[Quantity] [int] NOT NULL,
	[Price] [decimal](18, 2) NOT NULL,
 CONSTRAINT [PK_PurchaseOrderInvoiceItem] PRIMARY KEY CLUSTERED 
(
	[purchaseInvoiceItemID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PurchaseOrderItem]    Script Date: 7/6/2025 11:44:51 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PurchaseOrderItem](
	[PurchaseOrderItemID] [int] IDENTITY(1,1) NOT NULL,
	[PurchaseOrderID] [int] NOT NULL,
	[ProductID] [int] NOT NULL,
	[Quantity] [int] NOT NULL,
	[Price] [decimal](18, 2) NOT NULL,
 CONSTRAINT [PK_PurchaseOrderItem] PRIMARY KEY CLUSTERED 
(
	[PurchaseOrderItemID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SalesInvoice]    Script Date: 7/6/2025 11:44:51 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SalesInvoice](
	[SalesInvoiceID] [int] IDENTITY(1,1) NOT NULL,
	[SalesOrderID] [int] NOT NULL,
	[InvoiveDate] [date] NOT NULL,
	[Price] [decimal](18, 2) NOT NULL,
 CONSTRAINT [PK_SalesInvoice] PRIMARY KEY CLUSTERED 
(
	[SalesInvoiceID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SalesInvoiceItem]    Script Date: 7/6/2025 11:44:51 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SalesInvoiceItem](
	[SalesInvoiceItmeID] [int] IDENTITY(1,1) NOT NULL,
	[SalesInvoiceID] [int] NOT NULL,
	[SalesOrderItemID] [int] NOT NULL,
 CONSTRAINT [PK_SalesInvoiceItem] PRIMARY KEY CLUSTERED 
(
	[SalesInvoiceItmeID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SalesOrder]    Script Date: 7/6/2025 11:44:51 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SalesOrder](
	[SalesOrderID] [int] IDENTITY(1,1) NOT NULL,
	[CostumerID] [int] NOT NULL,
	[EmployeeID] [int] NOT NULL,
	[OrderDate] [date] NOT NULL,
	[Status] [varchar](50) NOT NULL,
 CONSTRAINT [PK_SalesOrder] PRIMARY KEY CLUSTERED 
(
	[SalesOrderID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SalesOrderItem]    Script Date: 7/6/2025 11:44:51 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SalesOrderItem](
	[SalesOrderItemID] [int] IDENTITY(1,1) NOT NULL,
	[SalesOrderID] [int] NOT NULL,
	[ProductID] [int] NOT NULL,
	[Quantity] [int] NOT NULL,
	[Price] [decimal](18, 2) NOT NULL,
 CONSTRAINT [PK_SalesOrderItem] PRIMARY KEY CLUSTERED 
(
	[SalesOrderItemID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SalesOrderWarehouse]    Script Date: 7/6/2025 11:44:51 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SalesOrderWarehouse](
	[SalesOrderWarehouseID] [int] IDENTITY(1,1) NOT NULL,
	[SalesOrderItemID] [int] NOT NULL,
	[WarehouseID] [int] NOT NULL,
	[Quantity] [int] NOT NULL,
 CONSTRAINT [PK_SalesOrderWarehouse] PRIMARY KEY CLUSTERED 
(
	[SalesOrderWarehouseID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Vendors]    Script Date: 7/6/2025 11:44:51 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Vendors](
	[VendorID] [int] IDENTITY(1,1) NOT NULL,
	[VendorName] [varchar](50) NOT NULL,
	[ContactInfo] [varchar](50) NOT NULL,
 CONSTRAINT [PK_Vendors] PRIMARY KEY CLUSTERED 
(
	[VendorID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[WarehouseProducts]    Script Date: 7/6/2025 11:44:51 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[WarehouseProducts](
	[WarehouseProductId] [int] IDENTITY(1,1) NOT NULL,
	[WarehouseID] [int] NOT NULL,
	[ProductID] [int] NOT NULL,
	[Quantity] [int] NOT NULL,
	[Price] [decimal](18, 2) NOT NULL,
 CONSTRAINT [PK_WarehouseProducts] PRIMARY KEY CLUSTERED 
(
	[WarehouseProductId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Warehouses]    Script Date: 7/6/2025 11:44:51 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Warehouses](
	[WarehouseID] [int] IDENTITY(1,1) NOT NULL,
	[WarehouseName] [varchar](50) NOT NULL,
	[BranchID] [int] NOT NULL,
 CONSTRAINT [PK_Warehouses] PRIMARY KEY CLUSTERED 
(
	[WarehouseID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Branches]  WITH CHECK ADD  CONSTRAINT [FK_Branches_Company] FOREIGN KEY([CompanyID])
REFERENCES [dbo].[Company] ([CompanyID])
GO
ALTER TABLE [dbo].[Branches] CHECK CONSTRAINT [FK_Branches_Company]
GO
ALTER TABLE [dbo].[CreditNote]  WITH CHECK ADD  CONSTRAINT [FK_CreditNote_Employees] FOREIGN KEY([EmployeeID])
REFERENCES [dbo].[Employees] ([EmployeeID])
GO
ALTER TABLE [dbo].[CreditNote] CHECK CONSTRAINT [FK_CreditNote_Employees]
GO
ALTER TABLE [dbo].[CreditNote]  WITH CHECK ADD  CONSTRAINT [FK_CreditNote_SalesInvoice] FOREIGN KEY([SalesInvoiceID])
REFERENCES [dbo].[SalesInvoice] ([SalesInvoiceID])
GO
ALTER TABLE [dbo].[CreditNote] CHECK CONSTRAINT [FK_CreditNote_SalesInvoice]
GO
ALTER TABLE [dbo].[CreditNoteItem]  WITH CHECK ADD  CONSTRAINT [FK_CreditNoteItem_CreditNote] FOREIGN KEY([CreditNoteID])
REFERENCES [dbo].[CreditNote] ([CreditNoteID])
GO
ALTER TABLE [dbo].[CreditNoteItem] CHECK CONSTRAINT [FK_CreditNoteItem_CreditNote]
GO
ALTER TABLE [dbo].[CreditNoteItem]  WITH CHECK ADD  CONSTRAINT [FK_CreditNoteItem_SalesInvoiceItem] FOREIGN KEY([InvoiceItemID])
REFERENCES [dbo].[SalesInvoiceItem] ([SalesInvoiceItmeID])
GO
ALTER TABLE [dbo].[CreditNoteItem] CHECK CONSTRAINT [FK_CreditNoteItem_SalesInvoiceItem]
GO
ALTER TABLE [dbo].[Employees]  WITH CHECK ADD  CONSTRAINT [FK_Employees_Branches] FOREIGN KEY([BranchID])
REFERENCES [dbo].[Branches] ([BranchID])
GO
ALTER TABLE [dbo].[Employees] CHECK CONSTRAINT [FK_Employees_Branches]
GO
ALTER TABLE [dbo].[PurchaseOrder]  WITH CHECK ADD  CONSTRAINT [FK_PurchaseOrder_Employees] FOREIGN KEY([EmployeeID])
REFERENCES [dbo].[Employees] ([EmployeeID])
GO
ALTER TABLE [dbo].[PurchaseOrder] CHECK CONSTRAINT [FK_PurchaseOrder_Employees]
GO
ALTER TABLE [dbo].[PurchaseOrder]  WITH CHECK ADD  CONSTRAINT [FK_PurchaseOrder_Vendors] FOREIGN KEY([VendorID])
REFERENCES [dbo].[Vendors] ([VendorID])
GO
ALTER TABLE [dbo].[PurchaseOrder] CHECK CONSTRAINT [FK_PurchaseOrder_Vendors]
GO
ALTER TABLE [dbo].[PurchaseOrderInvoice]  WITH CHECK ADD  CONSTRAINT [FK_PurchaseOrderInvoice_PurchaseOrder] FOREIGN KEY([PurchaseOrderID])
REFERENCES [dbo].[PurchaseOrder] ([PurchaseOrderID])
GO
ALTER TABLE [dbo].[PurchaseOrderInvoice] CHECK CONSTRAINT [FK_PurchaseOrderInvoice_PurchaseOrder]
GO
ALTER TABLE [dbo].[PurchaseOrderInvoiceItem]  WITH CHECK ADD  CONSTRAINT [FK_PurchaseOrderInvoiceItem_Branches] FOREIGN KEY([BranchID])
REFERENCES [dbo].[Branches] ([BranchID])
GO
ALTER TABLE [dbo].[PurchaseOrderInvoiceItem] CHECK CONSTRAINT [FK_PurchaseOrderInvoiceItem_Branches]
GO
ALTER TABLE [dbo].[PurchaseOrderInvoiceItem]  WITH CHECK ADD  CONSTRAINT [FK_PurchaseOrderInvoiceItem_Employees] FOREIGN KEY([EmployeeID])
REFERENCES [dbo].[Employees] ([EmployeeID])
GO
ALTER TABLE [dbo].[PurchaseOrderInvoiceItem] CHECK CONSTRAINT [FK_PurchaseOrderInvoiceItem_Employees]
GO
ALTER TABLE [dbo].[PurchaseOrderInvoiceItem]  WITH CHECK ADD  CONSTRAINT [FK_PurchaseOrderInvoiceItem_PurchaseOrderInvoice] FOREIGN KEY([PurchaseOrderInvoiceID])
REFERENCES [dbo].[PurchaseOrderInvoice] ([PurchaseOrderInvoiceID])
GO
ALTER TABLE [dbo].[PurchaseOrderInvoiceItem] CHECK CONSTRAINT [FK_PurchaseOrderInvoiceItem_PurchaseOrderInvoice]
GO
ALTER TABLE [dbo].[PurchaseOrderInvoiceItem]  WITH CHECK ADD  CONSTRAINT [FK_PurchaseOrderInvoiceItem_PurchaseOrderItem] FOREIGN KEY([PurchaseOrderItemID])
REFERENCES [dbo].[PurchaseOrderItem] ([PurchaseOrderItemID])
GO
ALTER TABLE [dbo].[PurchaseOrderInvoiceItem] CHECK CONSTRAINT [FK_PurchaseOrderInvoiceItem_PurchaseOrderItem]
GO
ALTER TABLE [dbo].[PurchaseOrderItem]  WITH CHECK ADD  CONSTRAINT [FK_PurchaseOrderItem_Products] FOREIGN KEY([ProductID])
REFERENCES [dbo].[Products] ([ProductID])
GO
ALTER TABLE [dbo].[PurchaseOrderItem] CHECK CONSTRAINT [FK_PurchaseOrderItem_Products]
GO
ALTER TABLE [dbo].[PurchaseOrderItem]  WITH CHECK ADD  CONSTRAINT [FK_PurchaseOrderItem_PurchaseOrder] FOREIGN KEY([PurchaseOrderID])
REFERENCES [dbo].[PurchaseOrder] ([PurchaseOrderID])
GO
ALTER TABLE [dbo].[PurchaseOrderItem] CHECK CONSTRAINT [FK_PurchaseOrderItem_PurchaseOrder]
GO
ALTER TABLE [dbo].[SalesInvoice]  WITH CHECK ADD  CONSTRAINT [FK_SalesInvoice_SalesOrder] FOREIGN KEY([SalesOrderID])
REFERENCES [dbo].[SalesOrder] ([SalesOrderID])
GO
ALTER TABLE [dbo].[SalesInvoice] CHECK CONSTRAINT [FK_SalesInvoice_SalesOrder]
GO
ALTER TABLE [dbo].[SalesInvoiceItem]  WITH CHECK ADD  CONSTRAINT [FK_SalesInvoiceItem_SalesInvoice] FOREIGN KEY([SalesInvoiceID])
REFERENCES [dbo].[SalesInvoice] ([SalesInvoiceID])
GO
ALTER TABLE [dbo].[SalesInvoiceItem] CHECK CONSTRAINT [FK_SalesInvoiceItem_SalesInvoice]
GO
ALTER TABLE [dbo].[SalesInvoiceItem]  WITH CHECK ADD  CONSTRAINT [FK_SalesInvoiceItem_SalesOrderItem] FOREIGN KEY([SalesOrderItemID])
REFERENCES [dbo].[SalesOrderItem] ([SalesOrderItemID])
GO
ALTER TABLE [dbo].[SalesInvoiceItem] CHECK CONSTRAINT [FK_SalesInvoiceItem_SalesOrderItem]
GO
ALTER TABLE [dbo].[SalesOrder]  WITH CHECK ADD  CONSTRAINT [FK_SalesOrder_Costumer] FOREIGN KEY([CostumerID])
REFERENCES [dbo].[Costumer] ([CostumerID])
GO
ALTER TABLE [dbo].[SalesOrder] CHECK CONSTRAINT [FK_SalesOrder_Costumer]
GO
ALTER TABLE [dbo].[SalesOrder]  WITH CHECK ADD  CONSTRAINT [FK_SalesOrder_Employees] FOREIGN KEY([EmployeeID])
REFERENCES [dbo].[Employees] ([EmployeeID])
GO
ALTER TABLE [dbo].[SalesOrder] CHECK CONSTRAINT [FK_SalesOrder_Employees]
GO
ALTER TABLE [dbo].[SalesOrderItem]  WITH CHECK ADD  CONSTRAINT [FK_SalesOrderItem_Products] FOREIGN KEY([ProductID])
REFERENCES [dbo].[Products] ([ProductID])
GO
ALTER TABLE [dbo].[SalesOrderItem] CHECK CONSTRAINT [FK_SalesOrderItem_Products]
GO
ALTER TABLE [dbo].[SalesOrderItem]  WITH CHECK ADD  CONSTRAINT [FK_SalesOrderItem_SalesOrder] FOREIGN KEY([SalesOrderID])
REFERENCES [dbo].[SalesOrder] ([SalesOrderID])
GO
ALTER TABLE [dbo].[SalesOrderItem] CHECK CONSTRAINT [FK_SalesOrderItem_SalesOrder]
GO
ALTER TABLE [dbo].[SalesOrderWarehouse]  WITH CHECK ADD  CONSTRAINT [FK_SalesOrderWarehouse_SalesOrderItem] FOREIGN KEY([SalesOrderItemID])
REFERENCES [dbo].[SalesOrderItem] ([SalesOrderItemID])
GO
ALTER TABLE [dbo].[SalesOrderWarehouse] CHECK CONSTRAINT [FK_SalesOrderWarehouse_SalesOrderItem]
GO
ALTER TABLE [dbo].[SalesOrderWarehouse]  WITH CHECK ADD  CONSTRAINT [FK_SalesOrderWarehouse_Warehouses] FOREIGN KEY([WarehouseID])
REFERENCES [dbo].[Warehouses] ([WarehouseID])
GO
ALTER TABLE [dbo].[SalesOrderWarehouse] CHECK CONSTRAINT [FK_SalesOrderWarehouse_Warehouses]
GO
ALTER TABLE [dbo].[WarehouseProducts]  WITH CHECK ADD  CONSTRAINT [FK_WarehouseProducts_Products] FOREIGN KEY([ProductID])
REFERENCES [dbo].[Products] ([ProductID])
GO
ALTER TABLE [dbo].[WarehouseProducts] CHECK CONSTRAINT [FK_WarehouseProducts_Products]
GO
ALTER TABLE [dbo].[WarehouseProducts]  WITH CHECK ADD  CONSTRAINT [FK_WarehouseProducts_Warehouses] FOREIGN KEY([WarehouseID])
REFERENCES [dbo].[Warehouses] ([WarehouseID])
GO
ALTER TABLE [dbo].[WarehouseProducts] CHECK CONSTRAINT [FK_WarehouseProducts_Warehouses]
GO
ALTER TABLE [dbo].[Warehouses]  WITH CHECK ADD  CONSTRAINT [FK_Warehouses_Branches] FOREIGN KEY([BranchID])
REFERENCES [dbo].[Branches] ([BranchID])
GO
ALTER TABLE [dbo].[Warehouses] CHECK CONSTRAINT [FK_Warehouses_Branches]
GO
