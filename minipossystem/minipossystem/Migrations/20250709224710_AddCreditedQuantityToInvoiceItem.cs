using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace minipossystem.Migrations
{
    /// <inheritdoc />
    public partial class AddCreditedQuantityToInvoiceItem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Company",
                columns: table => new
                {
                    CompanyID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CompanyName = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    CompanyAddress = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    CompanyContactInfo = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Company", x => x.CompanyID);
                });

            migrationBuilder.CreateTable(
                name: "Costumer",
                columns: table => new
                {
                    CostumerID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CostumerName = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    CostumerContactInfo = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Costumer", x => x.CostumerID);
                });

            migrationBuilder.CreateTable(
                name: "Products",
                columns: table => new
                {
                    ProductID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Description = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false),
                    SellingPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ProductCode = table.Column<string>(type: "varchar(25)", unicode: false, maxLength: 25, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Products", x => x.ProductID);
                });

            migrationBuilder.CreateTable(
                name: "Vendors",
                columns: table => new
                {
                    VendorID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    VendorName = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    ContactInfo = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vendors", x => x.VendorID);
                });

            migrationBuilder.CreateTable(
                name: "Branches",
                columns: table => new
                {
                    BranchID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BranchName = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    BranchAddress = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    CompanyID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Branches", x => x.BranchID);
                    table.ForeignKey(
                        name: "FK_Branches_Company",
                        column: x => x.CompanyID,
                        principalTable: "Company",
                        principalColumn: "CompanyID");
                });

            migrationBuilder.CreateTable(
                name: "Employees",
                columns: table => new
                {
                    EmployeeID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EmployeeRole = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    EmployeeContactInfo = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    BranchID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Employees", x => x.EmployeeID);
                    table.ForeignKey(
                        name: "FK_Employees_Branches",
                        column: x => x.BranchID,
                        principalTable: "Branches",
                        principalColumn: "BranchID");
                });

            migrationBuilder.CreateTable(
                name: "Warehouses",
                columns: table => new
                {
                    WarehouseID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    WarehouseName = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    BranchID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Warehouses", x => x.WarehouseID);
                    table.ForeignKey(
                        name: "FK_Warehouses_Branches",
                        column: x => x.BranchID,
                        principalTable: "Branches",
                        principalColumn: "BranchID");
                });

            migrationBuilder.CreateTable(
                name: "PurchaseOrder",
                columns: table => new
                {
                    PurchaseOrderID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    VendorID = table.Column<int>(type: "int", nullable: false),
                    EmployeeID = table.Column<int>(type: "int", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Date = table.Column<DateOnly>(type: "date", nullable: true),
                    Status = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PurchaseOrder", x => x.PurchaseOrderID);
                    table.ForeignKey(
                        name: "FK_PurchaseOrder_Employees",
                        column: x => x.EmployeeID,
                        principalTable: "Employees",
                        principalColumn: "EmployeeID");
                    table.ForeignKey(
                        name: "FK_PurchaseOrder_Vendors",
                        column: x => x.VendorID,
                        principalTable: "Vendors",
                        principalColumn: "VendorID");
                });

            migrationBuilder.CreateTable(
                name: "SalesOrder",
                columns: table => new
                {
                    SalesOrderID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CostumerID = table.Column<int>(type: "int", nullable: false),
                    EmployeeID = table.Column<int>(type: "int", nullable: false),
                    OrderDate = table.Column<DateOnly>(type: "date", nullable: false),
                    Status = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SalesOrder", x => x.SalesOrderID);
                    table.ForeignKey(
                        name: "FK_SalesOrder_Costumer",
                        column: x => x.CostumerID,
                        principalTable: "Costumer",
                        principalColumn: "CostumerID");
                    table.ForeignKey(
                        name: "FK_SalesOrder_Employees",
                        column: x => x.EmployeeID,
                        principalTable: "Employees",
                        principalColumn: "EmployeeID");
                });

            migrationBuilder.CreateTable(
                name: "WarehouseProducts",
                columns: table => new
                {
                    WarehouseProductId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    WarehouseID = table.Column<int>(type: "int", nullable: false),
                    ProductID = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WarehouseProducts", x => x.WarehouseProductId);
                    table.ForeignKey(
                        name: "FK_WarehouseProducts_Products",
                        column: x => x.ProductID,
                        principalTable: "Products",
                        principalColumn: "ProductID");
                    table.ForeignKey(
                        name: "FK_WarehouseProducts_Warehouses",
                        column: x => x.WarehouseID,
                        principalTable: "Warehouses",
                        principalColumn: "WarehouseID");
                });

            migrationBuilder.CreateTable(
                name: "PurchaseOrderInvoice",
                columns: table => new
                {
                    PurchaseOrderInvoiceID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PurchaseOrderID = table.Column<int>(type: "int", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,0)", nullable: false),
                    Date = table.Column<DateOnly>(type: "date", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PurchaseOrderInvoice", x => x.PurchaseOrderInvoiceID);
                    table.ForeignKey(
                        name: "FK_PurchaseOrderInvoice_PurchaseOrder",
                        column: x => x.PurchaseOrderID,
                        principalTable: "PurchaseOrder",
                        principalColumn: "PurchaseOrderID");
                });

            migrationBuilder.CreateTable(
                name: "PurchaseOrderItem",
                columns: table => new
                {
                    PurchaseOrderItemID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PurchaseOrderID = table.Column<int>(type: "int", nullable: false),
                    ProductID = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PurchaseOrderItem", x => x.PurchaseOrderItemID);
                    table.ForeignKey(
                        name: "FK_PurchaseOrderItem_Products",
                        column: x => x.ProductID,
                        principalTable: "Products",
                        principalColumn: "ProductID");
                    table.ForeignKey(
                        name: "FK_PurchaseOrderItem_PurchaseOrder",
                        column: x => x.PurchaseOrderID,
                        principalTable: "PurchaseOrder",
                        principalColumn: "PurchaseOrderID");
                });

            migrationBuilder.CreateTable(
                name: "SalesInvoice",
                columns: table => new
                {
                    SalesInvoiceID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SalesOrderID = table.Column<int>(type: "int", nullable: false),
                    InvoiveDate = table.Column<DateOnly>(type: "date", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SalesInvoice", x => x.SalesInvoiceID);
                    table.ForeignKey(
                        name: "FK_SalesInvoice_SalesOrder",
                        column: x => x.SalesOrderID,
                        principalTable: "SalesOrder",
                        principalColumn: "SalesOrderID");
                });

            migrationBuilder.CreateTable(
                name: "SalesOrderItem",
                columns: table => new
                {
                    SalesOrderItemID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SalesOrderID = table.Column<int>(type: "int", nullable: false),
                    ProductID = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SalesOrderItem", x => x.SalesOrderItemID);
                    table.ForeignKey(
                        name: "FK_SalesOrderItem_Products",
                        column: x => x.ProductID,
                        principalTable: "Products",
                        principalColumn: "ProductID");
                    table.ForeignKey(
                        name: "FK_SalesOrderItem_SalesOrder",
                        column: x => x.SalesOrderID,
                        principalTable: "SalesOrder",
                        principalColumn: "SalesOrderID");
                });

            migrationBuilder.CreateTable(
                name: "PurchaseOrderInvoiceItem",
                columns: table => new
                {
                    purchaseInvoiceItemID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PurchaseOrderInvoiceID = table.Column<int>(type: "int", nullable: false),
                    PurchaseOrderItemID = table.Column<int>(type: "int", nullable: false),
                    EmployeeID = table.Column<int>(type: "int", nullable: false),
                    BranchID = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PurchaseOrderInvoiceItem", x => x.purchaseInvoiceItemID);
                    table.ForeignKey(
                        name: "FK_PurchaseOrderInvoiceItem_Branches",
                        column: x => x.BranchID,
                        principalTable: "Branches",
                        principalColumn: "BranchID");
                    table.ForeignKey(
                        name: "FK_PurchaseOrderInvoiceItem_Employees",
                        column: x => x.EmployeeID,
                        principalTable: "Employees",
                        principalColumn: "EmployeeID");
                    table.ForeignKey(
                        name: "FK_PurchaseOrderInvoiceItem_PurchaseOrderInvoice",
                        column: x => x.PurchaseOrderInvoiceID,
                        principalTable: "PurchaseOrderInvoice",
                        principalColumn: "PurchaseOrderInvoiceID");
                    table.ForeignKey(
                        name: "FK_PurchaseOrderInvoiceItem_PurchaseOrderItem",
                        column: x => x.PurchaseOrderItemID,
                        principalTable: "PurchaseOrderItem",
                        principalColumn: "PurchaseOrderItemID");
                });

            migrationBuilder.CreateTable(
                name: "CreditNote",
                columns: table => new
                {
                    CreditNoteID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SalesInvoiceID = table.Column<int>(type: "int", nullable: false),
                    Date = table.Column<DateOnly>(type: "date", nullable: false),
                    EmployeeID = table.Column<int>(type: "int", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CreditNote", x => x.CreditNoteID);
                    table.ForeignKey(
                        name: "FK_CreditNote_Employees",
                        column: x => x.EmployeeID,
                        principalTable: "Employees",
                        principalColumn: "EmployeeID");
                    table.ForeignKey(
                        name: "FK_CreditNote_SalesInvoice",
                        column: x => x.SalesInvoiceID,
                        principalTable: "SalesInvoice",
                        principalColumn: "SalesInvoiceID");
                });

            migrationBuilder.CreateTable(
                name: "SalesInvoiceItem",
                columns: table => new
                {
                    SalesInvoiceItmeID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SalesInvoiceID = table.Column<int>(type: "int", nullable: false),
                    SalesOrderItemID = table.Column<int>(type: "int", nullable: false),
                    CreditedQuantity = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SalesInvoiceItem", x => x.SalesInvoiceItmeID);
                    table.ForeignKey(
                        name: "FK_SalesInvoiceItem_SalesInvoice",
                        column: x => x.SalesInvoiceID,
                        principalTable: "SalesInvoice",
                        principalColumn: "SalesInvoiceID");
                    table.ForeignKey(
                        name: "FK_SalesInvoiceItem_SalesOrderItem",
                        column: x => x.SalesOrderItemID,
                        principalTable: "SalesOrderItem",
                        principalColumn: "SalesOrderItemID");
                });

            migrationBuilder.CreateTable(
                name: "SalesOrderWarehouse",
                columns: table => new
                {
                    SalesOrderWarehouseID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SalesOrderItemID = table.Column<int>(type: "int", nullable: false),
                    WarehouseID = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SalesOrderWarehouse", x => x.SalesOrderWarehouseID);
                    table.ForeignKey(
                        name: "FK_SalesOrderWarehouse_SalesOrderItem",
                        column: x => x.SalesOrderItemID,
                        principalTable: "SalesOrderItem",
                        principalColumn: "SalesOrderItemID");
                    table.ForeignKey(
                        name: "FK_SalesOrderWarehouse_Warehouses",
                        column: x => x.WarehouseID,
                        principalTable: "Warehouses",
                        principalColumn: "WarehouseID");
                });

            migrationBuilder.CreateTable(
                name: "CreditNoteItem",
                columns: table => new
                {
                    CreditNoteItemID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreditNoteID = table.Column<int>(type: "int", nullable: false),
                    InvoiceItemID = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CreditNoteItem", x => x.CreditNoteItemID);
                    table.ForeignKey(
                        name: "FK_CreditNoteItem_CreditNote",
                        column: x => x.CreditNoteID,
                        principalTable: "CreditNote",
                        principalColumn: "CreditNoteID");
                    table.ForeignKey(
                        name: "FK_CreditNoteItem_SalesInvoiceItem",
                        column: x => x.InvoiceItemID,
                        principalTable: "SalesInvoiceItem",
                        principalColumn: "SalesInvoiceItmeID");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Branches_CompanyID",
                table: "Branches",
                column: "CompanyID");

            migrationBuilder.CreateIndex(
                name: "IX_CreditNote_EmployeeID",
                table: "CreditNote",
                column: "EmployeeID");

            migrationBuilder.CreateIndex(
                name: "IX_CreditNote_SalesInvoiceID",
                table: "CreditNote",
                column: "SalesInvoiceID");

            migrationBuilder.CreateIndex(
                name: "IX_CreditNoteItem_CreditNoteID",
                table: "CreditNoteItem",
                column: "CreditNoteID");

            migrationBuilder.CreateIndex(
                name: "IX_CreditNoteItem_InvoiceItemID",
                table: "CreditNoteItem",
                column: "InvoiceItemID");

            migrationBuilder.CreateIndex(
                name: "IX_Employees_BranchID",
                table: "Employees",
                column: "BranchID");

            migrationBuilder.CreateIndex(
                name: "IX_PurchaseOrder_EmployeeID",
                table: "PurchaseOrder",
                column: "EmployeeID");

            migrationBuilder.CreateIndex(
                name: "IX_PurchaseOrder_VendorID",
                table: "PurchaseOrder",
                column: "VendorID");

            migrationBuilder.CreateIndex(
                name: "IX_PurchaseOrderInvoice_PurchaseOrderID",
                table: "PurchaseOrderInvoice",
                column: "PurchaseOrderID");

            migrationBuilder.CreateIndex(
                name: "IX_PurchaseOrderInvoiceItem_BranchID",
                table: "PurchaseOrderInvoiceItem",
                column: "BranchID");

            migrationBuilder.CreateIndex(
                name: "IX_PurchaseOrderInvoiceItem_EmployeeID",
                table: "PurchaseOrderInvoiceItem",
                column: "EmployeeID");

            migrationBuilder.CreateIndex(
                name: "IX_PurchaseOrderInvoiceItem_PurchaseOrderInvoiceID",
                table: "PurchaseOrderInvoiceItem",
                column: "PurchaseOrderInvoiceID");

            migrationBuilder.CreateIndex(
                name: "IX_PurchaseOrderInvoiceItem_PurchaseOrderItemID",
                table: "PurchaseOrderInvoiceItem",
                column: "PurchaseOrderItemID");

            migrationBuilder.CreateIndex(
                name: "IX_PurchaseOrderItem_ProductID",
                table: "PurchaseOrderItem",
                column: "ProductID");

            migrationBuilder.CreateIndex(
                name: "IX_PurchaseOrderItem_PurchaseOrderID",
                table: "PurchaseOrderItem",
                column: "PurchaseOrderID");

            migrationBuilder.CreateIndex(
                name: "IX_SalesInvoice_SalesOrderID",
                table: "SalesInvoice",
                column: "SalesOrderID");

            migrationBuilder.CreateIndex(
                name: "IX_SalesInvoiceItem_SalesInvoiceID",
                table: "SalesInvoiceItem",
                column: "SalesInvoiceID");

            migrationBuilder.CreateIndex(
                name: "IX_SalesInvoiceItem_SalesOrderItemID",
                table: "SalesInvoiceItem",
                column: "SalesOrderItemID");

            migrationBuilder.CreateIndex(
                name: "IX_SalesOrder_CostumerID",
                table: "SalesOrder",
                column: "CostumerID");

            migrationBuilder.CreateIndex(
                name: "IX_SalesOrder_EmployeeID",
                table: "SalesOrder",
                column: "EmployeeID");

            migrationBuilder.CreateIndex(
                name: "IX_SalesOrderItem_ProductID",
                table: "SalesOrderItem",
                column: "ProductID");

            migrationBuilder.CreateIndex(
                name: "IX_SalesOrderItem_SalesOrderID",
                table: "SalesOrderItem",
                column: "SalesOrderID");

            migrationBuilder.CreateIndex(
                name: "IX_SalesOrderWarehouse_SalesOrderItemID",
                table: "SalesOrderWarehouse",
                column: "SalesOrderItemID");

            migrationBuilder.CreateIndex(
                name: "IX_SalesOrderWarehouse_WarehouseID",
                table: "SalesOrderWarehouse",
                column: "WarehouseID");

            migrationBuilder.CreateIndex(
                name: "IX_WarehouseProducts_ProductID",
                table: "WarehouseProducts",
                column: "ProductID");

            migrationBuilder.CreateIndex(
                name: "IX_WarehouseProducts_WarehouseID",
                table: "WarehouseProducts",
                column: "WarehouseID");

            migrationBuilder.CreateIndex(
                name: "IX_Warehouses_BranchID",
                table: "Warehouses",
                column: "BranchID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CreditNoteItem");

            migrationBuilder.DropTable(
                name: "PurchaseOrderInvoiceItem");

            migrationBuilder.DropTable(
                name: "SalesOrderWarehouse");

            migrationBuilder.DropTable(
                name: "WarehouseProducts");

            migrationBuilder.DropTable(
                name: "CreditNote");

            migrationBuilder.DropTable(
                name: "SalesInvoiceItem");

            migrationBuilder.DropTable(
                name: "PurchaseOrderInvoice");

            migrationBuilder.DropTable(
                name: "PurchaseOrderItem");

            migrationBuilder.DropTable(
                name: "Warehouses");

            migrationBuilder.DropTable(
                name: "SalesInvoice");

            migrationBuilder.DropTable(
                name: "SalesOrderItem");

            migrationBuilder.DropTable(
                name: "PurchaseOrder");

            migrationBuilder.DropTable(
                name: "Products");

            migrationBuilder.DropTable(
                name: "SalesOrder");

            migrationBuilder.DropTable(
                name: "Vendors");

            migrationBuilder.DropTable(
                name: "Costumer");

            migrationBuilder.DropTable(
                name: "Employees");

            migrationBuilder.DropTable(
                name: "Branches");

            migrationBuilder.DropTable(
                name: "Company");
        }
    }
}
