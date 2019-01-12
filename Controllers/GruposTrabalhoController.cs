using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Works.Models.Admin_GrupoTrabalho;
using Works.Models.ComentarioTopico_GrupoTrabalho;
using Works.Models.GruposTrabalho;
using Works.Models.Participante_GrupoTrabalho;
using Works.Models.Topico_GrupoTrabalho;
using Works.Models.Usuario;

namespace Works.Controllers
{

    [Authorize]
    public class GruposTrabalhoController : Controller
    {

        [HttpPost]
        public ActionResult ListaGruposTrabalho(GruposTrabalhoModel gruposTrabalho)
        {
            //Usuario Logado
            var modelUsuarioLogado = new UsuarioModel();
            var model = new List<GruposTrabalhoModel>();

            if (!string.IsNullOrEmpty(User.Identity.Name))
            {
                var usuarioLogadoId = Int32.Parse(User.Identity.Name);

                var dbUser = new ContextoUsuario();

                modelUsuarioLogado = dbUser.Usuarios.Where(d => d.UsuarioID == usuarioLogadoId).Select(item => new UsuarioModel
                {
                    UsuarioID = item.UsuarioID,
                    BastterBlue = item.BastterBlue,
                    Admin = item.Admin
                }).FirstOrDefault();

                using (var contextoGrupo = new ContextoGrupoTrabalho())
                {

                    var query = contextoGrupo.GruposTrabalho.Where(s => gruposTrabalho.IdUltimaWorkstation == 0 ? s.Id >= 0 : s.Id >= (gruposTrabalho.IdUltimaWorkstation - 10) && s.Id < gruposTrabalho.IdUltimaWorkstation);

                    #region PESQUISA

                    if (!String.IsNullOrEmpty(gruposTrabalho.Titulo))
                    {
                        query = query.Where(d => d.Titulo.Contains(gruposTrabalho.Titulo ?? ""));
                    }

                    if (!String.IsNullOrEmpty(gruposTrabalho.Descricao))
                    {
                        query = query.Where(d => d.Descricao.Contains(gruposTrabalho.Descricao ?? ""));
                    }

                    if (gruposTrabalho.FiltrarMinhaWok == 1)
                    {
                        query = query.Where(d => d.UsuarioId == modelUsuarioLogado.UsuarioID);
                    }
                    #endregion

                    if (query.Any())
                    {
                        var listGrupoTrabalho = query.OrderByDescending(s => s.DataCriacao).Take(10).ToList();
                        var contextoParticipante = new ContextoParticipante_GrupoTrabalho();

                        foreach (var item in listGrupoTrabalho)
                        {
                            var grupo = new GruposTrabalhoModel();
                            grupo.Id = item.Id;
                            grupo.Titulo = item.Titulo;
                            grupo.Descricao = item.Descricao;
                            grupo.UsuarioId = item.UsuarioId;
                            grupo.Status = item.Status;
                            grupo.DataCriacao = item.DataCriacao;
                            grupo.QtdeUsuarios = contextoParticipante.Participante_GrupoTrabalho.Where(d => d.GrupoTrabalhoId == item.Id).Count();
                            grupo.CriadorGrupo = item.UsuarioId == modelUsuarioLogado.UsuarioID;
                            grupo.Admin = modelUsuarioLogado.Admin;
                            grupo.BastterBlue = modelUsuarioLogado.BastterBlue;
                            grupo.Permissao = item.Permissao;
                            grupo.BastterBlueParticipante = contextoParticipante.Participante_GrupoTrabalho.Where(d => d.GrupoTrabalhoId == item.Id && d.UsuarioId == modelUsuarioLogado.UsuarioID).Any();
                            model.Add(grupo);
                        }
                    }

                }
            }

            return View(model);
        }

