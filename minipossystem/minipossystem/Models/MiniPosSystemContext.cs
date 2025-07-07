using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace minipossystem.Models;

public partial class MiniPosSystemContext : DbContext
{
    public MiniPosSystemContext()
    {
    }

    public MiniPosSystemContext(DbContextOptions<MiniPosSystemContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Branch> Branches { get; set; }

    public virtual DbSet<Company> Companies { get; set; }

    public virtual DbSet<Costumer> Costumers { get; set; }

    public virtual DbSet<CreditNote> CreditNotes { get; set; }

    public virtual DbSet<CreditNoteItem> CreditNoteItems { get; set; }

    public virtual DbSet<Employee> Employees { get; set; }

    public virtual DbSet<Product> Products { get; set; }

    public virtual DbSet<PurchaseOrder> PurchaseOrders { get; set; }

    public virtual DbSet<PurchaseOrderInvoice> PurchaseOrderInvoices { get; set; }

    public virtual DbSet<PurchaseOrderInvoiceItem> PurchaseOrderInvoiceItems { get; set; }

    public virtual DbSet<PurchaseOrderItem> PurchaseOrderItems { get; set; }

    public virtual DbSet<SalesInvoice> SalesInvoices { get; set; }

    public virtual DbSet<SalesInvoiceItem> SalesInvoiceItems { get; set; }

    public virtual DbSet<SalesOrder> SalesOrders { get; set; }

    public virtual DbSet<SalesOrderItem> SalesOrderItems { get; set; }

    public virtual DbSet<SalesOrderWarehouse> SalesOrderWarehouses { get; set; }

    public virtual DbSet<Vendor> Vendors { get; set; }

    public virtual DbSet<Warehouse> Warehouses { get; set; }

    public virtual DbSet<WarehouseProduct> WarehouseProducts { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=DESKTOP-S1HVK3I;Database=mini-pos-system;Trusted_Connection=True;Encrypt=False;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Branch>(entity =>
        {
            entity.Property(e => e.BranchId).HasColumnName("BranchID");
            entity.Property(e => e.BranchAddress)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.BranchName)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.CompanyId).HasColumnName("CompanyID");

            entity.HasOne(d => d.Company).WithMany(p => p.Branches)
                .HasForeignKey(d => d.CompanyId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Branches_Company");
        });

        modelBuilder.Entity<Company>(entity =>
        {
            entity.ToTable("Company");

            entity.Property(e => e.CompanyId).HasColumnName("CompanyID");
            entity.Property(e => e.CompanyAddress)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.CompanyContactInfo)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.CompanyName)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Costumer>(entity =>
        {
            entity.ToTable("Costumer");

            entity.Property(e => e.CostumerId).HasColumnName("CostumerID");
            entity.Property(e => e.CostumerContactInfo)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.CostumerName)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<CreditNote>(entity =>
        {
            entity.ToTable("CreditNote");

            entity.Property(e => e.CreditNoteId).HasColumnName("CreditNoteID");
            entity.Property(e => e.EmployeeId).HasColumnName("EmployeeID");
            entity.Property(e => e.Price).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.SalesInvoiceId).HasColumnName("SalesInvoiceID");

            entity.HasOne(d => d.Employee).WithMany(p => p.CreditNotes)
                .HasForeignKey(d => d.EmployeeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CreditNote_Employees");

            entity.HasOne(d => d.SalesInvoice).WithMany(p => p.CreditNotes)
                .HasForeignKey(d => d.SalesInvoiceId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CreditNote_SalesInvoice");
        });

        modelBuilder.Entity<CreditNoteItem>(entity =>
        {
            entity.ToTable("CreditNoteItem");

            entity.Property(e => e.CreditNoteItemId).HasColumnName("CreditNoteItemID");
            entity.Property(e => e.CreditNoteId).HasColumnName("CreditNoteID");
            entity.Property(e => e.InvoiceItemId).HasColumnName("InvoiceItemID");
            entity.Property(e => e.Price).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.CreditNote).WithMany(p => p.CreditNoteItems)
                .HasForeignKey(d => d.CreditNoteId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CreditNoteItem_CreditNote");

            entity.HasOne(d => d.InvoiceItem).WithMany(p => p.CreditNoteItems)
                .HasForeignKey(d => d.InvoiceItemId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CreditNoteItem_SalesInvoiceItem");
        });

        modelBuilder.Entity<Employee>(entity =>
        {
            entity.Property(e => e.EmployeeId).HasColumnName("EmployeeID");
            entity.Property(e => e.BranchId).HasColumnName("BranchID");
            entity.Property(e => e.EmployeeContactInfo)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.EmployeeRole)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.Branch).WithMany(p => p.Employees)
                .HasForeignKey(d => d.BranchId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Employees_Branches");
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.Property(e => e.ProductId).HasColumnName("ProductID");
            entity.Property(e => e.Description)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.ProductCode)
                .HasMaxLength(25)
                .IsUnicode(false);
            entity.Property(e => e.SellingPrice).HasColumnType("decimal(18, 2)");
        });

        modelBuilder.Entity<PurchaseOrder>(entity =>
        {
            entity.ToTable("PurchaseOrder");

            entity.Property(e => e.PurchaseOrderId).HasColumnName("PurchaseOrderID");
            entity.Property(e => e.EmployeeId).HasColumnName("EmployeeID");
            entity.Property(e => e.Price).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.VendorId).HasColumnName("VendorID");

            entity.HasOne(d => d.Employee).WithMany(p => p.PurchaseOrders)
                .HasForeignKey(d => d.EmployeeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PurchaseOrder_Employees");

            entity.HasOne(d => d.Vendor).WithMany(p => p.PurchaseOrders)
                .HasForeignKey(d => d.VendorId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PurchaseOrder_Vendors");
        });

        modelBuilder.Entity<PurchaseOrderInvoice>(entity =>
        {
            entity.ToTable("PurchaseOrderInvoice");

            entity.Property(e => e.PurchaseOrderInvoiceId).HasColumnName("PurchaseOrderInvoiceID");
            entity.Property(e => e.Price).HasColumnType("decimal(18, 0)");
            entity.Property(e => e.PurchaseOrderId).HasColumnName("PurchaseOrderID");

            entity.HasOne(d => d.PurchaseOrder).WithMany(p => p.PurchaseOrderInvoices)
                .HasForeignKey(d => d.PurchaseOrderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PurchaseOrderInvoice_PurchaseOrder");
        });

        modelBuilder.Entity<PurchaseOrderInvoiceItem>(entity =>
        {
            entity.HasKey(e => e.PurchaseInvoiceItemId);

            entity.ToTable("PurchaseOrderInvoiceItem");

            entity.Property(e => e.PurchaseInvoiceItemId).HasColumnName("purchaseInvoiceItemID");
            entity.Property(e => e.BranchId).HasColumnName("BranchID");
            entity.Property(e => e.EmployeeId).HasColumnName("EmployeeID");
            entity.Property(e => e.Price).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.PurchaseOrderInvoiceId).HasColumnName("PurchaseOrderInvoiceID");
            entity.Property(e => e.PurchaseOrderItemId).HasColumnName("PurchaseOrderItemID");

            entity.HasOne(d => d.Branch).WithMany(p => p.PurchaseOrderInvoiceItems)
                .HasForeignKey(d => d.BranchId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PurchaseOrderInvoiceItem_Branches");

            entity.HasOne(d => d.Employee).WithMany(p => p.PurchaseOrderInvoiceItems)
                .HasForeignKey(d => d.EmployeeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PurchaseOrderInvoiceItem_Employees");

            entity.HasOne(d => d.PurchaseOrderInvoice).WithMany(p => p.PurchaseOrderInvoiceItems)
                .HasForeignKey(d => d.PurchaseOrderInvoiceId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PurchaseOrderInvoiceItem_PurchaseOrderInvoice");

            entity.HasOne(d => d.PurchaseOrderItem).WithMany(p => p.PurchaseOrderInvoiceItems)
                .HasForeignKey(d => d.PurchaseOrderItemId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PurchaseOrderInvoiceItem_PurchaseOrderItem");
        });

        modelBuilder.Entity<PurchaseOrderItem>(entity =>
        {
            entity.ToTable("PurchaseOrderItem");

            entity.Property(e => e.PurchaseOrderItemId).HasColumnName("PurchaseOrderItemID");
            entity.Property(e => e.Price).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.ProductId).HasColumnName("ProductID");
            entity.Property(e => e.PurchaseOrderId).HasColumnName("PurchaseOrderID");

            entity.HasOne(d => d.Product).WithMany(p => p.PurchaseOrderItems)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PurchaseOrderItem_Products");

            entity.HasOne(d => d.PurchaseOrder).WithMany(p => p.PurchaseOrderItems)
                .HasForeignKey(d => d.PurchaseOrderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PurchaseOrderItem_PurchaseOrder");
        });

        modelBuilder.Entity<SalesInvoice>(entity =>
        {
            entity.ToTable("SalesInvoice");

            entity.Property(e => e.SalesInvoiceId).HasColumnName("SalesInvoiceID");
            entity.Property(e => e.Price).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.SalesOrderId).HasColumnName("SalesOrderID");

            entity.HasOne(d => d.SalesOrder).WithMany(p => p.SalesInvoices)
                .HasForeignKey(d => d.SalesOrderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SalesInvoice_SalesOrder");
        });

        modelBuilder.Entity<SalesInvoiceItem>(entity =>
        {
            entity.HasKey(e => e.SalesInvoiceItmeId);

            entity.ToTable("SalesInvoiceItem");

            entity.Property(e => e.SalesInvoiceItmeId).HasColumnName("SalesInvoiceItmeID");
            entity.Property(e => e.SalesInvoiceId).HasColumnName("SalesInvoiceID");
            entity.Property(e => e.SalesOrderItemId).HasColumnName("SalesOrderItemID");

            entity.HasOne(d => d.SalesInvoice).WithMany(p => p.SalesInvoiceItems)
                .HasForeignKey(d => d.SalesInvoiceId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SalesInvoiceItem_SalesInvoice");

            entity.HasOne(d => d.SalesOrderItem).WithMany(p => p.SalesInvoiceItems)
                .HasForeignKey(d => d.SalesOrderItemId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SalesInvoiceItem_SalesOrderItem");
        });

        modelBuilder.Entity<SalesOrder>(entity =>
        {
            entity.ToTable("SalesOrder");

            entity.Property(e => e.SalesOrderId).HasColumnName("SalesOrderID");
            entity.Property(e => e.CostumerId).HasColumnName("CostumerID");
            entity.Property(e => e.EmployeeId).HasColumnName("EmployeeID");
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.Costumer).WithMany(p => p.SalesOrders)
                .HasForeignKey(d => d.CostumerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SalesOrder_Costumer");

            entity.HasOne(d => d.Employee).WithMany(p => p.SalesOrders)
                .HasForeignKey(d => d.EmployeeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SalesOrder_Employees");
        });

        modelBuilder.Entity<SalesOrderItem>(entity =>
        {
            entity.ToTable("SalesOrderItem");

            entity.Property(e => e.SalesOrderItemId).HasColumnName("SalesOrderItemID");
            entity.Property(e => e.Price).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.ProductId).HasColumnName("ProductID");
            entity.Property(e => e.SalesOrderId).HasColumnName("SalesOrderID");

            entity.HasOne(d => d.Product).WithMany(p => p.SalesOrderItems)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SalesOrderItem_Products");

            entity.HasOne(d => d.SalesOrder).WithMany(p => p.SalesOrderItems)
                .HasForeignKey(d => d.SalesOrderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SalesOrderItem_SalesOrder");
        });

        modelBuilder.Entity<SalesOrderWarehouse>(entity =>
        {
            entity.ToTable("SalesOrderWarehouse");

            entity.Property(e => e.SalesOrderWarehouseId).HasColumnName("SalesOrderWarehouseID");
            entity.Property(e => e.SalesOrderItemId).HasColumnName("SalesOrderItemID");
            entity.Property(e => e.WarehouseId).HasColumnName("WarehouseID");

            entity.HasOne(d => d.SalesOrderItem).WithMany(p => p.SalesOrderWarehouses)
                .HasForeignKey(d => d.SalesOrderItemId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SalesOrderWarehouse_SalesOrderItem");

            entity.HasOne(d => d.Warehouse).WithMany(p => p.SalesOrderWarehouses)
                .HasForeignKey(d => d.WarehouseId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SalesOrderWarehouse_Warehouses");
        });

        modelBuilder.Entity<Vendor>(entity =>
        {
            entity.Property(e => e.VendorId).HasColumnName("VendorID");
            entity.Property(e => e.ContactInfo)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.VendorName)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Warehouse>(entity =>
        {
            entity.Property(e => e.WarehouseId).HasColumnName("WarehouseID");
            entity.Property(e => e.BranchId).HasColumnName("BranchID");
            entity.Property(e => e.WarehouseName)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.Branch).WithMany(p => p.Warehouses)
                .HasForeignKey(d => d.BranchId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Warehouses_Branches");
        });

        modelBuilder.Entity<WarehouseProduct>(entity =>
        {
            entity.Property(e => e.Price).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.ProductId).HasColumnName("ProductID");
            entity.Property(e => e.WarehouseId).HasColumnName("WarehouseID");

            entity.HasOne(d => d.Product).WithMany(p => p.WarehouseProducts)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_WarehouseProducts_Products");

            entity.HasOne(d => d.Warehouse).WithMany(p => p.WarehouseProducts)
                .HasForeignKey(d => d.WarehouseId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_WarehouseProducts_Warehouses");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
