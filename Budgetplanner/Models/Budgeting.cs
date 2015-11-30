using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Budgetplanner.Models
{
    public class Budgeting
    {
        public int id { get; set; }
        public int TypeId { get; set; }
        public int HouseId { get; set; }
        public decimal Amount { get; set; }
        public int year_b { get; set; }
        public int month_b { get; set; }
    }
}