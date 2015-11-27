using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Budgetplanner.Models
{
    public class Account
    {
        public int id { get; set; }
        public decimal Total { get; set; }
        public int Household_id { get; set; }
        public string Description_ba { get; set; }
        public bool isDeleted { get; set; }
    }
}