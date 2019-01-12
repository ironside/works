using System;
using System.Data.Entity.ModelConfiguration;

namespace Works.Models.Usuario
{
    public class UsuarioMapeamento : EntityTypeConfiguration<UsuarioBastter>
    {
        public UsuarioMapeamento()
        {
            ToTable("Usuario");

            HasKey(x => x.UsuarioID);

            Property(x => x.UsuarioID)
                .HasColumnName("UsuarioID")
                .HasColumnType("decimal")
                .IsRequired();

            Property(x => x.Login)
                .HasColumnName("Login")
                .HasMaxLength(50)
                .HasColumnType("varchar")
                .IsOptional();

            Property(x => x.Nome)
                .HasColumnName("Nome")
                .HasMaxLength(100)
                .HasColumnType("varchar")
                .IsOptional();

            Property(x => x.Email)
                .HasColumnName("Email")
                .HasMaxLength(100)
                .HasColumnType("varchar")
                .IsOptional();

            Property(x => x.Status)
                .HasColumnName("Status")
                .HasColumnType("tinyint")
                .IsOptional();

            Property(x => x.Admin)
                .HasColumnName("Admin")
                .HasColumnType("tinyint")
                .IsOptional();

            Property(x => x.BastterBlue)
                .HasColumnName("BastterBlue")
                .HasColumnType("tinyint")
                .IsOptional();

        }
    }
}
