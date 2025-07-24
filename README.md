
# 🧾 Mini POS System - Bridging Business Logic and Software

This Mini POS (Point of Sale) system was built to simulate real business operations across **sales**, **procurement**, **warehousing**, and **reporting**, integrating enterprise-level logic into a full-stack web application.

The project was developed during my internship at **Global Auto** under the guidance of **Eng. Ahmed Karem**, with a primary focus on aligning **software architecture with actual business workflows**.

---

## Purpose

To understand and implement how business logic and software architecture work hand-in-hand—through:

- Process flow modeling
- Database design and normalization
- Backend architecture aligned with operational rules
- Internal + external reporting systems
- BI (Business Intelligence) modeling and analysis

---

##  Features

###  Authentication & Roles
- Login system with session-based and database-based Role Access Matrix
- Three roles:
  - **Sales Executive**
  - **Procurement Officer**
  - **Warehouse Manager**
- Branch-based data visibility and operations

### 🛒 Sales Workflow
- Customer search or creation
- Product selection and order creation
- Order editing (update quantity, remove/add items)
- Partial invoice generation (select specific items/quantities)
- Invoice crediting by selecting credited items → generates a credited invoice

### Procurement & Warehousing
- Procurement Officer creates Purchase Orders (POs)
- Receives PO invoices with prices from vendors
- Warehouse Manager:
  - Views PO invoices & Sales Orders for their branch
  - Allocates items to specific warehouses
  - Average cost updated dynamically using:
    ```
    NewAvgCost = ((OldQty * OldAvgCost) + (NewQty * NewPOPrice)) / TotalQty
    ```

### Reporting
- Internal reports using Chart.js and Bootstrap
- External reports using:
  - **SSRS (SQL Server Reporting Services)**
  - **Report Builder**
  - **ASP.NET WebForms ReportViewer**
  - Integrated with MVC via dynamic ASPX embedding

###  Business Intelligence
- Power BI dashboard
- Star schema model built on SQL data
- DAX measures and calculated fields for deep analysis

###  Data Integrity & Logs
- Transactions handled with commit/rollback
- Audit tables using SQL Triggers to track:
  - Insertions
  - Updates
  - Deletions

---

##  Tech Stack

| Layer         | Tools / Frameworks                            |
|---------------|-----------------------------------------------|
| Frontend      | HTML, Bootstrap 5, JavaScript, jQuery, Chart.js |
| Backend       | ASP.NET Core MVC, ASP.NET WebForms, C#        |
| Database      | SQL Server, Stored Procedures, EF Core        |
| Reporting     | SSRS, Report Builder, ASPX (ReportViewer)     |
| Data Access   | Microsoft.Data.SqlClient, DTOs                |
| Business Intel| Microsoft Power BI, DAX, Star Schema          |

---

## 🛠 Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/minipos-system.git
   ```

2. Restore NuGet packages:
   ```bash
   dotnet restore
   ```

3. Update the connection string in `appsettings.json` to point to your SQL Server instance.

4. Run database migrations or use provided SQL scripts to create and seed the database.

5. Build and run the project:
   ```bash
   dotnet run
   ```

6. To run reports:
   - Deploy `.rdl` files to SSRS Server
   - Link ASPX pages to the report path
   - Ensure SSRS service is running and accessible

---

## Reflection

This project helped me bridge the gap between theoretical concepts and real-world business applications. It strengthened my understanding of how database design, software development, and business logic intersect to form robust systems that serve real needs.

---

##  License

This project is for educational purposes and demonstration only.
