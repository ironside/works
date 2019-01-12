using System;

namespace Works.Models.MensagemWork
{
    public class T_Works_MensagemWork
    {
        public int Id { get; set; }
        public int UsuarioId { get; set; }
        public int UsuarioRemetenteId { get; set; }
        public string DescricaoMensagemWork { get; set; }
        public DateTime DataMensagem { get; set; }
        public int MensagemLida { get; set; }
        public int MensagemLidaAdmin { get; set; }
    }
}
