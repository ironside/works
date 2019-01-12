using System.Data.Entity.ModelConfiguration;

namespace Works.Models.MensagemWork
{
    public class MensagemWorkMapeamento : EntityTypeConfiguration<T_Works_MensagemWork>
    {
        public MensagemWorkMapeamento()
        {
            ToTable("T_Works_MensagemWork");

            HasKey(x => x.Id);

            Property(x => x.UsuarioId)
                .HasColumnName("UsuarioId")
                .HasColumnType("decimal")
                .IsRequired();

            Property(x => x.UsuarioRemetenteId)
                .HasColumnName("UsuarioRemetenteId")
                .HasColumnType("decimal")
                .IsRequired();

            Property(x => x.DescricaoMensagemWork)
                .HasColumnName("DescricaoMensagemWork")
                .HasMaxLength(500)
                .HasColumnType("varchar")
                .IsRequired();

            Property(x => x.DataMensagem)
                .HasColumnName("DataMensagem")
                .HasColumnType("datetime")
                .IsRequired();

            Property(x => x.MensagemLida)
                .HasColumnName("MensagemLida")
                .HasColumnType("decimal")
                .IsRequired();

            Property(x => x.MensagemLidaAdmin)
                .HasColumnName("MensagemLidaAdmin")
                .HasColumnType("decimal")
                .IsRequired();

        }
    }
}
