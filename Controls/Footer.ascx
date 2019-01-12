<%@ Control Language="c#" AutoEventWireup="false" 
    Codebehind="Footer.ascx.cs" 
    Inherits="SiteHome.Footer" 
    TargetSchema="http://schemas.microsoft.com/intellisense/ie3-2nav3-0"%>

        <footer>
            <div class="container margin-bottom">

                    <div class="row margin-bottom">
                    <asp:Panel ID="panelCadastroRodape" runat="server"
>                        <div class="col-md-12 text-center" id="cadastro-rodape">
                            <h2>Cadastre-se gratuitamente</h2>
                            <p>Ao se cadastrar você está de acordo com as <a href="/Mercado/Regras.aspx">Regras</a></p>
                            <form class="form-inline">
                            <div class="form-group">
                                <label for="txtNome" class="sr-only">Nome</label>                            
                                <asp:TextBox ID="txtNome" MaxLength="100" CssClass="form-control" runat="server" placeholder="Seu nome"></asp:TextBox>
                            </div>
                            <div class="form-group">
                                <label for="txtEmail" class="sr-only">E-mail</label>
                                <asp:TextBox ID="txtEmail" MaxLength="100" CssClass="form-control" placeholder="Seu e-mail" runat="server" />
                            </div>
                            <div class="form-group">
                                <label for="txtLoginCadastro" class="sr-only">Nome de Usuário</label>                     
                                <asp:TextBox id="txtLoginCadastro" CssClass="form-control" MaxLength="50" placeholder="Seu nome de usuário" runat="server"></asp:TextBox>
                            </div>
                            <div class="form-group">
                                <label for="txtSenhaCadastro" class="sr-only">Senha</label>                           
                                <asp:TextBox TextMode="Password" CssClass="form-control" ID="txtSenhaCadastro" placeholder="Sua senha" MaxLength="50" runat="server" />
                            </div>  
                            <a class="btn btn-primary" OnClick="Validar(false)">Cadastrar</a>
                            </form>
                            <h4>ou faça login</h4>
                            <div class="social-buttons">
                            <a href="/mercado/facebook-callback.ashx?go=1" class="btn btn-fb"><i class="fa fa-facebook"></i> Facebook</a>
                            <a href="javascript:;" onClick="LoginGoogle()" class="btn btn-go"><i class="fa fa-google"></i> Google</a>
                            </div>
                        </div>
                    </asp:Panel>
                </div>

                <div class="row margin-bottom">

                    <div class="col-md-4">
                        <h3>Bastter.com</h3>
                        <p>Mauricio Coutinho Hissa</p>
                        <p><small>Certificado Nacional do Profissional de Investimentos (CNPI)</small><br>
                        <small>Analista Fundamentalista - Certificado n 1716</small></p>

                        <!--
                            // botoes edes sociais
                        -->
                        <ul class="social-section list-unstyled list-inline">
                            <li><a class="btn-floating btn-sm btn-fb" href="https://www.facebook.com.br/BastterBlue"><i class="fa fa-facebook"> </i></a></li>
                            <li><a class="btn-floating btn-sm btn-tw" href="https://www.twitter.com/bastter"><i class="fa fa-twitter"> </i></a></li>
                            <li><a class="btn-floating btn-sm btn-yt" href="https://www.youtube.com/channel/UCsra3f6ogpXhIZbSUe2OoaA"><i class="fa fa-youtube"> </i></a></li>
                        </ul>

                    </div>

                    <div class="col-md-2">
                        <h4>Estude</h4>
                        <ul class="list-unstyled">
                            <li><a href="/mercado/acao/default.aspx" title="Ações">Ações</a></li>
                            <li><a href="/mercado/stock/default.aspx" title="Investimentos no Exterior">Investimentos no Exterior</a></li>
                            <li><a href="/mercado/fii/default.aspx" title="FIIs & Imóveis">FIIs & Imóveis</a></li>
                            <li><a href="/mercado/reserva-de-valor.aspx" title="Reserva de Valor">Reserva de Valor</a></li>              
                            <li><a href="/mercado/renda-fixa.aspx" title="Renda Fixa">Renda Fixa</a></li>
                            <li><a href="/mercado/imposto-de-renda-e-contabilidade.aspx" title="Imposto de Renda">Imposto de Renda</a></li>
                        </ul>
                    </div>

                    <div class="col-md-2">
                        <h4>Tenha Paz</h4>
                        <ul class="list-unstyled">
                            <li><a href="/mercado/iniciante.aspx#artigos-7-header">Roteiro do Iniciante</a></li>
                            <li><a href="/mercado/tranquilidade-financeira.aspx">Tranquilidade Financeira</a></li>
                            <li><a href="/mercado/esporte/default.aspx">Saúde e Esportes</a></li>
                            <li><a href="/Mercado/Cadastro.aspx">Seja Bastter Blue</a></li>
                        </ul>
                    </div>

                    <div class="col-md-2">
                        <h4>Extras</h4>
                        <ul class="list-unstyled">
                            <li><a href="/mercado/loja/default.aspx">Loja Virtual</a></li>
                            <li><a href="/mercado/iniciante.aspx#faq">Perguntas Frequentes</a></li>
                            <li><a href="/mercado/arquivos/Midia-Kit-Bastter-com.pdf">Anuncie na bastter.com</a></li>
                            <li><a href="/Mercado/suporte.aspx">Suporte</a></li>
                            <li><a href="/Mercado/Contato.aspx">Fale Conosco</a></li>
                            <li><a href="/Mercado/Regras.aspx">Regras</a></li>
                        </ul>
                    </div>

                </div>
            </div>
            <p class="text-center"><strong><a href="https://bastter.com" class="text-primary" title="Bastter.com - Amigo do investidor">Bastter.com</a> 2001 ©Todos os Direitos Reservados</strong></p>
            <p class="text-center"><small>Todo o conteúdo deste site é propriedade da Bastter.com, sendo expressamente proibido o seu uso em sites, videos, cursos ou<br>qualquer outro meio de comunicação sem autorização expressa do proprietário.<small></p>
            <div id="voltar-topo">
                Voltar ao topo
            </div>
        </footer>