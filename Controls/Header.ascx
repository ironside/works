<%@ Control Language="c#" AutoEventWireup="false" 
    Codebehind="Header.ascx.cs" 
    Inherits="SiteHome.Header" 
    TargetSchema="http://schemas.microsoft.com/intellisense/ie3-2nav3-0"%>

        <header>
        <div class="container-fluid" id="menu-secundario">
            <div class="container">
                <div class="row">

                <div class="col-md-1 col-xs-2 col-sm-1" id="menu-logo">

                <!-- NAVBAR -->
                    <div class="pull-left">
                    <button class="btn btn-link toggle-bouton off-canvas-toggle" onclick="openNav()">
                        <i class="fa fa-bars"></i>
                    </button>

                    </div>

                    <div class="off-canvas-overlay" onclick="closeNav()"></div>

                    <div class="off-canvas">
                    <ul class="list-unstyled visible-xs visible-sm">
                        <li><a href="/mercado/acao/default.aspx" title="Ações"><i class="fa fa-hourglass-start"></i> Ações</a></li>
                        <li><a href="/mercado/stock/default.aspx" title="Investimentos no Exterior"><i class="fa fa-plane"></i> Investimentos no Exterior</a></li>
                        <li><a href="/mercado/fii/default.aspx" title="FIIs & Imóveis"><i class="fa fa-building-o"></i> FIIs e Imóveis</a></li>
                        <li><a href="/mercado/renda-fixa.aspx" title="Renda Fixa"><i class="fa fa-money"></i> Renda Fixa</a></li>
                        <li><a href="/mercado/imposto-de-renda-e-contabilidade.aspx" title="Imposto de Renda"><i class="fa fa-cogs"></i> Imposto de Renda</a></li>
                    </ul>
            
                    <hr class="visible-xs visible-sm">

                    <ul class="list-unstyled visible-xs visible-sm">
                        <li><a href="/mercado/iniciante.aspx" title="Iniciante"><i class="fa fa-child"></i> Iniciante</a></li>
                        <li><a href="/mercado/vcblue/default.aspx" target="_blank" title="Bastter System"><i class="fa fa-balance-scale"></i> Bastter System</a></li>
                        <li><a href="/mercado/tranquilidade-financeira.aspx" title="Tranquilidade Financeira"><i class="fa fa-trophy"></i> Tranquilidade Financeira</a></li>
                        <li><a href="/mercado/esporte/default.aspx" title="Saúde e Esportes"><i class="fa fa-heart"></i> Saúde e Esportes</a></li>
                        <li><a href="/mercado/bastterblue/default.aspx" title="Bastter Blue"><i class="fa fa-bold"></i> Bastter Blue</a></li>
                        <li><a href="/mercado/assuntos-gerais.aspx" title="Assuntos Gerais"><i class="fa fa-th"></i> Assuntos Gerais</a></li>
                    </ul>
            
                    <hr class="visible-xs visible-sm">

                    <ul class="list-unstyled">
                        <li><a href="/mercado/loja/default.aspx" title="Loja Virtual"><i class="fa fa-shopping-cart"></i> Loja Virtual</a></li>
                        <li><a href="/mercado/iniciante.aspx#faq" title="Perguntas Frequentes"><i class="fa fa-question-circle"></i> Perguntas Frequentes (FAQ)</a></li>
                        <li><a href="/Mercado/suporte.aspx" title="Suporte"><i class="fa fa-info-circle"></i> Suporte</a></li>
                        <li><a href="/Mercado/Contato.aspx" title="Contato"><i class="fa fa-envelope"></i> Contato</a></li>
                        <li><a href="/Mercado/Regras.aspx" title="Regras"><i class="fa fa-book"></i> Regras</a></li>
                    </ul>
            
                    <hr>

                    <div class="row">
                        <div class="col-md-12 text-center">
                        <h3 class="text-center"><a href="https://bastter.com/Mercado/Cadastro.aspx" title="Cadastre-se grátis">Cadastre-se grátis!</a></h3>
                        <p>E ganhe o e-book<br> <strong>O Click da Riqueza</strong></p>
                        <a href="https://bastter.com/Mercado/Cadastro.aspx" title="Ganhe o livro Click da Riqueza"><img src="images/livro-click-riqueza-bastter-gratis-cadastrados.png?v=2" class="img-responsive center-block" alt="Livro Click da Riqueza Grátis"></a>
                        <div class="form-group margin-top">
                            <button type="submit" class="btn btn-primary btn-block">Quero me Cadastrar</button>
                        </div>
                        </div>               
                    </div>

                    </div>          
          
                </div>

                <div class="col-md-2 col-xs-2 col-sm-1 hidden-sm hidden-xs">
                    <a href="https://www.bastter.com">
                    <img src="/mercado/images/logo-bastter-pc.png" id="logo-full" class="img-responsive" alt="Bastter.com - O melhor amigo do investidor">
                    </a>
                </div>        

                <div class="col-xs-2 col-sm-1 visible-xs visible-sm">
                    <a href="https://www.bastter.com">
                    <img src="/mercado/images/logo-bastter-mobile.png" class="img-responsive" alt="Bastter.com - O melhor amigo do investidor">
                    </a>
                </div>

                <div class="col-md-7 hidden-xs hidden-sm col-lg-6">
                    <ul class="nav nav-pills small">
                        <li role="presentation"><a href="/mercado/acao/default.aspx" title="Ações">Ações</a></li>
                        <li role="presentation"><a href="/mercado/stock/default.aspx" title="Investimentos no Exterior">Investimento no Exterior</a></li>
                        <li role="presentation"><a href="/mercado/fii/default.aspx" title="FIIs & Imóveis">FIIs e Imóveis</a></li>
                        <li role="presentation"><a href="/mercado/renda-fixa.aspx" title="Renda Fixa">Renda Fixa</a></li>
                        <li role="presentation"><a href="/mercado/imposto-de-renda-e-contabilidade.aspx" title="Imposto de Renda">Imposto de Renda</a></li>
                    </ul>
                </div>    

                <div class="col-md-2 col-xs-8 col-sm-10 col-lg-3">

                        <!-- inicio minha area -->
                        <div class="pull-right" id="minha-area">
                
                            <button class="btn btn-link navbar-btn dropdown-toggle" data-toggle="dropdown">
                            <i class="fa fa-user-circle-o"></i>
                            <b class="hidden-sm hidden-md hidden-xs">Minha área</b>
                            <span class="caret"></span>
                            </button> 
                            <!--<button class="btn btn-default navbar-btn visible-xs pull-left" style="margin:8px 20px;><i class="fa fa-shopping-cart"></i> Loja Virtual</button>
                            <button class="btn btn-default navbar-btn visible-xs pull-left"><i class="fa fa-question-circle"></i> Suporte</button> -->

                            <ul id="login-dp" class="dropdown-menu">
                            <li>
                                <div class="row">
                                    <asp:Literal ID="litCadastroForm" runat="server">                             
                                      <div class="bottom col-md-6 text-center">
                                        <p><a href="https://bastter.com/Mercado/Cadastro.aspx" title="Cadastre-se grátis">Cadastre-se grátis!</a> e ganhe<br />o e-book <strong>O Click da Riqueza</strong></p>
                                        <a href="https://bastter.com/Mercado/Cadastro.aspx" title="Ganhe o livro Click da Riqueza"><img src="/mercado/images/livro-click-riqueza-bastter-gratis-cadastrados.png?v=2" class="img-responsive center-block" alt="Livro Click da Riqueza Grátis"></a>
                                      </div>
                                    </asp:Literal>  
                                    <div class="col-md-6">
                                            <asp:Literal ID="litLoginForm" runat="server">
                                      
                                                Faça login com sua conta do
                                                <div class="social-buttons">
                                                  <a href="/mercado/facebook-callback.ashx?go=1" class="btn btn-fb"><i class="fa fa-facebook"></i> Facebook</a>
                                                  <a href="javascript:;" onClick="LoginGoogle()" class="btn btn-go"><i class="fa fa-google"></i> Google</a>
                                                </div>
                                                                ou
                                                 <form class="form" method="post" action="login" accept-charset="UTF-8" id="login-nav">
                                                    <div class="form-group">
                                                       <label class="sr-only" for="login-email">Login</label>
                                                       <input type="text" class="form-control" id="login-email" placeholder="Login" required>
                                                    </div>
                                                    <div class="form-group">
                                                       <label class="sr-only" for="login-password">Senha</label>
                                                       <input type="password" class="form-control" id="login-password" placeholder="Senha" required>
                                                       <div class="help-block text-right"><a href="/Mercado/EsqueciSenha.aspx">Esqueceu sua senha?</a></div>
                                                    </div>
                                                    <div class="form-group">
                                                       <button type="button" class="btn btn-primary btn-block" onclick="Login(false)">Acessar</button>
                                                    </div>
                                                 </form>                                          
                                            </asp:Literal>
                                        <asp:Panel ID="panelPerfilForm" runat="server" Visible="false">
                                            <p class="text-center">Olá <strong><asp:Literal runat="server" ID="litLoginText"></asp:Literal> </strong>, seja bem vindo!<br>
                                              <a href="/mercado/perfil.aspx" title="Nome do usuário">
                                                <asp:Literal runat="server" ID="litUsrAvatar"></asp:Literal>                                    
                                              </a>
                                            </p>
                                            <p class="text-center">
                                              <a href="/Mercado/Perfil.aspx" role="button" class="btn btn-default bt-sm">Perfil</a>
                                              <a href="#" role="button" class="btn btn-danger bt-sm" onclick="Logout()">Sair</a>
                                            </p>
                                        </asp:Panel>
                                    </div>                        
                                </div>
                            </li>
                            </ul>
                
                        </div>             

                        <!-- inicio notificacoes -->
                        <button class="btn-link dropdown-toggle pull-right" type="button" id="dropdownDesktop" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                        <i class="fa fa-bell faa-ring animated"></i>
                        <span class="badge">425</span>
                        </button>

                        <div class="list-group dropdown-menu dropdown-menu-right notifications-items" aria-labelledby="dropdownDesktop">
                        <div class="list-group-item active">                

                            <div class="btn-group btn-group-xs btn-group-justified" role="group" aria-label="Justified button group with nested dropdown">
                            <a href="#nf-todas" class="btn btn-default" aria-controls="nf-todas" role="tab" data-toggle="tab" aria-expanded="false">Todas</a>
                            <a href="#nf-pessoal" class="btn btn-default" aria-controls="nf-pessoal" role="tab" data-toggle="tab" aria-expanded="true">Pessoal<span class="badge">128</span> </a>
                            <a href="#nf-eventos" class="btn btn-default" aria-controls="nf-eventos" role="tab" data-toggle="tab" aria-expanded="false">Eventos</a>
                            <a href="#nf-social" class="btn btn-default" aria-controls="nf-social" role="tab" data-toggle="tab" aria-expanded="false">Social</a>
                            <div class="btn-group btn-group-xs" role="group">
                                <a href="#" class="btn btn-default dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"> Áreas <span class="caret"></span> </a>
                                <ul class="dropdown-menu">
                                <li><a href="#">Assuntos Gerais</a></li>
                                <li><a href="#">Bastter Blue</a></li>
                                <li><a href="#">Ações e Opções</a></li>
                                <li><a href="#">Investimentos no Exterior</a></li>
                                <li><a href="#">FIIs e Imóveis</a></li>
                                <li><a href="#">Tranquilidade e Financeira</a></li>
                                <li><a href="#">Renda Fixa</a></li>
                                <li><a href="#">Imposto de Renda</a></li>
                                <li><a href="#">Iniciantes</a></li>
                                <li><a href="#">Saúde e Esportes</a></li>
                                <li role="separator" class="divider"></li>
                                <li><a href="#">Suporte</a></li>
                                </ul>
                            </div>
                            </div>

                        </div>



                        <div class="tab-content">
                            <div role="tabpanel" class="tab-pane fade-in active in" id="nf-pessoal">
                    
                                <div class="scrollbar" id="style-1">
                                <div class="force-overflow">






                                    <ul class="notifications-list list-unstyled">
                                    <li>
                                        <a href="#">
                                        <div class="media">
                                            <div class="media-left">
                                            <div class="media-object">
                                                <img src="https://bastter.com/mercado/images/icon-secao-240.png" class="pull-left" alt="Nome do ícone">
                                            </div>
                                            </div>
                                            <div class="media-body">
                                            <p>
                                                <small class="pull-right">3 de março</small>
                                                <span class="label label-primary">Tranquilidade Financeira</span><br>                                      
                                                <strong>gcpontes</strong> respondeu o tópico<br>
                                                Liquidar carteira ou vender o atual imovel?
                                            </p>
                                            </div>
                                        </div>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                        <div class="media">
                                            <div class="media-left">
                                            <div class="media-object">
                                                <img src="https://bastter.com/mercado/images/icon-secao-240.png" class="pull-left" alt="Nome do ícone">
                                            </div>
                                            </div>
                                            <div class="media-body">
                                            <p>
                                                <small class="pull-right">3 de março</small>
                                                <span class="label label-primary">Tranquilidade Financeira</span><br>                                      
                                                <strong>gcpontes</strong> respondeu o tópico<br>
                                                Liquidar carteira ou vender o atual imovel?
                                            </p>
                                            </div>
                                        </div>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                        <div class="media">
                                            <div class="media-left">
                                            <div class="media-object">
                                                <img src="https://bastter.com/mercado/images/icon-secao-240.png" class="pull-left" alt="Nome do ícone">
                                            </div>
                                            </div>
                                            <div class="media-body">
                                            <p>
                                                <small class="pull-right">3 de março</small>
                                                <span class="label label-primary">Tranquilidade Financeira</span><br>                                      
                                                <strong>gcpontes</strong> respondeu o tópico<br>
                                                Liquidar carteira ou vender o atual imovel?
                                            </p>
                                            </div>
                                        </div>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                        <div class="media">
                                            <div class="media-left">
                                            <div class="media-object">
                                                <img src="https://bastter.com/mercado/images/icon-secao-240.png" class="pull-left" alt="Nome do ícone">
                                            </div>
                                            </div>
                                            <div class="media-body">
                                            <p>
                                                <small class="pull-right">3 de março</small>
                                                <span class="label label-primary">Tranquilidade Financeira</span><br>                                      
                                                <strong>gcpontes</strong> respondeu o tópico<br>
                                                Liquidar carteira ou vender o atual imovel?
                                            </p>
                                            </div>
                                        </div>
                                        </a>
                                    </li>   
                                    <li>
                                        <a href="#">
                                        <div class="media">
                                            <div class="media-left">
                                            <div class="media-object">
                                                <img src="https://bastter.com/mercado/images/icon-secao-240.png" class="pull-left" alt="Nome do ícone">
                                            </div>
                                            </div>
                                            <div class="media-body">
                                            <p>
                                                <small class="pull-right">3 de março</small>
                                                <span class="label label-primary">Tranquilidade Financeira</span><br>                                      
                                                <strong>gcpontes</strong> respondeu o tópico<br>
                                                Liquidar carteira ou vender o atual imovel?
                                            </p>
                                            </div>
                                        </div>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                        <div class="media">
                                            <div class="media-left">
                                            <div class="media-object">
                                                <img src="https://bastter.com/mercado/images/icon-secao-240.png" class="pull-left" alt="Nome do ícone">
                                            </div>
                                            </div>
                                            <div class="media-body">
                                            <p>
                                                <small class="pull-right">3 de março</small>
                                                <span class="label label-primary">Tranquilidade Financeira</span><br>                                      
                                                <strong>gcpontes</strong> respondeu o tópico<br>
                                                Liquidar carteira ou vender o atual imovel?
                                            </p>
                                            </div>
                                        </div>
                                        </a>
                                    </li>
                                    </ul>

                                                                    
                                </div>
                                </div>               
                    

                            </div>
                            <div role="tabpanel" class="tab-pane fade" id="nf-eventos">
                  
                            <div class="scrollbar" id="style-1">
                                <div class="force-overflow">

                                <ul class="notifications-list list-unstyled">
                                    <li>
                                    <a href="#">
                                        <div class="media">
                                        <div class="media-left">
                                            <div class="media-object">
                                            <img src="https://bastter.com/mercado/images/icon-secao-240.png" class="pull-left" alt="Nome do ícone">
                                            </div>
                                        </div>
                                        <div class="media-body">
                                            <p class="pull-left">
                                            <span class="label label-primary">Tranquilidade Financeira</span><br>
                                            <strong>gcpontes</strong> respondeu o tópico<br>
                                            Liquidar carteira ou vender o atual imovel?</p>

                                            <div class="notification-meta pull-right">
                                            <small class="timestamp">3 de março</small>
                                            </div>
                                        </div>
                                        </div>
                                    </a>
                                    </li>
                                    <li>
                                    <a href="#">
                                        <div class="media">
                                        <div class="media-left">
                                            <div class="media-object">
                                            <img src="https://bastter.com/mercado/images/icon-secao-240.png" class="pull-left" alt="Nome do ícone">
                                            </div>
                                        </div>
                                        <div class="media-body">
                                            <p class="pull-left">
                                            <span class="label label-primary">Tranquilidade Financeira</span><br>
                                            <strong>gcpontes</strong> respondeu o tópico<br>
                                            Liquidar carteira ou vender o atual imovel?</p>

                                            <div class="notification-meta pull-right">
                                            <small class="timestamp">3 de março</small>
                                            </div>
                                        </div>
                                        </div>
                                    </a>
                                    </li>
                                </ul>
                                </div>
                            </div>
                            </div>
                            <div role="tabpanel" class="tab-pane fade" id="nf-social">
                            <div class="scrollbar" id="style-1">
                                <div class="force-overflow">                    
                                <ul class="notifications-list list-unstyled">
                                    <li>
                                    <a href="#">
                                        <div class="media">
                                        <div class="media-left">
                                            <div class="media-object">
                                            <img src="https://bastter.com/mercado/images/icon-secao-240.png" class="pull-left" alt="Nome do ícone">
                                            </div>
                                        </div>
                                        <div class="media-body">
                                            <p class="pull-left">
                                            <span class="label label-primary">Tranquilidade Financeira</span><br>
                                            <strong>gcpontes</strong> respondeu o tópico<br>
                                            Liquidar carteira ou vender o atual imovel?</p>

                                            <div class="notification-meta pull-right">
                                            <small class="timestamp">3 de março</small>
                                            </div>
                                        </div>
                                        </div>
                                    </a>
                                    </li>
                                    <li>
                                    <a href="#">
                                        <div class="media">
                                        <div class="media-left">
                                            <div class="media-object">
                                            <img src="https://bastter.com/mercado/images/icon-secao-240.png" class="pull-left" alt="Nome do ícone">
                                            </div>
                                        </div>
                                        <div class="media-body">
                                            <p class="pull-left">
                                            <span class="label label-primary">Tranquilidade Financeira</span><br>
                                            <strong>gcpontes</strong> respondeu o tópico<br>
                                            Liquidar carteira ou vender o atual imovel?</p>

                                            <div class="notification-meta pull-right">
                                            <small class="timestamp">3 de março</small>
                                            </div>
                                        </div>
                                        </div>
                                    </a>
                                    </li>
                                </ul>
                                </div>
                            </div>
                            </div>

                            <div role="tabpanel" class="tab-pane fade" id="nf-todas">
                            <div class="scrollbar" id="style-1">
                                <div class="force-overflow">                    
                                <ul class="notifications-list list-unstyled">
                                    <li>
                                    <a href="#">
                                        <div class="media">
                                        <div class="media-left">
                                            <div class="media-object">
                                            <img src="https://bastter.com/mercado/images/icon-secao-240.png" class="pull-left" alt="Nome do ícone">
                                            </div>
                                        </div>
                                        <div class="media-body">
                                            <p class="pull-left">
                                            <span class="label label-primary">Tranquilidade Financeira</span><br>
                                            <strong>gcpontes</strong> respondeu o tópico<br>
                                            Liquidar carteira ou vender o atual imovel?</p>

                                            <div class="notification-meta pull-right">
                                            <small class="timestamp">3 de março</small>
                                            </div>
                                        </div>
                                        </div>
                                    </a>
                                    </li>
                                    <li>
                                    <a href="#">
                                        <div class="media">
                                        <div class="media-left">
                                            <div class="media-object">
                                            <img src="https://bastter.com/mercado/images/icon-secao-240.png" class="pull-left" alt="Nome do ícone">
                                            </div>
                                        </div>
                                        <div class="media-body">
                                            <p class="pull-left">
                                            <span class="label label-primary">Tranquilidade Financeira</span><br>
                                            <strong>gcpontes</strong> respondeu o tópico<br>
                                            Liquidar carteira ou vender o atual imovel?</p>

                                            <div class="notification-meta pull-right">
                                            <small class="timestamp">3 de março</small>
                                            </div>
                                        </div>
                                        </div>
                                    </a>
                                    </li>
                                </ul>
                                </div>
                            </div>
                            </div>

                            <div role="tabpanel" class="tab-pane fade" id="nf-moderadores">
                    
                            <div class="scrollbar" id="style-1">
                                <div class="force-overflow">
                                <ul class="notifications-list list-unstyled">
                                    <li>
                                    <a href="#">
                                        <div class="media">
                                        <div class="media-left">
                                            <div class="media-object">
                                            <img src="https://bastter.com/mercado/images/icon-secao-240.png" class="pull-left" alt="Nome do ícone">
                                            </div>
                                        </div>
                                        <div class="media-body">
                                            <p class="pull-left">
                                            <span class="label label-primary">Tranquilidade Financeira</span><br>
                                            <strong>gcpontes</strong> respondeu o tópico<br>
                                            Liquidar carteira ou vender o atual imovel?</p>

                                            <div class="notification-meta pull-right">
                                            <small class="timestamp">3 de março</small>
                                            </div>
                                        </div>
                                        </div>
                                    </a>
                                    </li>
                                </ul>
                                </div>
                            </div>
                            </div>                  
                        </div>                              

                        <ul class="list-inline list-group-item list-group-item-info">
                            <li role="presentation" class=""><button href="#nf-moderadores" class="btn btn-default btn-sm btn-danger" aria-controls="nf-moderadores" role="tab" data-toggle="tab" aria-expanded="false"><i class="fa fa-key"></i></button></li>
                            <li><a href="#" role="button" class="btn btn-default btn-sm" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Gerenciar Notificações"><i class="fa fa-cogs"></i></a></li>  
                            <li><a href="https://bastter.com/mercado/perfil.aspx#notificacoes" class="text-right"><strong>VER TODAS AS NOTIFICAÇÕES</strong></a></li>
                        </ul>

                        </div>

                        </div>            
        
                    </div>
                </div>
            </div>
            <div class="container-fluid" id="menu-primario">
                <div class="container">
                    <div class="row">

                    <div class="col-md-8 hidden-xs hidden-sm">
                        <ul class="nav nav-pills small">
                        <li role="presentation"><a href="/mercado/iniciante.aspx" title="Iniciante">Iniciante</a></li>
                        <li role="presentation"><a href="/mercado/vcblue/default.aspx" target="_blank" title="Bastter System">Bastter System</a></li>
                        <li role="presentation"><a href="/mercado/tranquilidade-financeira.aspx" title="Tranquilidade Financeira">Tranquilidade Financeira</a></li>
                        <li role="presentation"><a href="/mercado/esporte/default.aspx" title="Saúde e Esportes">Saúde e Esportes</a></li>
                        <li role="presentation"><a href="/mercado/bastterblue/default.aspx" title="Bastter Blue">Bastter Blue</a></li>
                        <li role="presentation"><a href="/mercado/assuntos-gerais.aspx" title="Assuntos Gerais">Assuntos Gerais</a></li>
                        </ul>
                    </div>

                    <div class="col-md-4 col-xs-12">
                        <div id="custom-search-input">
                            <div class="input-group col-md-12">
                                <input type="text" class="form-control" placeholder="Pesquisar no site">
                                <span class="input-group-btn">
                                    <button class="btn btn-info" type="button">
                                        <i class="glyphicon glyphicon-search"></i>
                                    </button>
                                </span>
                            </div>
                        </div>
                    </div>        
        
                    </div>
                </div>
                </div>
            <script>
                function openNav() {
                    $(".off-canvas").css("left", "300px");
                    $(".off-canvas-overlay").css("visibility","visible");
                    //document.getElementById("main").style.marginLeft = "250px";
                }

                /* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
                function closeNav() {
                    $(".off-canvas").css("left", "0px");
                    $(".off-canvas-overlay").css("visibility", "hidden");
                    //document.getElementById("main").style.marginLeft = "0";
                }
            </script>
        </header>    
