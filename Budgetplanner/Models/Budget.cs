namespace Budgetplanner.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Budget
    {
        public int id { get; set; }

        public int TypeId { get; set; }

        public int HouseId { get; set; }

        public decimal Amount { get; set; }

        public int year_b { get; set; }

        public int month_b { get; set; }

        public virtual Household Household { get; set; }

        public virtual TransactionType TransactionType { get; set; }
    }
}
