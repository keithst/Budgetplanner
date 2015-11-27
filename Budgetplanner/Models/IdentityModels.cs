using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using System.Data.Entity;
using System.Data.SqlClient;
using System.Collections.Generic;
using System.Web.Http;

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

        // Get household by id if id is null return all
        public async Task<List<House>> GetHouse(int id)
        {
            var idParm = new SqlParameter("@id", id);

            return await this.Database.SqlQuery<House>("GetHouse @id", idParm).ToListAsync();
        }

        // Get bank accounts from household id
        public async Task<List<BankAccount>> GetAccount(int id)
        {
            var idParm = new SqlParameter("@id", id);

            return await this.Database.SqlQuery<BankAccount>("GetAccount @id", idParm).ToListAsync();
        }

        // Get transaction from bank account id
        public async Task<List<Transaction>> GetTrans(int id)
        {
            var idParm = new SqlParameter("@id", id);

            return await this.Database.SqlQuery<Transaction>("GetTrans @id", idParm).ToListAsync();
        }

        // Get transaction type from transaction, null requests all transaction types
        public async Task<List<TransactionType>> GetTransType(int id)
        {
            var idParm = new SqlParameter("@id", id);

            return await this.Database.SqlQuery<TransactionType>("GetTransType @id", idParm).ToListAsync();
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

            return await this.Database.SqlQuery<ApplicationUser>("GetBudget @id", idParm).ToListAsync();
        }

        // Add a household
        public async Task<int> AddHouse(string name, string user)
        {
            var nameParm = new SqlParameter("@name", name);
            var userParm = new SqlParameter("@user", user);

            return await this.Database.ExecuteSqlCommandAsync("AddHouse @name, @user", nameParm, userParm);
        }

        // Add user to house
        public async Task<int> AddUserToHouse(int id, bool isInvited, string user)
        {
            var idParm = new SqlParameter("@id", id);
            var isInvitedParm = new SqlParameter("@isInvited", isInvited);
            var userParm = new SqlParameter("@user", user);

            return await this.Database.ExecuteSqlCommandAsync("AddUserToHouse @id, @isInvited, @isHoH, @user", idParm, isInvitedParm, userParm);
        }

        // Add bank account to household
        public async Task<int> AddAccount(decimal total, string description, int id)
        {
            var totalParm = new SqlParameter("@total", total);
            var descriptionParm = new SqlParameter("@description", description);
            var idParm = new SqlParameter("@id", id);

            return await this.Database.ExecuteSqlCommandAsync("AddAccount @total, @description, @id",
                totalParm, descriptionParm, idParm);
        }

        // Delete a household
        public async Task<int> DeleteHouse(int id)
        {
            var idParm = new SqlParameter("@id", id);

            return await this.Database.ExecuteSqlCommandAsync("DeleteHouse @id", idParm);
        }
    }
}