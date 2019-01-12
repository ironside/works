using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Works.Models.AreaProfissionalWork;
using Works.Models.OfertasWork;
using Works.Models.Usuario;

namespace Works.Controllers
{
    [Authorize]
    public class OfertasWorkController : Controller
    {

        [Authorize(Roles = "Assinante")]
        public ActionResult Ofertas()
        {
            var contexto = new ContextoAreaProfissionalWork();

            var model = contexto.AreaProfissionalWork.Where(s => s.Ativo == 1).OrderBy(s => s.NomeAreaProfissional).ToList();

            return View (model);
        }

        [HttpPost]
        [Authorize(Roles = "Assinante")]
        public ActionResult IncluirOfertaWork(OfertasWorkModel ofertaModel)
        {

            //Usuario Logado
            var usuarioLogadoId = Int32.Parse(User.Identity.Name);

            try
            {
                using (var db = new ContextoOfertasWork())
                {
                    T_Works_OfertasWork oferta = new T_Works_OfertasWork();
                    oferta.TituloOferta = ofertaModel.TituloOferta;
                    oferta.DescricaoOferta = ofertaModel.DescricaoOferta;
                    oferta.DataCriacao = DateTime.Now;
                    oferta.IdAreaProfissional = (int)ofertaModel.IdAreaProfissional;
                    oferta.UsuarioId = usuarioLogadoId;

                    var contexto = db.Set<T_Works_OfertasWork>();

                    contexto.Add(oferta);

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
        public ActionResult ListaOfertasWork(OfertasWorkModel ofertaModel)
        {

            var usuarioLogadoId = Int32.Parse(User.Identity.Name);


            using (var contexto = new ContextoOfertasWork())
            {

                var query = contexto.OfertasWork.Where(s => s.Id >= 0);

                #region PESQUISA

                if (!String.IsNullOrEmpty(ofertaModel.TituloOferta))
                {
                    query = query.Where(d => d.TituloOferta.Contains(ofertaModel.TituloOferta ?? ""));
                }

                if (!String.IsNullOrEmpty(ofertaModel.DescricaoOferta))
                {
                    query = query.Where(d => d.DescricaoOferta.Contains(ofertaModel.DescricaoOferta ?? ""));
                }

                if (ofertaModel.IdAreaProfissional != null)
                {
                    query = query.Where(d => d.IdAreaProfissional == ofertaModel.IdAreaProfissional);
                }
                #endregion

                var listGrupoTrabalho = query.OrderByDescending(s => s.DataCriacao).Take(100).ToList();

                var dbUsuario = new ContextoUsuario();
                var dbAreaProfissional = new ContextoAreaProfissionalWork();
                var model = new List<OfertasWorkModel>();

                foreach (var item in listGrupoTrabalho)
                {
                    var oferta = new OfertasWorkModel();
                    oferta.Id = item.Id;
                    oferta.UsuarioId = item.UsuarioId;
                    oferta.UsuarioLogadoId = usuarioLogadoId;
                    oferta.NomeUsuario = dbUsuario.Usuarios.Where(d => d.UsuarioID == item.UsuarioId).Select(d => d.Login).FirstOrDefault();
                    oferta.TituloOferta = item.TituloOferta;
                    oferta.DescricaoOferta = item.DescricaoOferta;
                    oferta.DescricaoAreaProfissional = dbAreaProfissional.AreaProfissionalWork.Where(d => d.Id == item.IdAreaProfissional).Select(s => s.NomeAreaProfissional).FirstOrDefault();
                    oferta.DataCriacao = item.DataCriacao;
                    model.Add(oferta);
                }

                return View(model);
            }
        }


        [HttpPost]
        [Authorize(Roles = "Assinante")]
        public ActionResult ExcluirOferta(int IdOferta)
        {
            try
            {
                //REMOVER OFERTA
                using (var db = new ContextoOfertasWork())
                {
                    var oferta = db.Set<T_Works_OfertasWork>();

                    var ofertaExcluir = oferta.Where(d => d.Id == IdOferta).FirstOrDefault();

                    db.OfertasWork.Remove(ofertaExcluir);
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
