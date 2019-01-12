using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Works.Models.AreaProfissionalWork;
using Works.Models.ServicosOferecidosWork;
using Works.Models.Usuario;

namespace Works.Controllers
{

    [Authorize]
    public class ServicosOferecidosWorkController : Controller
    {

        [Authorize(Roles = "Assinante")]
        public ActionResult Servicos()
        {

            var contexto = new ContextoAreaProfissionalWork();

            var model = contexto.AreaProfissionalWork.Where(s => s.Ativo == 1).OrderBy(s => s.NomeAreaProfissional).ToList();


            return View(model);
        }

        [HttpPost]
        [Authorize(Roles = "Assinante")]
        public ActionResult IncluirServicoWork(ServicosOferecidosWorkModel servicoModel)
        {

            //Usuario Logado
            var usuarioLogadoId = Int32.Parse(User.Identity.Name);

            try
            {
                using (var db = new ContextoServicosOferecidosWork())
                {
                    T_Works_ServicosOferecidosWork servico = new T_Works_ServicosOferecidosWork();
                    servico.TituloServico = servicoModel.TituloServico;
                    servico.DescricaoServico = servicoModel.DescricaoServico;
                    servico.DataCriacao = DateTime.Now;
                    servico.IdAreaProfissional = (int)servicoModel.IdAreaProfissional;
                    servico.UsuarioId = usuarioLogadoId;

                    var contexto = db.Set<T_Works_ServicosOferecidosWork>();

                    contexto.Add(servico);

                    var result = db.SaveChanges();
                };
             
            }
            catch (Exception ex)
            {
                return Json(new { success = false, mensagem = ex.Message }, JsonRequestBehavior.AllowGet); ;
            }

            return Json(new { success = true, mensagem = "sucesso"  }, JsonRequestBehavior.AllowGet);
        }


        [HttpPost]
        [Authorize(Roles = "Assinante")]
        public ActionResult ListaServicosOferecidosWork(ServicosOferecidosWorkModel servicoModel)
        {
               
            var usuarioLogadoId = Int32.Parse(User.Identity.Name);

             
            using (var contexto = new ContextoServicosOferecidosWork())
            {

                var query = contexto.ServicosOferecidosWork.Where(s => s.Id >= 0);

                #region PESQUISA

                if (!String.IsNullOrEmpty(servicoModel.TituloServico))
                {
                    query = query.Where(d => d.TituloServico.Contains(servicoModel.TituloServico ?? ""));
                }

                if (!String.IsNullOrEmpty(servicoModel.DescricaoServico))
                {
                    query = query.Where(d => d.DescricaoServico.Contains(servicoModel.DescricaoServico ?? ""));
                }

                if (servicoModel.IdAreaProfissional != null)
                {
                    query = query.Where(d => d.IdAreaProfissional == servicoModel.IdAreaProfissional);
                }
                #endregion

                var listGrupoTrabalho = query.OrderByDescending(s => s.DataCriacao).Take(100).ToList();

                var dbUsuario = new ContextoUsuario();
                var dbAreaProfissional = new ContextoAreaProfissionalWork();
                var model = new List<ServicosOferecidosWorkModel>();

                foreach (var item in listGrupoTrabalho)
                {
                    var servico = new ServicosOferecidosWorkModel();
                    servico.Id = item.Id;
                    servico.UsuarioId = item.UsuarioId;
                    servico.UsuarioLogadoId = usuarioLogadoId;
                    servico.NomeUsuario = dbUsuario.Usuarios.Where(d => d.UsuarioID == item.UsuarioId).Select(d => d.Login).FirstOrDefault();
                    servico.TituloServico = item.TituloServico;
                    servico.DescricaoServico = item.DescricaoServico;
                    servico.DescricaoAreaProfissional =  dbAreaProfissional.AreaProfissionalWork.Where(d => d.Id == item.IdAreaProfissional).Select(s => s.NomeAreaProfissional).FirstOrDefault();
                    servico.DataCriacao = item.DataCriacao;
                    model.Add(servico);
                }

                return View(model);
            }
        }


        [HttpPost]
        [Authorize(Roles = "Assinante")]
        public ActionResult ExcluirServico(int IdServico)
        {
            try
            {   
                //REMOVER SERVICO
                using (var db = new ContextoServicosOferecidosWork())
                {
                    var servico = db.Set<T_Works_ServicosOferecidosWork>();

                    var servicoOferecido = servico.Where(d => d.Id == IdServico).FirstOrDefault();

                    db.ServicosOferecidosWork.Remove(servicoOferecido);
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
