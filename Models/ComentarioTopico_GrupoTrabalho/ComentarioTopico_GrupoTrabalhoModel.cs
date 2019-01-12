using System;
namespace Works.Models.Comentario_GrupoTrabalho
{
    public class ComentarioTopico_GrupoTrabalhoModel
    {

        public int Id { get; set; }
        public int GrupoTrabalhoId { get; set; }
        public int Topico_GrupoTrabalhoId { get; set; }
        public int UsuarioId { get; set; }
        public string NomeUsuario { get; set; }
        public string Comentario { get; set; }
        public DateTime DataComentario { get; set; }
        public int UsuarioLogadoId { get; set; }

    }
}
