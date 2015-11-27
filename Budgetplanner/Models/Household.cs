using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Xml.Serialization;

namespace Budgetplanner.Models
{
    public class Household
    {
        public Household()
        {
            this.Account = new HashSet<BankAccount>();
            this.User = new HashSet<ApplicationUser>();
        }
        public int id { get; set; }
        public string name { get; set; }
        public bool isDeleted { get; set; }

        public virtual ICollection<BankAccount> Account { get; set; }
        public virtual ICollection<ApplicationUser> User { get; set; }
    }
}