using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

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

        public virtual ICollection<BankAccount> Account { get; set; }
        public virtual ICollection<ApplicationUser> User { get; set; }
    }
}