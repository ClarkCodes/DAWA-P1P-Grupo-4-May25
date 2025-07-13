namespace ApiEventosUG.Dtos
{
    public class CuentaCreateDto
    {
        public string Nombre { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string FacultadId { get; set; }
        public string RolId { get; set; }
    }
}