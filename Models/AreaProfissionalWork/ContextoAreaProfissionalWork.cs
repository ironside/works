using System.Data.Entity;

namespace Works.Models.AreaProfissionalWork
{
    public class ContextoAreaProfissionalWork : DbContext
    {
        public ContextoAreaProfissionalWork() : base("name=principal")
        {
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Configurations.Add(new AreaProfissionalWorkMapeamento());
        }

        public DbSet<T_Works_AreaProfissionalWork> AreaProfissionalWork { get; set; }
    }
}
