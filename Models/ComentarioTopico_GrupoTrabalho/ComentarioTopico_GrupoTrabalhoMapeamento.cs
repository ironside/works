using System.Data.Entity.ModelConfiguration;

namespace Works.Models.ComentarioTopico_GrupoTrabalho
{
    public class ComentarioTopico_GrupoTrabalhoMapeamento : EntityTypeConfiguration<T_Works_ComentarioTopico_GrupoTrabalho>
    {
        public ComentarioTopico_GrupoTrabalhoMapeamento()
        {
            ToTable("T_Works_ComentarioTopico_GrupoTrabalho");

            HasKey(x => x.Id);

            Property(x => x.GrupoTrabalhoId)
                .HasColumnName("GrupoTrabalhoId")
                .HasColumnType("decimal")
                .IsRequired();

            Property(x => x.Topico_GrupoTrabalhoId)
                .HasColumnName("Topico_GrupoTrabalhoId")
                .HasColumnType("decimal")
                .IsRequired();

            Property(x => x.UsuarioId)
               .HasColumnName("UsuarioId")
               .HasColumnType("decimal")
               .IsRequired();

            Property(x => x.Comentario)
                .HasColumnName("Comentario")
                .HasMaxLength(5000)
                .HasColumnType("varchar")
                .IsRequired();

            Property(x => x.DataComentario)
                .HasColumnName("DataComentario")
                .HasColumnType("DateTime")
                .IsRequired();

        }
    }
}
