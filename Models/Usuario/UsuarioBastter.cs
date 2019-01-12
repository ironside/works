using System;
namespace Works.Models.Usuario
{
    public class UsuarioBastter
    {
        public int UsuarioID { get; set; }
        public string Login { get; set; }
        public string Nome { get; set; }
        public string Email { get; set; }
        public byte Status { get; set; }
        public byte Admin { get; set; }
        public byte BastterBlue { get; set; }
    }
}
