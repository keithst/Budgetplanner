namespace Budgetplanner.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Transaction
    {
        public int id { get; set; }

        public int AccountId { get; set; }

        public int TypeId { get; set; }

        public decimal Amount { get; set; }

        public decimal ReconcileAmount { get; set; }

        [StringLength(128)]
        public string UserId { get; set; }

        public string Description_t { get; set; }

        public int year_t { get; set; }

        public int month_t { get; set; }

        public int day_t { get; set; }

        public virtual AspNetUser AspNetUser { get; set; }

        public virtual BankAccount BankAccount { get; set; }

        public virtual TransactionType TransactionType { get; set; }
    }
}