        [HttpPost]
        public ActionResult CarregarMaisListaGruposTrabalho(GruposTrabalhoModel gruposTrabalho)
        {
            //Usuario Logado
            var modelUsuarioLogado = new UsuarioModel();

            if (!string.IsNullOrEmpty(User.Identity.Name))
            {
                var usuarioLogadoId = Int32.Parse(User.Identity.Name);

                var dbUser = new ContextoUsuario();

                modelUsuarioLogado = dbUser.Usuarios.Where(d => d.UsuarioID == usuarioLogadoId).Select(item => new UsuarioModel
                {
                    UsuarioID = item.UsuarioID,
                    BastterBlue = item.BastterBlue,
                    Admin = item.Admin
                }).FirstOrDefault();
            }

            using (var contextoGrupo = new ContextoGrupoTrabalho())
            {

                var query = contextoGrupo.GruposTrabalho.Where(s => gruposTrabalho.IdUltimaWorkstation == 0 ? s.Id >= 0 : s.Id >= (gruposTrabalho.IdUltimaWorkstation - 10) && s.Id < gruposTrabalho.IdUltimaWorkstation).OrderByDescending(d => d.Id).Take(10);

                #region PESQUISA


                if (!String.IsNullOrEmpty(gruposTrabalho.Titulo))
                {
                    query = query.Where(d => d.Titulo.Contains(gruposTrabalho.Titulo ?? ""));
                }

                if (!String.IsNullOrEmpty(gruposTrabalho.Descricao))
                {
                    query = query.Where(d => d.Descricao.Contains(gruposTrabalho.Descricao ?? ""));
                }

                #endregion

                var listGrupoTrabalho = query.OrderByDescending(s => s.DataCriacao).ToList();
                var contextoParticipante = new ContextoParticipante_GrupoTrabalho();


                var model = new List<GruposTrabalhoModel>();

                foreach (var item in listGrupoTrabalho)
                {
                    var grupo = new GruposTrabalhoModel();
                    grupo.Id = item.Id;
                    grupo.Titulo = item.Titulo;
                    grupo.Descricao = item.Descricao;
                    grupo.UsuarioId = item.UsuarioId;
                    grupo.Status = item.Status;
                    grupo.DataCriacao = item.DataCriacao;
                    grupo.QtdeUsuarios = contextoParticipante.Participante_GrupoTrabalho.Where(d => d.GrupoTrabalhoId == item.Id).Count();
                    grupo.CriadorGrupo = item.UsuarioId == modelUsuarioLogado.UsuarioID;
                    grupo.Admin = modelUsuarioLogado.Admin;
                    grupo.BastterBlue = modelUsuarioLogado.BastterBlue;
                    grupo.Permissao = item.Permissao;
                    grupo.BastterBlueParticipante = contextoParticipante.Participante_GrupoTrabalho.Where(d => d.GrupoTrabalhoId == item.Id && d.UsuarioId == modelUsuarioLogado.UsuarioID).Any();
                    model.Add(grupo);

                }

                return PartialView(model);
            }
            
        }

