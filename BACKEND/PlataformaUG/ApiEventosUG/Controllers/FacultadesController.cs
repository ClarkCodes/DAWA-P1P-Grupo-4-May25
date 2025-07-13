using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DataBaseFirst.Contexts;
using DataBaseFirst.Models;

namespace ApiEventosUG.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FacultadesController : ControllerBase
    {
        private readonly EventosContext _context;

        public FacultadesController(EventosContext context)
        {
            _context = context;
        }

        // GET: api/Facultades
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Facultade>>> GetFacultades()
        {
            return await _context.Facultades.ToListAsync();
        }

        // GET: api/Facultades/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Facultade>> GetFacultade(string id)
        {
            var facultade = await _context.Facultades.FindAsync(id);

            if (facultade == null)
            {
                return NotFound();
            }

            return facultade;
        }

        // PUT: api/Facultades/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutFacultade(string id, Facultade facultade)
        {
            if (id != facultade.Id)
            {
                return BadRequest();
            }

            _context.Entry(facultade).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FacultadeExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Facultades
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Facultade>> PostFacultade(Facultade facultade)
        {
            _context.Facultades.Add(facultade);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (FacultadeExists(facultade.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetFacultade", new { id = facultade.Id }, facultade);
        }

        // DELETE: api/Facultades/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFacultade(string id)
        {
            var facultade = await _context.Facultades.FindAsync(id);
            if (facultade == null)
            {
                return NotFound();
            }

            _context.Facultades.Remove(facultade);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool FacultadeExists(string id)
        {
            return _context.Facultades.Any(e => e.Id == id);
        }
    }
}
