using System.Data.Entity;

namespace Works.Models.Usuario
{
    public class ContextoUsuario : DbContext
    {
        public ContextoUsuario() : base("name=principal")
        {
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Configurations.Add(new UsuarioMapeamento());
        }

        public DbSet<UsuarioBastter> Usuarios { get; set; }
    }
}
