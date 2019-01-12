using System;

namespace Works.Models.OfertasWork
{
    public class OfertasWorkModel
    {
        public int? Id { get; set; }
        public int? IdAreaProfissional { get; set; }
        public int? UsuarioId { get; set; }
        public int? UsuarioLogadoId { get; set; }
        public string NomeUsuario { get; set; }
        public string TituloOferta { get; set; }
        public string DescricaoOferta { get; set; }
        public string DescricaoAreaProfissional { get; set; }
        public DateTime? DataCriacao { get; set; }
    }
}
