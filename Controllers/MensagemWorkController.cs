using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Works.Models.MensagemWork;
using Works.Models.Usuario;

namespace Works.Controllers
{
    [Authorize]
    public class MensagemWorkController : Controller
    {

        [HttpPost]
        [Authorize(Roles = "Assinante")]
        public ActionResult IncluirMensagemWork(MensagemWorkModel mensagemModel)
        {

            //Usuario Logado
            var usuarioLogadoId = Int32.Parse(User.Identity.Name);

            try
            {
                using (var db = new ContextoMensagemWork())
                {
                    T_Works_MensagemWork mensagem = new T_Works_MensagemWork();
                    mensagem.UsuarioId = mensagemModel.UsuarioId;
                    mensagem.UsuarioRemetenteId = usuarioLogadoId;
                    mensagem.DescricaoMensagemWork = mensagemModel.DescricaoMensagemWork;
                    mensagem.DataMensagem = DateTime.Now;
                   
                    var contexto = db.Set<T_Works_MensagemWork>();

                    contexto.Add(mensagem);

                    var result = db.SaveChanges();
                };

            }
            catch (Exception ex)
            {
                return Json(new { success = false, mensagem = ex.Message }, JsonRequestBehavior.AllowGet); ;
            }

            return Json(new { success = true, mensagem = "sucesso" }, JsonRequestBehavior.AllowGet);
        }


        [HttpPost]
        [Authorize(Roles = "Assinante")]
        public ActionResult ListaMensagemWork(MensagemWorkModel mensagemModel)
        {
            var usuarioLogadoId = Int32.Parse(User.Identity.Name);

            using (var contexto = new ContextoMensagemWork())
            {
                var listMesagem = contexto.MensagemWork.Where(s => s.UsuarioId == usuarioLogadoId).OrderByDescending(s => s.DataMensagem).ToList();

                var dbUsuario = new ContextoUsuario();
                var model = new List<MensagemWorkModel>();

                foreach (var item in listMesagem)
                {
                    var mensagem = new MensagemWorkModel();
                    mensagem.Id = item.Id;
                    mensagem.UsuarioRemetenteId = item.UsuarioRemetenteId;
                    mensagem.NomeUsuarioRemetenteId = dbUsuario.Usuarios.Where(d => d.UsuarioID == item.UsuarioRemetenteId).Select(d => d.Login).FirstOrDefault();
                    mensagem.DescricaoMensagemWork = item.DescricaoMensagemWork;
                    mensagem.DataMensagem = item.DataMensagem;
                    model.Add(mensagem);
                }


                //ALTERAR MENSAGEM NÃO LIDA PARA LIDA
                using (var dbMensagem = new ContextoMensagemWork())
                {
                    var mensagemWork = dbMensagem.Set<T_Works_MensagemWork>();

                    var mensagem  = mensagemWork.Where(d => d.UsuarioId == usuarioLogadoId && d.MensagemLida == 0).ToList();

                    foreach (T_Works_MensagemWork item in mensagem)
                    {
                        item.MensagemLida = 1;
                    }

                    dbMensagem.SaveChanges();
                };

                return View(model);
            }
        }

        [HttpPost]
        [Authorize(Roles = "Assinante")]
        public ActionResult ListaMensagemWorkAdmin(MensagemWorkModel mensagemModel)
        {
            var usuarioLogadoId = Int32.Parse(User.Identity.Name);

            using (var contexto = new ContextoMensagemWork())
            {
                var listMesagem = contexto.MensagemWork.Where(s => s.Id > 0).OrderByDescending(s => s.DataMensagem).ToList();

                var dbUsuario = new ContextoUsuario();
                var model = new List<MensagemWorkModel>();

                foreach (var item in listMesagem)
                {
                    var mensagem = new MensagemWorkModel();
                    mensagem.Id = item.Id;
                    mensagem.UsuarioRemetenteId = item.UsuarioRemetenteId;
                    mensagem.NomeUsuarioRemetenteId = dbUsuario.Usuarios.Where(d => d.UsuarioID == item.UsuarioRemetenteId).Select(d => d.Login).FirstOrDefault();
                    mensagem.DescricaoMensagemWork = item.DescricaoMensagemWork;
                    mensagem.DataMensagem = item.DataMensagem;
                    model.Add(mensagem);
                }


                //ALTERAR MENSAGEM ADMIN NÃO LIDA PARA LIDA
                using (var dbMensagem = new ContextoMensagemWork())
                {
                    var mensagemWork = dbMensagem.Set<T_Works_MensagemWork>();

                    var mensagem = mensagemWork.Where(d => d.MensagemLidaAdmin == 0).ToList();

                    foreach (T_Works_MensagemWork item in mensagem)
                    {
                        item.MensagemLidaAdmin = 1;
                    }

                    dbMensagem.SaveChanges();
                };

                return View(model);
            }
        }


        [HttpPost]
        [Authorize(Roles = "Assinante")]
        public ActionResult ExcluirMensagem(int IdMensagem)
        {
            try
            {
                //REMOVER MENSAGEM
                using (var db = new ContextoMensagemWork())
                {
                    var mensagem = db.Set<T_Works_MensagemWork>();

                    var mensagemExcluir = mensagem.Where(d => d.Id == IdMensagem).FirstOrDefault();

                    db.MensagemWork.Remove(mensagemExcluir);
                    db.SaveChanges();
                };

            }
            catch (Exception ex)
            {
                return Json(new { success = false, mensagem = ex.Message }, JsonRequestBehavior.AllowGet);
            }

            return Json(new { success = true, mensagem = "sucesso" }, JsonRequestBehavior.AllowGet);
        }
    }
}
