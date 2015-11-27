namespace Budgetplanner.Models
{
    using System;
    using System.Data.Entity;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    public partial class Model1 : DbContext
    {
        public Model1()
            : base("name=Model1")
        {
        }

        public virtual DbSet<C__MigrationHistory> C__MigrationHistory { get; set; }
        public virtual DbSet<AspNetRole> AspNetRoles { get; set; }
        public virtual DbSet<AspNetUserClaim> AspNetUserClaims { get; set; }
        public virtual DbSet<AspNetUserLogin> AspNetUserLogins { get; set; }
        public virtual DbSet<AspNetUser> AspNetUsers { get; set; }
        public virtual DbSet<BankAccount> BankAccounts { get; set; }
        public virtual DbSet<Budget> Budgets { get; set; }
        public virtual DbSet<Household> Households { get; set; }
        public virtual DbSet<Transaction> Transactions { get; set; }
        public virtual DbSet<TransactionType> TransactionTypes { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AspNetRole>()
                .HasMany(e => e.AspNetUsers)
                .WithMany(e => e.AspNetRoles)
                .Map(m => m.ToTable("AspNetUserRoles").MapLeftKey("RoleId").MapRightKey("UserId"));

            modelBuilder.Entity<AspNetUser>()
                .HasMany(e => e.AspNetUserClaims)
                .WithRequired(e => e.AspNetUser)
                .HasForeignKey(e => e.UserId);

            modelBuilder.Entity<AspNetUser>()
                .HasMany(e => e.AspNetUserLogins)
                .WithRequired(e => e.AspNetUser)
                .HasForeignKey(e => e.UserId);

            modelBuilder.Entity<AspNetUser>()
                .HasMany(e => e.Transactions)
                .WithOptional(e => e.AspNetUser)
                .HasForeignKey(e => e.UserId);

            modelBuilder.Entity<BankAccount>()
                .HasMany(e => e.Transactions)
                .WithRequired(e => e.BankAccount)
                .HasForeignKey(e => e.AccountId);

            modelBuilder.Entity<Household>()
                .HasMany(e => e.AspNetUsers)
                .WithOptional(e => e.Household)
                .HasForeignKey(e => e.HouseId);

            modelBuilder.Entity<Household>()
                .HasMany(e => e.BankAccounts)
                .WithOptional(e => e.Household)
                .HasForeignKey(e => e.Household_id);

            modelBuilder.Entity<Household>()
                .HasMany(e => e.Budgets)
                .WithRequired(e => e.Household)
                .HasForeignKey(e => e.HouseId);

            modelBuilder.Entity<TransactionType>()
                .HasMany(e => e.Budgets)
                .WithRequired(e => e.TransactionType)
                .HasForeignKey(e => e.TypeId);

            modelBuilder.Entity<TransactionType>()
                .HasMany(e => e.Transactions)
                .WithRequired(e => e.TransactionType)
                .HasForeignKey(e => e.TypeId);
        }
    }
}
