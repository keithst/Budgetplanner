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
        public string AccountNum { get; set; }
        public decimal Total { get; set; }
        public string Description { get; set; }

        public virtual ICollection<Transaction> Trans { get; set; }
    }
}