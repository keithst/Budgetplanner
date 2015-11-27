using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Budgetplanner.Models
{
    public class HouseUser
    {
        public string Id { get; set; }
        public string fname { get; set; }
        public string lname { get; set; }
        public int HouseId { get; set; }
        public bool isHoH { get; set; }
        public bool isInvited { get; set; }
    }
}