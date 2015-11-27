using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Budgetplanner.Models
{
    public class BankAccount
    {
        public BankAccount()
        {
            this.Trans = new HashSet<Transaction>();
        }
        public int id { get; set; }
        public bool isDeleted { get; set; }
        public decimal Total { get; set; }
        public string Description_ba { get; set; }

        public virtual ICollection<Transaction> Trans { get; set; }
    }
}