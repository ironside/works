using System.Data.Entity.ModelConfiguration;

namespace Works.Models.AreaProfissionalWork
{
    public class AreaProfissionalWorkMapeamento : EntityTypeConfiguration<T_Works_AreaProfissionalWork>
    {
        public AreaProfissionalWorkMapeamento()
        {
            ToTable("T_Works_AreaProfissionalWork");

            HasKey(x => x.Id);

            Property(x => x.NomeAreaProfissional)
                .HasColumnName("NomeAreaProfissional")
                .HasMaxLength(80)
                .HasColumnType("varchar")
                .IsRequired();

            Property(x => x.OutraAreaProfissional)
                .HasColumnName("OutraAreaProfissional")
                .HasMaxLength(100)
                .HasColumnType("varchar");

            Property(x => x.Ativo)
                .HasColumnName("Ativo")
                .HasColumnType("smallint")
                .IsRequired();


        }
    }
}
