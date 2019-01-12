using System;

namespace Works.Models.GruposTrabalho
{
    public class T_Works_GruposTrabalho
    {
        public int Id { get; set; }
        public string Titulo { get; set; }
        public string Descricao { get; set; }
        public int UsuarioId { get; set; }
        public short Status { get; set; }
        public short Permissao { get; set; }
        public DateTime DataCriacao { get; set; }
    }
}
