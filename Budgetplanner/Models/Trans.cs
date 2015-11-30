using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Budgetplanner.Models
{
    public class Trans
    {
        public int id { get; set; }
        public int AccountId { get; set; }
        public string UserId { get; set; }
        public int TypeId { get; set; }
        public decimal Amount { get; set; }
        public decimal ReconcileAmount { get; set; }
        public string Description_t { get; set; }
        public int year_t { get; set; }
        public int month_t { get; set; }
        public int day_t { get; set; }
    }
}