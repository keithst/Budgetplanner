namespace Budgetplanner.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class BankAccount
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public BankAccount()
        {
            Transactions = new HashSet<Transaction>();
        }

        public int id { get; set; }

        public decimal Total { get; set; }

        public int? Household_id { get; set; }

        public string Description_ba { get; set; }

        public bool isDeleted { get; set; }

        public virtual Household Household { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Transaction> Transactions { get; set; }
    }
}
