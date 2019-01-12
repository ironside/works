using System.Data.Entity;

namespace Works.Models.OfertasWork
{
    public class ContextoOfertasWork : DbContext
    {
        public ContextoOfertasWork() : base("name=principal")
        {
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Configurations.Add(new OfertasWorkMapeamento());
        }

        public DbSet<T_Works_OfertasWork> OfertasWork { get; set; }
    }
}
