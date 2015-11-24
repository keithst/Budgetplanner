using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Budgetplanner.Models
{
    public class Transaction
    {
        public int id { get; set; }
        public int AccountId { get; set; }
        public string UserId { get; set; }
        public int TypeId { get; set; }
        public decimal Amount { get; set; }
        public decimal ReconcileAmount { get; set; }
        public string Description { get; set; }
        public int year { get; set; }
        public int month { get; set; }
        public int day { get; set; }

        public virtual TransactionType Type { get; set; }
        public virtual ApplicationUser User { get; set; }
        public virtual BankAccount Account { get; set; }
    }
}