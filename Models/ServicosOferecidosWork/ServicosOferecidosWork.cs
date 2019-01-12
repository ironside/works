using System;

namespace Works.Models.ServicosOferecidosWork
{
    public class T_Works_ServicosOferecidosWork
    {
        public int Id { get; set; }
        public int IdAreaProfissional { get; set; }
        public int UsuarioId { get; set; }
        public string TituloServico { get; set; }
        public string DescricaoServico { get; set; }
        public DateTime DataCriacao { get; set; }
    }
}
