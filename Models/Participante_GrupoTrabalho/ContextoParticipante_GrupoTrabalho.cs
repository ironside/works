using System.Data.Entity;

namespace Works.Models.Participante_GrupoTrabalho
{
    public class ContextoParticipante_GrupoTrabalho : DbContext
    {
        public ContextoParticipante_GrupoTrabalho() : base("name=principal")
        {
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Configurations.Add(new Participante_GrupoTrabalhoMapeamento());
        }

        public DbSet<T_Works_Participante_GrupoTrabalho> Participante_GrupoTrabalho { get; set; }
    }
}
