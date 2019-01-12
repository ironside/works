using System.Data.Entity;

namespace Works.Models.Topico_GrupoTrabalho
{
    public class ContextoTopico_GrupoTrabalho : DbContext
    {
        public ContextoTopico_GrupoTrabalho() : base("name=principal")
        {

        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Configurations.Add(new Topico_GrupoTrabalhoMapeamento());
        }

        public DbSet<T_Works_Topico_GrupoTrabalho> Topico_GrupoTrabalho { get; set; }
    }
}
