﻿using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using System.Data.Entity;
using System.Data.SqlClient;
using System.Collections.Generic;
using System.Web.Http;
using System.Data;
using System;

namespace Budgetplanner.Models
{
    // You can add profile data for the user by adding more properties to your ApplicationUser class, please visit http://go.microsoft.com/fwlink/?LinkID=317594 to learn more.
    public class ApplicationUser : IdentityUser
    {
        public string fname { get; set; }
        public string lname { get; set; }
        public bool isHoH { get; set; }
        public bool isInvited { get; set; }
        public int? HouseId { get; set; }
        public async Task<ClaimsIdentity> GenerateUserIdentityAsync(UserManager<ApplicationUser> manager, string authenticationType)
        {
            // Note the authenticationType must match the one defined in CookieAuthenticationOptions.AuthenticationType
            var userIdentity = await manager.CreateIdentityAsync(this, authenticationType);
            // Add custom user claims here
            return userIdentity;
        }

        public virtual Household House { get; set; }
    }

    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext()
            : base("DefaultConnection", throwIfV1Schema: false)
        {
        }
        
        public static ApplicationDbContext Create()
        {
            return new ApplicationDbContext();
        }

        public DbSet<BankAccount> Bank { get; set; }
        public DbSet<Budget> Budget { get; set; }
        public DbSet<Household> House { get; set; }
        public DbSet<Transaction> Trans { get; set; }
        public DbSet<TransactionType> TransType { get; set; }

        // Get household by id
        public async Task<List<House>> GetHouse(int id)
        {
            var idParm = new SqlParameter("@id", id);

            return await this.Database.SqlQuery<House>("GetHouse @id", idParm).ToListAsync();
        }

        // Get bank accounts from household id
        public async Task<List<Account>> GetAccount(int id)
        {
            var idParm = new SqlParameter("@id", id);

            return await this.Database.SqlQuery<Account>("GetAccount @id", idParm).ToListAsync();
        }

        // Get transaction from bank account id
        public async Task<List<Transaction>> GetTrans(int id)
        {
            var idParm = new SqlParameter("@id", id);

            return await this.Database.SqlQuery<Transaction>("GetTrans @id", idParm).ToListAsync();
        }

        // Get transaction type from transaction, null requests all transaction types
        public async Task<List<TransactionType>> GetTransType(int? id)
        {
            if (id != null)
            {
                var idParm = new SqlParameter("@id", id);
                return await this.Database.SqlQuery<TransactionType>("GetTransType @id", idParm).ToListAsync();
            }
            return await this.Database.SqlQuery<TransactionType>("GetTransType").ToListAsync();

        }

        // Get budget from household id
        public async Task<List<Budget>> GetBudget(int id)
        {
            var idParm = new SqlParameter("@id", id);

            return await this.Database.SqlQuery<Budget>("GetBudget @id", idParm).ToListAsync();
        }

        // Get user
        public async Task<List<ApplicationUser>> GetUser(string id)
        {
            var idParm = new SqlParameter("@id", id);

            return await this.Database.SqlQuery<ApplicationUser>("GetUser @id", idParm).ToListAsync();
        }

        // Get user from house ids
        public async Task<List<HouseUser>> GetUsersInHouse(int id)
        {
            var idParm = new SqlParameter("@id", id);

            return await this.Database.SqlQuery<HouseUser>("GetUsersInHouse @id", idParm).ToListAsync();
        }

        //Get budget for household
        public async Task<List<Budgeting>> GetBudgetForHouse(int id)
        {
            var idParm = new SqlParameter("@id", id);

            return await this.Database.SqlQuery<Budgeting>("GetBudgetForHouse @id", idParm).ToListAsync();
        }

        // Add a household
        public async Task<int> AddHouse(string name, string user)
        {
            var nameParm = new SqlParameter("@name", name);
            var userParm = new SqlParameter("@user", user);

            return await this.Database.ExecuteSqlCommandAsync("AddHouse @name, @user", nameParm, userParm);
        }

