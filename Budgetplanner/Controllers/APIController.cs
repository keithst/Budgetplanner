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
    [RoutePrefix("api/")]
    public class APIController : ApiController
    {
        ApplicationDbContext db = new ApplicationDbContext();

        [Route("GetHouse")]
        public async Task<List<Household>> GetHouse (int id)
        {
            return await db.GetHouse(id);
        }
    }
}
