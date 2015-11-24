using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Budgetplanner.Models
{
    public class Budget
    {
        public int id { get; set; }
        public int TypeId { get; set; }
        public int HouseId { get; set; }
        public decimal Amount { get; set; }
        public int year { get; set; }
        public int month { get; set; }

        public virtual Household House { get; set; }
        public virtual TransactionType Type { get; set; }
    }
}