using System.Data.Entity.ModelConfiguration;

namespace Works.Models.Admin_GrupoTrabalho
{
    public class Admin_GrupoTrabalhoMapeamento : EntityTypeConfiguration<T_Works_Admin_GrupoTrabalho>
    {
        public Admin_GrupoTrabalhoMapeamento()
        {
            ToTable("T_Works_Admin_GrupoTrabalho");

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
