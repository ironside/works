using System;
using System.Collections.Generic;

namespace Works.Models.ServicosOferecidosWork
{
    public class ServicosOferecidosWorkModel
    {
        public int? Id { get; set; }
        public int? IdAreaProfissional { get; set; }
        public int? UsuarioId { get; set; }
        public int? UsuarioLogadoId { get; set; }
        public string NomeUsuario { get; set; }
        public string TituloServico { get; set; }
        public string DescricaoServico { get; set; }
        public string DescricaoAreaProfissional { get; set; }
        public DateTime? DataCriacao { get; set; }
    }
}
