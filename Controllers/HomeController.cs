using System;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using Works.Models.MensagemWork;
using Works.Models.Usuario;


namespace Works.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {

        [AllowAnonymous]
        public ActionResult Index()
        {

            Session["UsuarioID"] = "1";
            Session["Admin"] = "True";
            Session["Assinante"] = "True";

            if (Session.Count > 0)
            {
                var UsuarioID = Session["UsuarioID"].ToString();

                var Admin = Session["Admin"].ToString() == "True";

                var Assinante = Session["Admin"].ToString() == "True" || (Session["Assinante"] != null && bool.Parse(Session["Assinante"].ToString()));

                // usuario NAO logado
                if (string.IsNullOrEmpty(UsuarioID) || UsuarioID == "0")
                {
                    CreateAuthorizeTicket("", "NaoLogado");
                }

                // usuario assinante
                if (Assinante)
                {
                    CreateAuthorizeTicket(UsuarioID.ToString(), "Assinante");
                }
            }

            // usuario NAO logado
            if (Session.Count == 0)
            {
                CreateAuthorizeTicket("", "NaoLogado");
            }


            var modelUsuario = new UsuarioModel();

            //Usuario Logado
            if (User.Identity.Name != "0" && !string.IsNullOrEmpty(User.Identity.Name))
            {
                var usuarioLogadoId = Int32.Parse(User.Identity.Name);

                var dbUser = new ContextoUsuario();
                var dbMensagem = new ContextoMensagemWork();

                modelUsuario = dbUser.Usuarios.Where(d => d.UsuarioID == usuarioLogadoId).Select(item => new UsuarioModel
                {
                    UsuarioID = item.UsuarioID,
                    BastterBlue = item.BastterBlue,
                    Admin = item.Admin
                }).FirstOrDefault();

                modelUsuario.MensagensNaoLidas = dbMensagem.MensagemWork.Where(d => d.UsuarioId == usuarioLogadoId && d.MensagemLida == 0).Count();
                modelUsuario.MensagensNaoLidasAdmin = dbMensagem.MensagemWork.Where(d => d.MensagemLidaAdmin == 0).Count();
            }


            return View(modelUsuario);
        }

        public void LogOff()
        {
            FormsAuthentication.SignOut();
        }

        public void CreateAuthorizeTicket(string userId, string roles)
        {

            var authTicket = new FormsAuthenticationTicket(
              1,
              userId,  // Id do usuário é muito importante
              DateTime.Now,
              DateTime.Now.AddMinutes(5000),  // validade min session
              false,   // Se você deixar true, o cookie ficará no PC do usuário
              roles);
             
            string encrypetedTicket = FormsAuthentication.Encrypt(authTicket);
            FormsAuthentication.SetAuthCookie(encrypetedTicket, false);

            var cookie = new HttpCookie(FormsAuthentication.FormsCookieName, FormsAuthentication.Encrypt(authTicket));
            Response.Cookies.Add(cookie);

        }

      
    }
}