        [HttpPost]
        [Authorize(Roles = "Assinante")]
        public ActionResult SalvarGrupoTrabalho(GruposTrabalhoModel gruposTrabalho)
        {

            //Usuario Logado
            var usuarioLogadoId = Int32.Parse(User.Identity.Name);

            int novoIdGrupo = 0;
            try
            {
                //ADICIONAR O GRUPO
                if (gruposTrabalho.Titulo != null && gruposTrabalho.Descricao != null) {
                    using (var db = new ContextoGrupoTrabalho())
                    {
                        T_Works_GruposTrabalho grupos = new T_Works_GruposTrabalho();
                        grupos.Titulo = gruposTrabalho.Titulo;
                        grupos.Descricao = gruposTrabalho.Descricao;
                        grupos.DataCriacao = DateTime.Now;
                        grupos.UsuarioId = usuarioLogadoId;

                        var contexto = db.Set<T_Works_GruposTrabalho>();

                        contexto.Add(grupos);

                        var result = db.SaveChanges();

                        novoIdGrupo = grupos.Id;

                    };
                }

                // CRIADOR DO GRUPO É O ADMIN
                using (var db = new ContextoAdmin_GrupoTrabalho())
                {
                    var administradores = db.Set<T_Works_Admin_GrupoTrabalho>();

                    administradores.Add(new T_Works_Admin_GrupoTrabalho { GrupoTrabalhoId = novoIdGrupo, UsuarioId = usuarioLogadoId });
                    db.SaveChanges();
                };

            }
            catch (Exception ex)
            {
                return Json(new { success = false, mensagem = ex}, JsonRequestBehavior.AllowGet); ;
            }

            return Json(new { success = true, novoId = novoIdGrupo }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [Authorize(Roles = "Assinante")]
        public ActionResult UploadAvatarGrupoTrabalho(string novoIdGrupo)
        {
            try
            {
                //SALVAR O AVATAR
                if (System.Web.HttpContext.Current.Request.Files.AllKeys.Any())
                {
                    var pic = System.Web.HttpContext.Current.Request.Files["Image"];

                    if (pic != null)
                    {
                        Session["ImgPath"] = "~/Content/Uploads/" + pic.FileName;
                        string path = Server.MapPath("~/Content/Avatar/");
                        pic.SaveAs(path + novoIdGrupo + ".png");
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return Json(new { success = true, mensagem = "sucesso" }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [Authorize(Roles = "Assinante")]
        public ActionResult GrupoTrabalhoSelecionado(int Id)
        {
            //Usuario Logado
            var usuarioLogadoId = Int32.Parse(User.Identity.Name);

            using (var db = new ContextoGrupoTrabalho())
            {
                var selecionado = db.GruposTrabalho.Where(d => d.Id == Id).FirstOrDefault();

                var dbUser = new ContextoUsuario();

                var usuarioAdmin = dbUser.Usuarios.Where(d => d.UsuarioID == usuarioLogadoId).Select(item => new UsuarioModel
                {
                    Admin = item.Admin
                }).FirstOrDefault();

                var usuarioSelecionado = dbUser.Usuarios.Where(d => d.UsuarioID == selecionado.UsuarioId).Select(item => new UsuarioModel
                {
                    BastterBlue = item.BastterBlue,
                    Nome = item.Nome
                }).FirstOrDefault();

                var dbParticipantes = new ContextoParticipante_GrupoTrabalho();
                var habilitadoEscrever = dbParticipantes.Participante_GrupoTrabalho.Where(d => d.Id == Id  && d.UsuarioId == usuarioLogadoId).Any();


                var model = new GruposTrabalhoModel
                {
                    Id = selecionado.Id,
                    Titulo = selecionado.Titulo,
                    Descricao = selecionado.Descricao,
                    UsuarioId = selecionado.UsuarioId,
                    Status = selecionado.Status,
                    Permissao = selecionado.Permissao,
                    HabilitadoEscrever = habilitadoEscrever,
                    DataCriacao = selecionado.DataCriacao,
                    NomeUsuario = usuarioSelecionado.Nome,
                    Admin = usuarioAdmin.Admin,
                    BastterBlue = usuarioSelecionado.BastterBlue,
                    BastterBlueParticipante = (usuarioLogadoId == selecionado.UsuarioId  || dbParticipantes.Participante_GrupoTrabalho.Where(d => d.GrupoTrabalhoId == selecionado.Id && d.UsuarioId == usuarioLogadoId).Any() )
                };


                return View(model);
            }
        }

        [HttpPost]
        [Authorize(Roles = "Assinante")]
        public ActionResult ListaParticipantesGrupoTrabalho(int Id)
        {
            using (var db = new ContextoParticipante_GrupoTrabalho())
            {
                var list = db.Participante_GrupoTrabalho.Where(d => d.GrupoTrabalhoId == Id).Select(s => s.UsuarioId).ToList();

                return list != null
                        ? Json(new { success = true, Ids = list }, JsonRequestBehavior.AllowGet)
                        : Json(new { success = false, Ids = "" }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        [Authorize(Roles = "Assinante")]
        public ActionResult ListaAdminGrupoTrabalho(int Id)
        {
            using (var db = new ContextoAdmin_GrupoTrabalho())
            {
                var list = db.Admin_GrupoTrabalho.Where(d => d.GrupoTrabalhoId == Id).Select(s => s.UsuarioId).ToList();

                return list != null
                        ? Json(new { success = true, Ids = list }, JsonRequestBehavior.AllowGet)
                        : Json(new { success = false, Ids = "" }, JsonRequestBehavior.AllowGet);
            }
       
        }

        [HttpPost]
        [Authorize(Roles = "Assinante")]
        public ActionResult SalvarAlteracoesGrupo(GruposTrabalhoModel gruposTrabalho)
        {
            try
            {
                //REMOVER PARTICIPANTES DO GRUPO E ADICIONA-LOS NOVAMENTE
                if (gruposTrabalho.Participantes != null)
                {
                    using (var db = new ContextoParticipante_GrupoTrabalho())
                    {
                        var participantes = db.Set<T_Works_Participante_GrupoTrabalho>();

                        var pessoas = participantes.Where(d => d.GrupoTrabalhoId == gruposTrabalho.Id).ToList();
                        db.Participante_GrupoTrabalho.RemoveRange(pessoas);
                        db.SaveChanges();

                        foreach (var item in gruposTrabalho.Participantes)
                        {
                            participantes.Add(new T_Works_Participante_GrupoTrabalho { GrupoTrabalhoId = gruposTrabalho.Id, UsuarioId = item });
                            db.SaveChanges();
                        }
                    };
                }

                //REMOVER ADMINISTRADORES DO GRUPO E ADICIONA-LOS NOVAMENTE
                if (gruposTrabalho.Administradores != null)
                {
                    using (var db = new ContextoAdmin_GrupoTrabalho())
                    {
                        var administradores = db.Set<T_Works_Admin_GrupoTrabalho>();

                        var pessoas = administradores.Where(d => d.GrupoTrabalhoId == gruposTrabalho.Id).ToList();
                        db.Admin_GrupoTrabalho.RemoveRange(pessoas);
                        db.SaveChanges();

                        foreach (var item in gruposTrabalho.Administradores)
                        {
                            administradores.Add(new T_Works_Admin_GrupoTrabalho { GrupoTrabalhoId = gruposTrabalho.Id, UsuarioId = item });
                            db.SaveChanges();
                        }
                    };
                }

                //ALTERAR STATUS
                using (var db = new ContextoGrupoTrabalho())
                {
                    var grupoTrabalho = db.Set<T_Works_GruposTrabalho>();

                    var grupo = grupoTrabalho.Where(d => d.Id == gruposTrabalho.Id).FirstOrDefault();

                    grupo.Status = gruposTrabalho.Status;
                    grupo.Permissao = gruposTrabalho.Permissao;

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
        public ActionResult SalvarAlteracaoPostagemGrupoTrabalho(GruposTrabalhoModel gruposTrabalho)
        {
            try
            {
                //ALTERAR POSTAGEM
                using (var db = new ContextoGrupoTrabalho())
                {
                    var grupoTrabalho = db.Set<T_Works_GruposTrabalho>();

                    var grupo = grupoTrabalho.Where(d => d.Id == gruposTrabalho.Id).FirstOrDefault();

                    grupo.Descricao = gruposTrabalho.Descricao;

                    db.SaveChanges();
                };
            }
            catch (Exception ex)
            {
                return Json(new { success = true, mensagem = ex }, JsonRequestBehavior.AllowGet);
            }

            return Json(new { success = true, mensagem = "sucesso" }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [Authorize(Roles = "Assinante")]
        public ActionResult ExcluirGrupo(GruposTrabalhoModel gruposTrabalho)
        {
            try
            {
                //REMOVER PARTICIPANTES DO GRUPO
                if (gruposTrabalho.Participantes != null)
                {
                    using (var db = new ContextoParticipante_GrupoTrabalho())
                    {
                       var participantes = db.Set<T_Works_Participante_GrupoTrabalho>();

                        var people = participantes.Where(d => d.GrupoTrabalhoId == gruposTrabalho.Id).ToList();

                        db.Participante_GrupoTrabalho.RemoveRange(people);
                        db.SaveChanges();
                    };
                }

                //REMOVER ADMINISTRADORES DO GRUPO
                if (gruposTrabalho.Administradores != null)
                {
                    using (var db = new ContextoAdmin_GrupoTrabalho())
                    {
                        var administradores = db.Set<T_Works_Admin_GrupoTrabalho>();

                        var people = administradores.Where(d => d.GrupoTrabalhoId == gruposTrabalho.Id).ToList();

                        db.Admin_GrupoTrabalho.RemoveRange(people);
                        db.SaveChanges();
                    };
                }

                //REMOVER COMENTARIOS DO GRUPO
                using (var db = new ContextoComentarioTopico_GrupoTrabalho())
                {
                    var comentarios = db.Set<T_Works_ComentarioTopico_GrupoTrabalho>();

                    var listaComentarios = comentarios.Where(d => d.GrupoTrabalhoId == gruposTrabalho.Id).ToList();

                    db.ComentarioTopico_GrupoTrabalho.RemoveRange(listaComentarios);
                    db.SaveChanges();
                };

                //REMOVER TOPICOS DO GRUPO
                using (var db = new ContextoTopico_GrupoTrabalho())
                {
                    var comentarios = db.Set<T_Works_Topico_GrupoTrabalho>();

                    var listaComentarios = comentarios.Where(d => d.GrupoTrabalhoId == gruposTrabalho.Id).ToList();

                    db.Topico_GrupoTrabalho.RemoveRange(listaComentarios);
                    db.SaveChanges();
                };


                //EXCLUIR GRUPO
                using (var db = new ContextoGrupoTrabalho())
                {
                   var grupoTrabalho = db.Set<T_Works_GruposTrabalho>();

                    var grupo = grupoTrabalho.Where(d => d.Id == gruposTrabalho.Id).FirstOrDefault();

                    db.GruposTrabalho.Remove(grupo);
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
