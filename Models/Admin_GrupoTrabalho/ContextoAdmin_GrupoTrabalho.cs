using System.Data.Entity;

namespace Works.Models.Admin_GrupoTrabalho
{
    public class ContextoAdmin_GrupoTrabalho : DbContext
    {
        public ContextoAdmin_GrupoTrabalho() : base("name=principal")
        {
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Configurations.Add(new Admin_GrupoTrabalhoMapeamento());
        }

        public DbSet<T_Works_Admin_GrupoTrabalho> Admin_GrupoTrabalho { get; set; }
    }
}
