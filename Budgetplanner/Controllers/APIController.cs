using Budgetplanner.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace Budgetplanner.Controllers
{
    [RoutePrefix("api/budget")]
    public class APIController : ApiController
    {
        ApplicationDbContext db = new ApplicationDbContext();

        public class apiparm
        {
            public int id { get; set; }
            public string desc { get; set; }
            public decimal total { get; set; }
        }

        public class sdelete
        {
            public int id { get; set; }
            public bool isDeleted { get; set; }
        }

        public class invite
        {
            public string user { get; set; }
            public int id { get; set; }
        }

        public class budgetadd
        {
            public int budget { get; set; }
            public int type { get; set; }
            public int house { get; set; }
            public decimal amount { get; set; }
            public int year { get; set; }
            public int month { get; set; }
        }

        public class transadd
        {
            public int id { get; set; }
            public string user { get; set; }
            public int type { get; set; }
            public decimal amount { get; set; }
            public decimal ramount { get; set; }
            public int accountid { get; set; }
            public string desc { get; set; }
            public int year { get; set; }
            public int month { get; set; }
            public int day { get; set; }
        }

        public class idin
        {
            public int id { get; set; }
        }

        [Route("GetHouse")]
        public async Task<List<House>> GetHouse (int id)
        {
            return await db.GetHouse(id);
        }

        [Route("GetAccount")]
        public async Task<List<Account>> GetAccount (int id)
        {
            return await db.GetAccount(id);
        }

        [Route("GetTrans")]
        public async Task<List<Transaction>> GetTrans (int id)
        {
            return await db.GetTrans(id);
        }

        [Route("GetTransType")]
        public async Task<List<TransactionType>> GetTransType()
        {
            return await db.GetTransType(null);
        }


        [Route("GetTransType")]
        public async Task<List<TransactionType>> GetTransType (int id)
        {
            return await db.GetTransType(id);
        }

        [Route("GetUser")]
        public async Task<List<ApplicationUser>> GetUser(string id)
        {
           return await db.GetUser(id);
        }

        [Route("GetUsersInHouse")]
        public async Task<List<HouseUser>> GetUsersInHouse(int id)
        {
           return await db.GetUsersInHouse(id);
        }

        [Route("GetBudgetForHouse")]
        public async Task<List<Budgeting>> GetBudgetForHouse(int id)
        {
            return await db.GetBudgetForHouse(id);
        }

        [Route("GetTransFromType")]
        public async Task<List<Trans>> GetTransFromType(int id)
        {
            return await db.GetTransFromType(null, id);
        }

        [Route("GetTransFromType")]
        public async Task<List<Trans>> GetTransFromType(int type, int id)
        {
            return await db.GetTransFromType(type, id);
        }

        [Route("AddHouse")]
        public async Task<int> AddHouse (string name, string user)
        {
            return await db.AddHouse(name, user);
        }

        [Route("AddAccount")]
        [HttpPost]
        public async Task<int> AddAccount (apiparm input)
        {
            return await db.AddAccount(input.total, input.desc, input.id);
        }

        [Route("AddBudget")]
        [HttpPost]
        public async Task<int> AddBudget (budgetadd input)
        {
            return await db.AddBudget(input.type, input.house, input.amount, input.year, input.month);
        }

        [Route("AddTrans")]
        [HttpPost]
        public async Task<int> AddTrans (transadd input)
        {
            return await db.AddTrans(input.user, input.type, input.amount, input.ramount, input.accountid, input.desc, input.year, input.month, input.day);
        }

        [Route("DeleteHouse")]
        [HttpPost]
        public async Task<int> DeleteHouse (invite input)
        {
            return await db.DeleteHouse(input.id, input.user);
        }

        [Route("DeleteBudget")]
        [HttpPost]
        public async Task<int> DeleteBudget (idin input)
        {
            return await db.DeleteBudget(input.id);
        }

        [Route("DeleteTrans")]
        [HttpPost]
        public async Task<int> DeleteTrans(idin input)
        {
            return await db.DeleteTrans(input.id);
        }

        [Route("SDeleteAccount")]
        [HttpPost]
        public async Task<int> SDeleteAccount (sdelete input)
        {
            return await db.SDeleteAccount(input.id, input.isDeleted);
        }

        [Route("UpdateAccount")]
        [HttpPost]
        public async Task<int> UpdateAccount (apiparm input)
        {
            return await db.UpdateAccount(input.id, input.desc);
        }

        [Route("UpdateAccountTotal")]
        [HttpPost]
        public async Task<int> UpdateAccountTotal (apiparm input)
        {
            return await db.UpdateAccountTotal(input.id, input.total);
        }

        [Route("EditBudget")]
        [HttpPost]
        public async Task<int> EditBudget (budgetadd input)
        {
            return await db.EditBudget(input.budget, input.type, input.house, input.amount, input.year, input.month);
        }

        [Route("EditTrans")]
        [HttpPost]
        public async Task<int> EditTrans(transadd input)
        {
            return await db.EditTrans(input.id, input.user, input.type, input.amount, input.ramount, input.accountid, input.desc, input.year, input.month, input.day);
        }

        [Route("KickUser")]
        [HttpPost]
        public async Task<int> KickUser (invite input)
        {
            return await db.KickUser(input.user, input.id);
        }

        [Route("InviteUser")]
        [HttpPost]
        public async Task<int> InviteUser(invite input)
        {
            return await db.InviteUser(input.user, input.id);
        }

        [Route("JoinUser")]
        [HttpPost]
        public async Task<int> JoinUser(invite input)
        {
            return await db.JoinUser(input.user);
        }
    }
}
