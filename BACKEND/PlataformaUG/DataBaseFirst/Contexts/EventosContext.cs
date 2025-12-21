using System;
using System.Collections.Generic;
using DataBaseFirst.Models;
using Microsoft.EntityFrameworkCore;

namespace DataBaseFirst.Contexts;

public partial class EventosContext : DbContext
{
    public EventosContext()
    {
    }

    public EventosContext(DbContextOptions<EventosContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Cuenta> Cuentas { get; set; }

    public virtual DbSet<Facultade> Facultades { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("Server=DESKTOP-TKFV0I6;Database=PlataformaUni;User ID=Mstr;Trusted_Connection=True;MultipleActiveResultSets=True;TrustServerCertificate=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Cuenta>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Cuentas__3214EC07778B7096");

            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.FacultadId).HasMaxLength(10);
            entity.Property(e => e.Nombre).HasMaxLength(100);
            entity.Property(e => e.Password).HasMaxLength(100);
            entity.Property(e => e.RolId).HasMaxLength(10);

            entity.HasOne(d => d.Facultad).WithMany(p => p.Cuenta)
                .HasForeignKey(d => d.FacultadId)
                .HasConstraintName("FK__Cuentas__Faculta__3B75D760");

            entity.HasOne(d => d.Rol).WithMany(p => p.Cuenta)
                .HasForeignKey(d => d.RolId)
                .HasConstraintName("FK__Cuentas__RolId__3C69FB99");
        });

        modelBuilder.Entity<Facultade>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Facultad__3214EC07EC628007");

            entity.Property(e => e.Id).HasMaxLength(10);
            entity.Property(e => e.Nombre).HasMaxLength(150);
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Roles__3214EC07EDF6FD95");

            entity.Property(e => e.Id).HasMaxLength(10);
            entity.Property(e => e.Nombre).HasMaxLength(50);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
