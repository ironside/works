using System.Data.Entity;

namespace Works.Models.MensagemWork
{
    public class ContextoMensagemWork : DbContext
    {
        public ContextoMensagemWork() : base("name=principal")
        {
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Configurations.Add(new MensagemWorkMapeamento());
        }

        public DbSet<T_Works_MensagemWork> MensagemWork { get; set; }
    }
}
