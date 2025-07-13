using System;
using System.Collections.Generic;

namespace DataBaseFirst.Models;

public partial class Role
{
    public string Id { get; set; } = null!;

    public string Nombre { get; set; } = null!;

    public virtual ICollection<Cuenta> Cuenta { get; set; } = new List<Cuenta>();
}
