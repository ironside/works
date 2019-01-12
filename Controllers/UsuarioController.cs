using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Works.Models.Admin_GrupoTrabalho;
using Works.Models.Participante_GrupoTrabalho;
using Works.Models.Usuario;

namespace Works.Controllers
{
    public class UsuarioController : Controller
    {

        public ActionResult Participantes_Work(string usuario)
        {
            using (var db = new ContextoUsuario())
            {

                //Usuario Logado
                var usuarioId = User.Identity.Name;

                var list = db.Usuarios.Where(d => d.BastterBlue == 1).ToList().OrderByDescending(s => s.Login);

                ViewData["disabled"] = "";
                if (!string.IsNullOrEmpty(usuario))
                {
                    ViewData["disabled"] = (usuarioId == usuario ? "" : "disabled");
                }

                return View(list);
            }
        }

      
        public ActionResult Participantes_WorkConsulta(int grupoTrabalhoId)
        {
            using (var db = new ContextoParticipante_GrupoTrabalho())
            {
                var list = db.Participante_GrupoTrabalho.Where(d => d.GrupoTrabalhoId == grupoTrabalhoId).ToList().OrderByDescending(s => s.UsuarioId);
                var contextoUsuario = new ContextoUsuario();
                var model = new List<UsuarioModel>();

                foreach (var item in list)
                {
                    var usuario = new UsuarioModel();
                    usuario.UsuarioID = item.UsuarioId;
                    usuario.Login = contextoUsuario.Usuarios.Where(d => d.UsuarioID == item.UsuarioId).Select(s => s.Login).FirstOrDefault();
                    model.Add(usuario);
                }

                return View(model);
            }
        }


        public ActionResult Admin_Work(string usuario)
        {
            using (var db = new ContextoUsuario())
            {

                //Usuario Logado
                var usuarioId = User.Identity.Name;

                var list = db.Usuarios.Where(d => d.BastterBlue == 1).ToList().OrderByDescending(s => s.Login);

                ViewData["disabled"] = "";
                if (!string.IsNullOrEmpty(usuario))
                {
                    ViewData["disabled"] = (usuarioId == usuario ? "" : "disabled");
                }


                return View(list);
            }
        }

       
        public ActionResult Admin_WorkConsulta(int grupoTrabalhoId)
        {
            using (var db = new ContextoAdmin_GrupoTrabalho())
            {
                var list = db.Admin_GrupoTrabalho.Where(d => d.GrupoTrabalhoId == grupoTrabalhoId).ToList().OrderByDescending(s => s.UsuarioId);
                var contextoUsuario = new ContextoUsuario();
                var model = new List<UsuarioModel>();

                foreach (var item in list)
                {
                    var usuario = new UsuarioModel();
                    usuario.UsuarioID = item.UsuarioId;
                    usuario.Login = contextoUsuario.Usuarios.Where(d => d.UsuarioID == item.UsuarioId).Select(s => s.Login).FirstOrDefault() ;
                    model.Add(usuario);
                }

                return View(model);
            }
        }
    }
}
