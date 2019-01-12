using System;

namespace Works.Models.OfertasWork
{
    public class T_Works_OfertasWork
    {
        public int Id { get; set; }
        public int IdAreaProfissional { get; set; }
        public int UsuarioId { get; set; }
        public string TituloOferta { get; set; }
        public string DescricaoOferta { get; set; }
        public DateTime DataCriacao { get; set; }
    }
}
