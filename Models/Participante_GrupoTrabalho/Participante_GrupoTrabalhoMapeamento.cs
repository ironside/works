using System.Data.Entity.ModelConfiguration;

namespace Works.Models.Participante_GrupoTrabalho
{
    public class Participante_GrupoTrabalhoMapeamento : EntityTypeConfiguration<T_Works_Participante_GrupoTrabalho>
    {
        public Participante_GrupoTrabalhoMapeamento()
        {
            ToTable("T_Works_Participante_GrupoTrabalho");

            HasKey(x => x.Id);

            Property(x => x.GrupoTrabalhoId)
                .HasColumnName("GrupoTrabalhoId")
                .HasColumnType("decimal")
                .IsRequired();

            Property(x => x.UsuarioId)
                .HasColumnName("UsuarioId")
                .HasColumnType("decimal")
                .IsOptional();




        }
    }
}
