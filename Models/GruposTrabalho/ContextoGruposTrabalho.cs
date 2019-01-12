using System.Data.Entity;

namespace Works.Models.GruposTrabalho
{
    public class ContextoGrupoTrabalho : DbContext
    {

        public ContextoGrupoTrabalho() : base("name=principal")
        {

        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
        
            modelBuilder.Configurations.Add(new GruposTrabalhoMapeamento());

        }

        public DbSet<T_Works_GruposTrabalho> GruposTrabalho { get; set; }
    }
}
