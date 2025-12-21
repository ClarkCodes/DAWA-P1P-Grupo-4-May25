namespace ApiEventosUG.Dtos
{
    public class CuentaDto
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string FacultadId { get; set; }
        public string FacultadNombre { get; set; }
        public string RolId { get; set; }
        public string RolNombre { get; set; }
        public string Token { get; set; }
    }
}