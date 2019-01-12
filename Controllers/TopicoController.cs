using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Works.Models.Topico_GrupoTrabalho;
using Works.Models.Participante_GrupoTrabalho;
using Works.Models.Usuario;
using Works.Models.ComentarioTopico_GrupoTrabalho;

namespace Works.Controllers
{
    [Authorize]
    public class TopicoController : Controller
    {
        [HttpPost]
        [Authorize(Roles = "Assinante")]
        public ActionResult SalvarNovoTopico(T_Works_Topico_GrupoTrabalho Topico_GrupoTrabalho)
        {

            //Usuario Logado
            var usuarioLogadoId = Int32.Parse(User.Identity.Name);

            try
            {
                if (Topico_GrupoTrabalho.ComentarioTopico != null)
                {
                    using (var db = new ContextoTopico_GrupoTrabalho())
                    {
                        var grupo = db.Set<T_Works_Topico_GrupoTrabalho>();
                        grupo.Add(new T_Works_Topico_GrupoTrabalho { GrupoTrabalhoId = Topico_GrupoTrabalho.GrupoTrabalhoId, UsuarioId = usuarioLogadoId, ComentarioTopico = Topico_GrupoTrabalho.ComentarioTopico, TituloTopico = Topico_GrupoTrabalho.TituloTopico, DataComentarioTopico = DateTime.Now });
                        db.SaveChanges();

                    };
                }
               
                //VERIFICAR SE ESTÁ NA LISTA PARTICIPANTES, CASO CONTRÁRIO ADICIONA-O
                using (var db = new ContextoParticipante_GrupoTrabalho())
                {
                    var participantes = db.Set<T_Works_Participante_GrupoTrabalho>();

                    var pessoas = participantes.Where(d =>  d.UsuarioId == usuarioLogadoId && d.GrupoTrabalhoId == Topico_GrupoTrabalho.GrupoTrabalhoId).ToList();

                    if (!pessoas.Select(s => s.UsuarioId == usuarioLogadoId).Any() )
                    {
                        participantes.Add(new T_Works_Participante_GrupoTrabalho { GrupoTrabalhoId = Topico_GrupoTrabalho.GrupoTrabalhoId, UsuarioId = usuarioLogadoId });
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
        public ActionResult SalvarAlteracaoTopico(T_Works_Topico_GrupoTrabalho Topico_GrupoTrabalho)
        {

            //Usuario Logado
            var usuarioLogadoId = Int32.Parse(User.Identity.Name);

            try
            {
                if (Topico_GrupoTrabalho.ComentarioTopico != null)
                {
                    //ALTERAR Topico
                    using (var db = new ContextoTopico_GrupoTrabalho())
                    {
                        var TopicoGrupoTrabalho = db.Set<T_Works_Topico_GrupoTrabalho>();

                        var Topico = TopicoGrupoTrabalho.Where(d => d.Id == Topico_GrupoTrabalho.Id && d.GrupoTrabalhoId == Topico_GrupoTrabalho.GrupoTrabalhoId).FirstOrDefault();

                        Topico.ComentarioTopico = Topico_GrupoTrabalho.ComentarioTopico;

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
        public ActionResult ExcluirTopico(T_Works_Topico_GrupoTrabalho Topico_GrupoTrabalho)
        {
            try
            {
                //REMOVER COMENTARIOS DO TOPICO
                using (var db = new ContextoComentarioTopico_GrupoTrabalho())
                {
                    var comentarios = db.Set<T_Works_ComentarioTopico_GrupoTrabalho>();

                    var listaComentarios = comentarios.Where(d => d.GrupoTrabalhoId == Topico_GrupoTrabalho.GrupoTrabalhoId && d.Topico_GrupoTrabalhoId == Topico_GrupoTrabalho.Id).ToList();

                    db.ComentarioTopico_GrupoTrabalho.RemoveRange(listaComentarios);
                    db.SaveChanges();
                };

                //REMOVER TOPICO DO GRUPO
                using (var db = new ContextoTopico_GrupoTrabalho())
                {
                    var topico = db.Set<T_Works_Topico_GrupoTrabalho>();

                    var listaTopicos = topico.Where(d => d.GrupoTrabalhoId == Topico_GrupoTrabalho.GrupoTrabalhoId  && d.Id == Topico_GrupoTrabalho.Id).ToList();

                    db.Topico_GrupoTrabalho.RemoveRange(listaTopicos);
                    db.SaveChanges();
                };

       
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return Json(new { success = true, mensagem = "sucesso" }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [Authorize(Roles = "Assinante")]
        public ActionResult ListaTopicoGrupoTrabalho(int Id)
        {
            //Usuario Logado
            var usuarioLogadoId = Int32.Parse(User.Identity.Name);

            using (var db = new ContextoTopico_GrupoTrabalho())
            {
                var list = db.Topico_GrupoTrabalho.Where(d => d.GrupoTrabalhoId == Id).OrderByDescending(s => s.DataComentarioTopico);

                var model = new List<Topico_GrupoTrabalhoModel>();
                var dbUsuario = new ContextoUsuario();
                var dbComentariosTopico = new ContextoComentarioTopico_GrupoTrabalho();

                var usuarioAdmin = dbUsuario.Usuarios.Where(d => d.UsuarioID == usuarioLogadoId).Select(item => new UsuarioModel
                {
                    Admin = item.Admin
                }).FirstOrDefault();




                foreach (var item in list)
                {
                    var Topico = new Topico_GrupoTrabalhoModel();
                    Topico.Id = item.Id;
                    Topico.Admin = usuarioAdmin.Admin;
                    Topico.GrupoTrabalhoId = item.GrupoTrabalhoId;
                    Topico.TituloTopico = item.TituloTopico;
                    Topico.ComentarioTopico = item.ComentarioTopico;
                    Topico.UsuarioId = item.UsuarioId;
                    Topico.NomeUsuario = dbUsuario.Usuarios.Where(d => d.UsuarioID == item.UsuarioId).Select(s => s.Nome).FirstOrDefault();
                    Topico.DataComentarioTopico = item.DataComentarioTopico;
                    Topico.UsuarioLogadoId = usuarioLogadoId;
                    Topico.QtdeComentariosTopico = dbComentariosTopico.ComentarioTopico_GrupoTrabalho.Where(s => s.GrupoTrabalhoId == item.GrupoTrabalhoId && s.Topico_GrupoTrabalhoId == item.Id).Count();
                    Topico.DataUltimoComentarioTopico = dbComentariosTopico.ComentarioTopico_GrupoTrabalho.Where(s => s.GrupoTrabalhoId == item.GrupoTrabalhoId && s.Topico_GrupoTrabalhoId == item.Id).OrderByDescending(s => s.DataComentario).Select(s => s.DataComentario).FirstOrDefault();
                    model.Add(Topico);
                }

                model = model.OrderByDescending(s => s.DataUltimoComentarioTopico).ToList();


                return View(model);
            }
        }
    }
}
