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

        [Route("AddHouse")]
        public async Task<int> AddHouse (string name, string user)
        {
            return await db.AddHouse(name, user);
        }

        [Route("AddUserToHouse")]
        public async Task<int> AddUserToHouse (int id, string user)
        {
            return await db.AddUserToHouse(id, true, user);
        }

        [Route("AddAccount")]
        [HttpPost]
        public async Task<int> AddAccount (apiparm input)
        {
            return await db.AddAccount(input.total, input.desc, input.id);
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
    }
}