        // Add bank account to household
        public async Task<int> AddAccount(decimal total, string description, int id)
        {
            var totalParm = new SqlParameter("@total", total);
            var descriptionParm = new SqlParameter("@description", description);
            var idParm = new SqlParameter("@id", id);

            return await this.Database.ExecuteSqlCommandAsync("AddAccount @id, @total, @description",
                idParm, totalParm, descriptionParm);
        }

        // Add a budget item
        public async Task<int> AddBudget(int type, int house, decimal amount, int year, int month)
        {
            var typeParm = new SqlParameter("@type", type);
            var houseParm = new SqlParameter("@house", house);
            var amtParm = new SqlParameter("@amt", amount);
            var yearParm = new SqlParameter("@year", year);
            var monthParm = new SqlParameter("@month", month);

            return await this.Database.ExecuteSqlCommandAsync("AddBudget @type, @house, @amt, @year, @month", typeParm, houseParm,
                amtParm, yearParm, monthParm);
        }

        // Delete a household
        public async Task<int> DeleteHouse(int id, string user)
        {
            var idParm = new SqlParameter("@id", id);
            var userParm = new SqlParameter("@user", user);

            return await this.Database.ExecuteSqlCommandAsync("DeleteHouse @id, @user", idParm, userParm);
        }

        // soft delete an account
        public async Task<int> SDeleteAccount(int id, bool isDeleted)
        {
            var idParm = new SqlParameter("@id", id);
            var isDeletedParm = new SqlParameter("@isDeleted", isDeleted);

            return await this.Database.ExecuteSqlCommandAsync("SDeleteAccount @id, @isDeleted", idParm, isDeletedParm);
        }

        // update account name
        public async Task<int> UpdateAccount(int id, string desc)
        {
            var descParm = new SqlParameter("@desc", desc);
            var idParm = new SqlParameter("@id", id);

            return await this.Database.ExecuteSqlCommandAsync("UpdateAccount @id, @desc", idParm, descParm);
        }
        // update account value
        public async Task<int> UpdateAccountTotal(int id, decimal total)
        {
            var idParm = new SqlParameter("@id", id);
            var totalParm = new SqlParameter("@total", total);

            return await this.Database.ExecuteSqlCommandAsync("UpdateAccountTotal @id, @total", idParm, totalParm);
        }

        // edit budget
        public async Task<int> EditBudget (int budget, int type, int id, decimal amount, int year, int month)
        {
            var budgetParm = new SqlParameter("@budget", budget);
            var typeParm = new SqlParameter("@type", type);
            var idParm = new SqlParameter("@id", id);
            var amountParm = new SqlParameter("@amt", amount);
            var yearParm = new SqlParameter("@year", year);
            var monthParm = new SqlParameter("@month", month);

            return await this.Database.ExecuteSqlCommandAsync("EditBudget @budget, @type, @id, @amt, @year, @month", budgetParm,
                typeParm, idParm, amountParm, yearParm, monthParm);
        }

        // kick user from house
        public async Task<int> KickUser (string user, int id)
        {
            var userParm = new SqlParameter("@user", user);
            var idParm = new SqlParameter("@id", id);

            return await this.Database.ExecuteSqlCommandAsync("KickUser @user, @id", userParm, idParm);
        }

        // invite user to house
        public async Task<int> InviteUser(string user, int id)
        {
            var userParm = new SqlParameter("@user", user);
            var idParm = new SqlParameter("@id", id);

            return await this.Database.ExecuteSqlCommandAsync("InviteUser @user, @id", userParm, idParm);
        }

        //join house
        public async Task<int> JoinUser(string user)
        {
            var userParm = new SqlParameter("@user", user);

            return await this.Database.ExecuteSqlCommandAsync("JoinUser @user", userParm);
        }
    }
}