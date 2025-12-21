using ApiEventosUG.Dtos;
using DataBaseFirst.Contexts;
using DataBaseFirst.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.Scripting;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ApiEventosUG.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CuentasController : ControllerBase
    {
        private readonly EventosContext _context;

        public CuentasController(EventosContext context)
        {
            _context = context;
        }

        // POST: api/Cuentas/login
        [HttpPost("login")]
        public async Task<ActionResult<CuentaDto>> Login(LoginDto loginDto)
        {
            if (string.IsNullOrWhiteSpace(loginDto.Email) || string.IsNullOrWhiteSpace(loginDto.Password))
            {
                return BadRequest(new { error = "Email y contraseña son obligatorios." });
            }

            var cuenta = await _context.Cuentas
                .Include(c => c.Facultad)
                .Include(c => c.Rol)
                .FirstOrDefaultAsync(c => c.Email == loginDto.Email && c.Password == loginDto.Password);

            if (cuenta == null)
            {
                return Unauthorized(new { error = "Credenciales inválidas." });
            }

            // Generar token JWT
            var token = GenerateJwtToken(cuenta);

            var response = new CuentaDto
            {
                Id = cuenta.Id,
                Nombre = cuenta.Nombre,
                Email = cuenta.Email,
                FacultadId = cuenta.FacultadId,
                FacultadNombre = cuenta.Facultad?.Nombre ?? "No asignado",
                RolId = cuenta.RolId,
                RolNombre = cuenta.Rol?.Nombre ?? "No asignado",
                Token = token // Agregar el token al DTO
            };

            return Ok(response);
        }

        private string GenerateJwtToken(Cuenta cuenta)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, cuenta.Id.ToString()),
                new Claim(ClaimTypes.Email, cuenta.Email),
                new Claim(ClaimTypes.Role, cuenta.Rol?.Nombre ?? "No asignado")
            };

            var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes("ClaveJWTUltraSegura2025##$$%%&&!!@@**")); // Usa la misma clave que en Program.cs
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(1), // Token válido por 1 hora
                Issuer = "your-issuer",
                Audience = "your-audience",
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        // GET: api/Cuentas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CuentaDto>>> GetCuentas()
        {
            return await _context.Cuentas
                .Include(c => c.Facultad)
                .Include(c => c.Rol)
                .Select(c => new CuentaDto
                {
                    Id = c.Id,
                    Nombre = c.Nombre,
                    Email = c.Email,
                    Password = c.Password,
                    FacultadId = c.FacultadId,
                    FacultadNombre = c.Facultad.Nombre,
                    RolId = c.RolId,
                    RolNombre = c.Rol.Nombre
                })
                .ToListAsync();
        }

        // GET: api/Cuentas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CuentaDto>> GetCuenta(int id)
        {
            var cuenta = await _context.Cuentas
                .Include(c => c.Facultad)
                .Include(c => c.Rol)
                .Select(c => new CuentaDto
                {
                    Id = c.Id,
                    Nombre = c.Nombre,
                    Email = c.Email,
                    Password = c.Password,
                    FacultadId = c.FacultadId,
                    FacultadNombre = c.Facultad.Nombre,
                    RolId = c.RolId,
                    RolNombre = c.Rol.Nombre
                })
                .FirstOrDefaultAsync(c => c.Id == id);

            if (cuenta == null)
            {
                return NotFound();
            }

            return cuenta;
        }

        // GET: api/Cuentas/facultades
        [HttpGet("facultades")]
        public async Task<ActionResult<IEnumerable<Facultade>>> GetFacultades()
        {
            return await _context.Facultades.ToListAsync();
        }

        // GET: api/Cuentas/roles
        [HttpGet("roles")]
        public async Task<ActionResult<IEnumerable<Role>>> GetRoles()
        {
            return await _context.Roles.ToListAsync();
        }

        // POST: api/Cuentas
        [HttpPost]
        public async Task<ActionResult<CuentaDto>> PostCuenta(CuentaCreateDto cuentaDto)
        {
            if (!await _context.Facultades.AnyAsync(f => f.Id == cuentaDto.FacultadId))
            {
                return BadRequest("FacultadId no válido.");
            }
            if (!await _context.Roles.AnyAsync(r => r.Id == cuentaDto.RolId))
            {
                return BadRequest("RolId no válido.");
            }

            var cuenta = new Cuenta
            {
                Nombre = cuentaDto.Nombre,
                Email = cuentaDto.Email,
                Password = cuentaDto.Password,
                FacultadId = cuentaDto.FacultadId,
                RolId = cuentaDto.RolId
            };

            _context.Cuentas.Add(cuenta);
            await _context.SaveChangesAsync();

            await _context.Entry(cuenta).Reference(c => c.Facultad).LoadAsync();
            await _context.Entry(cuenta).Reference(c => c.Rol).LoadAsync();

            var response = new CuentaDto
            {
                Id = cuenta.Id,
                Nombre = cuenta.Nombre,
                Email = cuenta.Email,
                FacultadId = cuenta.FacultadId,
                FacultadNombre = cuenta.Facultad.Nombre,
                RolId = cuenta.RolId,
                RolNombre = cuenta.Rol.Nombre
            };

            return CreatedAtAction(nameof(GetCuenta), new { id = cuenta.Id }, response);
        }

        // PUT: api/Cuentas/5
        [HttpPut("{id}")]
        public async Task<ActionResult<CuentaDto>> PutCuenta(int id, CuentaCreateDto cuentaDto)
        {
            // Validar que el cuerpo no sea nulo
            if (cuentaDto == null)
            {
                return BadRequest(new { error = "El cuerpo de la solicitud no puede estar vacío." });
            }

            // Validar propiedades requeridas
            if (string.IsNullOrWhiteSpace(cuentaDto.Nombre) || string.IsNullOrWhiteSpace(cuentaDto.Email))
            {
                return BadRequest(new { error = "Nombre y Email son obligatorios." });
            }
            if (string.IsNullOrWhiteSpace(cuentaDto.FacultadId) || string.IsNullOrWhiteSpace(cuentaDto.RolId))
            {
                return BadRequest(new { error = "FacultadId y RolId son obligatorios." });
            }

            // Verificar si la cuenta existe
            var cuenta = await _context.Cuentas
                .Include(c => c.Facultad)
                .Include(c => c.Rol)
                .FirstOrDefaultAsync(c => c.Id == id);
            if (cuenta == null)
            {
                return NotFound(new { error = "La cuenta con el ID especificado no existe." });
            }

            // Verificar si el FacultadId es válido
            if (!await _context.Facultades.AnyAsync(f => f.Id == cuentaDto.FacultadId))
            {
                return BadRequest(new { error = "FacultadId no válido." });
            }

            // Verificar si el RolId es válido
            if (!await _context.Roles.AnyAsync(r => r.Id == cuentaDto.RolId))
            {
                return BadRequest(new { error = "RolId no válido." });
            }

            // Verificar si el email ya está registrado por otra cuenta
            if (await _context.Cuentas.AnyAsync(c => c.Email == cuentaDto.Email && c.Id != id))
            {
                return BadRequest(new { error = "El email ya está registrado por otra cuenta." });
            }

            // Actualizar los campos de la entidad existente
            cuenta.Nombre = cuentaDto.Nombre;
            cuenta.Email = cuentaDto.Email;
            cuenta.FacultadId = cuentaDto.FacultadId;
            cuenta.RolId = cuentaDto.RolId;

            try
            {
                await _context.SaveChangesAsync();
                // Recargar las propiedades de navegación para reflejar los IDs actualizados
                await _context.Entry(cuenta).Reference(c => c.Facultad).LoadAsync();
                await _context.Entry(cuenta).Reference(c => c.Rol).LoadAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CuentaExists(id))
                {
                    return NotFound(new { error = "La cuenta fue eliminada durante la actualización." });
                }
                throw;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = $"Error interno del servidor: {ex.Message}" });
            }

            // Devolver el DTO actualizado
            var response = new CuentaDto
            {
                Id = cuenta.Id,
                Nombre = cuenta.Nombre,
                Email = cuenta.Email,
                FacultadId = cuenta.FacultadId,
                FacultadNombre = cuenta.Facultad?.Nombre ?? "No asignado",
                RolId = cuenta.RolId,
                RolNombre = cuenta.Rol?.Nombre ?? "No asignado"
            };

            return Ok(response);
        }

        // DELETE: api/Cuentas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCuenta(int id)
        {
            var cuenta = await _context.Cuentas.FindAsync(id);
            if (cuenta == null)
            {
                return NotFound();
            }

            _context.Cuentas.Remove(cuenta);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CuentaExists(int id)
        {
            return _context.Cuentas.Any(e => e.Id == id);
        }
    }
}