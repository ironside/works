using System.Data.Entity.ModelConfiguration;

namespace Works.Models.Topico_GrupoTrabalho
{
    public class Topico_GrupoTrabalhoMapeamento : EntityTypeConfiguration<T_Works_Topico_GrupoTrabalho>
    {
        public Topico_GrupoTrabalhoMapeamento()
        {
            ToTable("T_Works_Topico_GrupoTrabalho");

            HasKey(x => x.Id);

            Property(x => x.GrupoTrabalhoId)
                .HasColumnName("GrupoTrabalhoId")
                .HasColumnType("decimal")
                .IsRequired();

            Property(x => x.UsuarioId)
               .HasColumnName("UsuarioId")
               .HasColumnType("decimal")
               .IsRequired();

            Property(x => x.TituloTopico)
                .HasColumnName("TituloTopico")
                .HasMaxLength(100)
                .HasColumnType("varchar")
                .IsRequired();

            Property(x => x.ComentarioTopico)
                .HasColumnName("ComentarioTopico")
                .HasMaxLength(5000)
                .HasColumnType("varchar")
                .IsRequired();

            Property(x => x.DataComentarioTopico)
                .HasColumnName("DataComentarioTopico")
                .HasColumnType("DateTime")
                .IsRequired();

        }
    }
}
