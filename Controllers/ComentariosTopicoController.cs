using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Works.Models.Comentario_GrupoTrabalho;
using Works.Models.ComentarioTopico_GrupoTrabalho;
using Works.Models.Participante_GrupoTrabalho;
using Works.Models.Usuario;

namespace Works.Controllers
{
    [Authorize]
    public class ComentariosTopicoController : Controller
    {
        [HttpPost]
        [Authorize(Roles = "Assinante")]
        public ActionResult SalvarComentario(T_Works_ComentarioTopico_GrupoTrabalho comentario_GrupoTrabalho)
        {

            //Usuario Logado
            var usuarioLogadoId = Int32.Parse(User.Identity.Name);

            try
            {
                if (comentario_GrupoTrabalho.Comentario != null)
                {
                    using (var db = new ContextoComentarioTopico_GrupoTrabalho())
                    {
                        var comentarioTopico = db.Set<T_Works_ComentarioTopico_GrupoTrabalho>();
                        comentarioTopico.Add(new T_Works_ComentarioTopico_GrupoTrabalho { Topico_GrupoTrabalhoId = comentario_GrupoTrabalho.Topico_GrupoTrabalhoId,  GrupoTrabalhoId = comentario_GrupoTrabalho.GrupoTrabalhoId, UsuarioId = usuarioLogadoId, Comentario = comentario_GrupoTrabalho.Comentario, DataComentario = DateTime.Now });
                        db.SaveChanges();

                    };
                }
               
                //VERIFICAR SE ESTÁ NA LISTA PARTICIPANTES, CASO CONTRÁRIO ADICIONA-O
                using (var db = new ContextoParticipante_GrupoTrabalho())
                {
                    var participantes = db.Set<T_Works_Participante_GrupoTrabalho>();

                    var pessoas = participantes.Where(d =>  d.UsuarioId == usuarioLogadoId && d.GrupoTrabalhoId == comentario_GrupoTrabalho.GrupoTrabalhoId).ToList();

                    if (!pessoas.Select(s => s.UsuarioId == usuarioLogadoId).Any() )
                    {
                        participantes.Add(new T_Works_Participante_GrupoTrabalho { GrupoTrabalhoId = comentario_GrupoTrabalho.GrupoTrabalhoId, UsuarioId = usuarioLogadoId });
                        db.SaveChanges();
                    }
                };
            }
            catch (Exception ex)
            {
                return Json(new { success = false, mensagem = ex.Message }, JsonRequestBehavior.AllowGet);
            }

            return Json(new { success = true, mensagem = "Comentário adicionado!" }, JsonRequestBehavior.AllowGet);
        }


        [HttpPost]
        [Authorize(Roles = "Assinante")]
        public ActionResult ExcluirComentarioTopico(ComentarioTopico_GrupoTrabalhoModel comentarioTopico)
        {
            try
            {
                //REMOVER COMENTARIO DO TOPICO
                using (var db = new ContextoComentarioTopico_GrupoTrabalho())
                {
                    var dbComentario = db.Set<T_Works_ComentarioTopico_GrupoTrabalho>();

                    var comentario = dbComentario.Where(d => d.GrupoTrabalhoId == comentarioTopico.GrupoTrabalhoId && d.Topico_GrupoTrabalhoId == comentarioTopico.Topico_GrupoTrabalhoId && d.Id == comentarioTopico.Id).FirstOrDefault();

                    db.ComentarioTopico_GrupoTrabalho.Remove(comentario);
                    db.SaveChanges();
                };

            }
            catch (Exception ex)
            {
                return Json(new { success = false, mensagem = ex.Message }, JsonRequestBehavior.AllowGet);
            }

            return Json(new { success = true, mensagem = "sucesso" }, JsonRequestBehavior.AllowGet);
        }



        [HttpPost]
        [Authorize(Roles = "Assinante")]
        public ActionResult SalvarAlteracaoComentario(T_Works_ComentarioTopico_GrupoTrabalho comentario_GrupoTrabalho)
        {

            //Usuario Logado
            var usuarioLogadoId = Int32.Parse(User.Identity.Name);

            try
            {
                if (comentario_GrupoTrabalho.Comentario != null)
                {
                    //ALTERAR COMENTARIO
                    using (var db = new ContextoComentarioTopico_GrupoTrabalho())
                    {
                        var comentarioTopicoGrupoTrabalho = db.Set<T_Works_ComentarioTopico_GrupoTrabalho>();

                        var comentarioTopico = comentarioTopicoGrupoTrabalho.Where(d => d.Id == comentario_GrupoTrabalho.Id && d.GrupoTrabalhoId == comentario_GrupoTrabalho.GrupoTrabalhoId && d.Topico_GrupoTrabalhoId == comentario_GrupoTrabalho.Topico_GrupoTrabalhoId).FirstOrDefault();

                        comentarioTopico.Comentario = comentario_GrupoTrabalho.Comentario;

                        db.SaveChanges();
                    };
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, mensagem = ex.Message }, JsonRequestBehavior.AllowGet);
            }

            return Json(new { success = true, mensagem = "Comentário alterado!" }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [Authorize(Roles = "Assinante")]
        public ActionResult ListaComentarioTopicoGrupoTrabalho(ComentarioTopico_GrupoTrabalhoModel comentarioTopico)
        {
            //Usuario Logado
            int usuarioLogadoId = Int32.Parse(User.Identity.Name);

            using (var db = new ContextoComentarioTopico_GrupoTrabalho())
            {
                var list = db.ComentarioTopico_GrupoTrabalho.Where(d => d.GrupoTrabalhoId == comentarioTopico.GrupoTrabalhoId && d.Topico_GrupoTrabalhoId == comentarioTopico.Topico_GrupoTrabalhoId).OrderByDescending(s => s.DataComentario);

                var model = new List<ComentarioTopico_GrupoTrabalhoModel>();
                var dbUsuario = new ContextoUsuario();

                foreach (var item in list)
                {
                    var comentario = new ComentarioTopico_GrupoTrabalhoModel();
                    comentario.Id = item.Id;
                    comentario.GrupoTrabalhoId = item.GrupoTrabalhoId;
                    comentario.Topico_GrupoTrabalhoId = item.Topico_GrupoTrabalhoId;
                    comentario.Comentario = item.Comentario;
                    comentario.UsuarioId = item.UsuarioId;
                    comentario.NomeUsuario = dbUsuario.Usuarios.Where(d => d.UsuarioID == item.UsuarioId).Select(s => s.Nome).FirstOrDefault();
                    comentario.DataComentario = item.DataComentario;
                    comentario.UsuarioLogadoId = usuarioLogadoId;
                    model.Add(comentario);
                }

                return View(model);
            }
        }

    }
}
