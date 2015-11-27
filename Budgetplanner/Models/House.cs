using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Budgetplanner.Models
{
    public class House
    {
        public int id { get; set; }
        public string name { get; set; }
        public bool isDeleted { get; set; }
    }
}