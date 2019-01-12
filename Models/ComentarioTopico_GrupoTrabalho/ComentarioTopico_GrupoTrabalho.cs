using System;
using Works.Models.Usuario;

namespace Works.Models.ComentarioTopico_GrupoTrabalho
{
    public class T_Works_ComentarioTopico_GrupoTrabalho
    {
        public int Id { get; set; }
        public int GrupoTrabalhoId { get; set; }
        public int Topico_GrupoTrabalhoId { get; set; }
        public int UsuarioId { get; set; }
        public string Comentario { get; set; }
        public DateTime DataComentario { get; set; }

    }
}
