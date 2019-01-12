using System;
using System.Collections.Generic;

namespace Works.Models.GruposTrabalho
{
    public class GruposTrabalhoModel
    {
        public int Id { get; set; }
        public string Titulo { get; set; }
        public string Descricao { get; set; }
        public int UsuarioId { get; set; }
        public string NomeUsuario { get; set; }
        public short Status { get; set; }
        public Boolean HabilitadoEscrever { get; set; }
        public DateTime DataCriacao { get; set; }

        public List<int> Participantes { get; set; }
        public List<int> Administradores { get; set; }
        public int? QtdeUsuarios { get; set; }
        public int? IdUltimaWorkstation { get; set; }
        public bool BastterBlueParticipante { get; set; }
        public bool CriadorGrupo { get; set; }
        public short Permissao { get; set; }
        public byte Admin { get; set; }
        public byte BastterBlue { get; set; }
        public int FiltrarMinhaWok { get; set; }


    }
}
