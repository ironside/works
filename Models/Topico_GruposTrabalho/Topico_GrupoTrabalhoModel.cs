using System;
namespace Works.Models.Topico_GrupoTrabalho
{
    public class Topico_GrupoTrabalhoModel
    {

        public int Id { get; set; }
        public int GrupoTrabalhoId { get; set; }
        public int UsuarioId { get; set; }
        public string NomeUsuario { get; set; }
        public string TituloTopico { get; set; }
        public string ComentarioTopico { get; set; }
        public DateTime DataComentarioTopico { get; set; }
        public DateTime? DataUltimoComentarioTopico { get; set; }
        public int UsuarioLogadoId { get; set; }
        public int QtdeComentariosTopico { get; set; }
        public byte Admin { get; set; }

    }
}
