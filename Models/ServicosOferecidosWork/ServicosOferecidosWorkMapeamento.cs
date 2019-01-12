using System.Data.Entity.ModelConfiguration;

namespace Works.Models.ServicosOferecidosWork
{
    public class ServicosOferecidosWorkMapeamento : EntityTypeConfiguration<T_Works_ServicosOferecidosWork>
    {
        public ServicosOferecidosWorkMapeamento()
        {
            ToTable("T_Works_ServicosOferecidosWork");

            HasKey(x => x.Id);

            Property(x => x.IdAreaProfissional)
                .HasColumnName("IdAreaProfissional")
                .HasColumnType("decimal")
                .IsRequired();

            Property(x => x.UsuarioId)
                .HasColumnName("UsuarioId")
                .HasColumnType("decimal")
                .IsRequired();

            Property(x => x.TituloServico)
                .HasColumnName("TituloServico")
                .HasMaxLength(100)
                .HasColumnType("varchar")
                .IsRequired();

            Property(x => x.DescricaoServico)
                .HasColumnName("DescricaoServico")
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
