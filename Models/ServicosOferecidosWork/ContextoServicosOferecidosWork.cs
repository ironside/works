using System.Data.Entity;

namespace Works.Models.ServicosOferecidosWork
{
    public class ContextoServicosOferecidosWork : DbContext
    {
        public ContextoServicosOferecidosWork() : base("name=principal")
        {
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Configurations.Add(new ServicosOferecidosWorkMapeamento());
        }

        public DbSet<T_Works_ServicosOferecidosWork> ServicosOferecidosWork { get; set; }
    }
}
