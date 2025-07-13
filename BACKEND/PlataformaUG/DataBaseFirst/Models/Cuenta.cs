using System;
using System.Collections.Generic;

namespace DataBaseFirst.Models;

public partial class Cuenta
{
    public int Id { get; set; }

    public string? Nombre { get; set; }

    public string? Email { get; set; }

    public string? Password { get; set; }

    public string? FacultadId { get; set; }

    public string? RolId { get; set; }

    public virtual Facultade? Facultad { get; set; }

    public virtual Role? Rol { get; set; }
}
