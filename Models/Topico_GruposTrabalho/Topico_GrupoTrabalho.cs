using System;

namespace Works.Models.Topico_GrupoTrabalho
{
    public class T_Works_Topico_GrupoTrabalho
    {
        public int Id { get; set; }
        public int GrupoTrabalhoId { get; set; }
        public int UsuarioId { get; set; }
        public string TituloTopico { get; set; }
        public string ComentarioTopico { get; set; }
        public DateTime DataComentarioTopico { get; set; }
    }
}
