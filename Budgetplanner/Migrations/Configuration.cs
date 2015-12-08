namespace Budgetplanner.Migrations
{
    using Budgetplanner.Models;
    using Microsoft.AspNet.Identity;
    using Microsoft.AspNet.Identity.EntityFramework;
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<Budgetplanner.Models.ApplicationDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = true;
        }

        protected override void Seed(Budgetplanner.Models.ApplicationDbContext context)
        {
            var userManager = new UserManager<ApplicationUser>(
            new UserStore<ApplicationUser>(context));

            if (!context.Users.Any(u => u.Email == "keith.sturzenbecker@gmail.com"))
            {
                userManager.Create(new ApplicationUser
                {
                    UserName = "keith.sturzenbecker@gmail.com",
                    Email = "keith.sturzenbecker@gmail.com",
                    fname = "Keith",
                    lname = "Sturzenbecker"
                },
                        "sturze");
            }
            if (!context.Users.Any(u => u.Email == "test@test.com"))
            {
                userManager.Create(new ApplicationUser
                {
                    UserName = "TestUser",
                    Email = "test@test.com",
                    fname = "test",
                    lname = "user"
                },
                        "Password-1");
            }
            if (!context.TransType.Any(r => r.name == "Income"))
            {
                context.TransType.Add(new TransactionType { name = "Income", isWithdrawl = false });
            }
            if (!context.TransType.Any(r => r.name == "Deposit"))
            {
                context.TransType.Add(new TransactionType { name = "Deposit", isWithdrawl = false });
            }
            if (!context.TransType.Any(r => r.name == "Mortgage"))
            {
                context.TransType.Add(new TransactionType { name = "Mortgage", isWithdrawl = true });
            }
            if (!context.TransType.Any(r => r.name == "Gas"))
            {
                context.TransType.Add(new TransactionType { name = "Gas", isWithdrawl = true });
            }
            if (!context.TransType.Any(r => r.name == "Food"))
            {
                context.TransType.Add(new TransactionType { name = "Food", isWithdrawl = true });
            }
            if (!context.TransType.Any(r => r.name == "Entertainment"))
            {
                context.TransType.Add(new TransactionType { name = "Entertainment", isWithdrawl = true });
            }
            if (!context.TransType.Any(r => r.name == "Vacation"))
            {
                context.TransType.Add(new TransactionType { name = "Vacation", isWithdrawl = true });
            }
            if (!context.TransType.Any(r => r.name == "Rent"))
            {
                context.TransType.Add(new TransactionType { name = "Rent", isWithdrawl = true });
            }
        }
    }
}
