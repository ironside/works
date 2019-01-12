using System.Data.Entity.ModelConfiguration;

namespace Works.Models.OfertasWork
{
    public class OfertasWorkMapeamento : EntityTypeConfiguration<T_Works_OfertasWork>
    {
        public OfertasWorkMapeamento()
        {
            ToTable("T_Works_OfertasWork");

            HasKey(x => x.Id);

            Property(x => x.IdAreaProfissional)
                .HasColumnName("IdAreaProfissional")
                .HasColumnType("decimal")
                .IsRequired();

            Property(x => x.UsuarioId)
                .HasColumnName("UsuarioId")
                .HasColumnType("decimal")
                .IsRequired();

            Property(x => x.TituloOferta)
                .HasColumnName("TituloOferta")
                .HasMaxLength(100)
                .HasColumnType("varchar")
                .IsRequired();

            Property(x => x.DescricaoOferta)
                .HasColumnName("DescricaoOferta")
                .HasMaxLength(500)
                .HasColumnType("varchar")
                .IsRequired();

            Property(x => x.DataCriacao)
                .HasColumnName("DataCriacao")
                .HasColumnType("datetime")
                .IsRequired();

        }
    }
}
