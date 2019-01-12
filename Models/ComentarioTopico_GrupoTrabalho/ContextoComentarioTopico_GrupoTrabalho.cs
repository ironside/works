using System.Data.Entity;

namespace Works.Models.ComentarioTopico_GrupoTrabalho
{
    public class ContextoComentarioTopico_GrupoTrabalho : DbContext
    {
        public ContextoComentarioTopico_GrupoTrabalho() : base("name=principal")
        {

        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Configurations.Add(new ComentarioTopico_GrupoTrabalhoMapeamento());
        }

        public DbSet<T_Works_ComentarioTopico_GrupoTrabalho> ComentarioTopico_GrupoTrabalho { get; set; }
    }
}
