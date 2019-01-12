using System;
using System.Data.Entity.ModelConfiguration;

namespace Works.Models.GruposTrabalho
{
    public class GruposTrabalhoMapeamento : EntityTypeConfiguration<T_Works_GruposTrabalho>
    {
        public GruposTrabalhoMapeamento()
        {
            ToTable("T_Works_GruposTrabalho");

            HasKey(x => x.Id);

            Property(x => x.Titulo)
                .HasColumnName("Titulo")
                .HasMaxLength(100)
                .HasColumnType("varchar")
                .IsRequired();

            Property(x => x.Descricao)
                .HasColumnName("Descricao")
                .HasMaxLength(5000)
                .HasColumnType("varchar")
                .IsRequired();

            Property(x => x.UsuarioId)
                .HasColumnName("UsuarioId")
                .HasColumnType("decimal")
                .IsRequired();

            Property(x => x.Status)
                .HasColumnName("Status")
                .HasColumnType("smallint")
                .IsRequired();

            Property(x => x.DataCriacao)
                .HasColumnName("DataCriacao")
                .HasColumnType("DateTime")
                .IsRequired();

            Property(x => x.Permissao)
                .HasColumnName("Permissao")
                .HasColumnType("smallint")
                .IsRequired();

        }
    }
}
