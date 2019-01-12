namespace SiteHome
{
    using System;
    using System.Web.UI.WebControls;
    // /reference:Bastter.Web.dll

    /// <summary>
    ///		Summary description for MyUserControl.
    /// </summary>
    public abstract class Header : System.Web.UI.UserControl
	{
        private void Page_Load(object sender, System.EventArgs e)
		{
      
            //Botão cadastro
            //Literal litCadastroBtn = (Literal)FindControl("litCadastroBtn");

            //Desktop

            //Mobile
            /*Literal litLoginFormM = (Literal)FindControl("litLoginFormM");
            Literal litCadastroFormM = (Literal)FindControl("litCadastroFormM");
            Panel panelPerfilFormM = (Panel)FindControl("panelPerfilFormM");
            Literal litUsrAvatarM = (Literal)FindControl("litUsrAvatarM");
            Literal litLoginTextM = (Literal)FindControl("litLoginTextM");

            litLoginFormM.Visible = litLoginForm.Visible = false;
            panelPerfilFormM.Visible = panelPerfilForm.Visible = false;
            litCadastroFormM.Visible = litCadastroForm.Visible = false;
            */
        }

        #region Web Form Designer generated code
        override protected void OnInit(EventArgs e)
		{
			//
			// CODEGEN: This call is required by the ASP.NET Web Form Designer.
			//
			InitializeComponent();
			base.OnInit(e);
		}
		
		///		Required method for Designer support - do not modify
		///		the contents of this method with the code editor.
		/// </summary>
		private void InitializeComponent()
		{
			this.Load += new System.EventHandler(this.Page_Load);
		}
		#endregion
	}
}
