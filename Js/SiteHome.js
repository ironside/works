var rootUrl = '/Mercado/';
var twitterJs = 'http://twitter.com/statuses/user_timeline/bastter.json?callback=twitterCallback2&count=5';
var isAuthenticatedCache = undefined;
var usuarioID = 0;
var t, x, notifica = true;
var tipoOrdemMural = 1;
var pesquisa = '';
var tipoPesquisa = 0;
var instance;
var gruposFiltro = [];//($.cookie('gruposFiltro') != undefined ? $.cookie('gruposFiltro') : []);

//define variavel responsavel por controlar rolagem de tela nos posts
// set e get definidos como funccao pois ECMAscript nao compila get set
rolarTela = {
    aInternal: 10,
    aListener: function (val) { },
    setStatus: function (val) {
        //if (this.aInternal == val)
        //    return;
        this.aInternal = val;
        this.aListener(val);
    },
    getStatus: function () {
        return this.aInternal;
    },
    registerListener: function (listener) {
        this.aListener = listener;
    }
}

rolarTela.registerListener(function (val) {
    if (val != '') {
        $('html, body').stop().animate({
            scrollTop: $('.topico_' + val + '_resposta:eq(' + ($('.topico_' + val + '_resposta').length - 3) + ')').offset().top
        }, 1500, 'easeInOutExpo');
    }
});

function marcarMenu(menuid) {
    $('[data-menu-id="' + menuid + '"]').addClass("active");
}

function ajaxProxy(webservice, method, jsonstring, callback) {
    $.ajax({
        type: "POST",
        url: webservice + ".asmx/" + method,
        data: jsonstring,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        timeout: 60000,
        success: function (response) {
            callback((typeof response.d) == 'string' ? eval('(' + response.d + ')') : response.d);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.readyState);
            if (XMLHttpRequest.readyState == 4)
                callback({ 'Error': XMLHttpRequest.statusText });
        }
    });
}



// Autenticar usando serviço de login do google
function LoginGoogle() {
    window.open('/mercado/oauth.aspx', 'GoogleLogin', 'width=550,height=460,status=no,toolbar=no,menubar=no,location=no,scrollbars=yes');
}


function Cotar() {
    window.open("http://www.bastter.com/mercado/cotacao.aspx?C=" + $('#cotacao_codigo').val(), "cotacao", "width=450,height=220,toolbar=no,titlebar=no,status=no,scrollbars=no,resizable=no,location=no");
};

function CarregarVendasTSDB() {
    $.cookie.json = true;

    var r = $.cookie('Vendas');

    if (r != undefined) {
        ExibirVendas(r);

        return;
    }

    ajaxProxy('/WS_BB_SistemaOperacional', 'ObterPainelVendas', '{}',
        function (r) {
            $.cookie('Vendas', r, { expires: 5 });

            ExibirVendas(r);
        }
    );
};

function ExibirVendas(r) {
    var $dados = $('[role="tabpanel"]#vendas');

    //$.wait($dados);


    var html = '<table><tr><th>Opção</th><th>Strike</th><th>Status</th></tr>';


    if (r == undefined) {

    } else if (r.Error || r.Disclaimer) {
        $.cookie('Vendas', r, { expires: -1 });

        html += '<tr><td colspan="3" align="center">' + (r.Error ? r.Error : r.Disclaimer) + '</td></tr>';
    }
    else {
        for (var p in r)
            html += '<tr><td>' + r[p].Opcao + '</td><td>' + r[p].Strike.toFixed(2) + '</td><td>' + r[p].Status + '</td></tr>';
    }

    html += '</table>';

    $dados.html(html);
};

function CarregarAtivosTSDB(tipo) {

    //carrega lista de carteiras
    ajaxProxy('/WS_Carteira', 'ListarCarteiras', '{}',
        function (r) {
            var html = '';

            if (r.Disclaimer || r.Error) {
                html += '<li role="presentation" class=""><a href="#grupo" aria-controls="grupo" role="tab" data-toggle="tab" aria-expanded="false">Erro ao listar carteiras</a></li>';
            }
            else {
                for (var i in r) {
                    html += '<li role="presentation" class=""><a href="#grupo" aria-controls="grupo" role="tab" data-toggle="tab" aria-expanded="false" onclick="AtualizarUltimoAcessoCarteira('+r[i].CarteiraID+')">' + r[i].Nome + '</a></li>';
                }
            }

            $('#ListaCarteirasBSLight').html(html);
        }
    );


    if (tipo == 'vendas') {
        CarregarVendasTSDB();
        return;
    }



    var $dados = $('[role="tabpanel"]#' + tipo);

    //$.wait($dados);

    ajaxProxy('/WS_Carteira', 'ObterPainelAtivos', '{ tipo: \'' + tipo + '\' }',
        function (r) {
            var html = '<table class="table table-striped table-hover"><tr><th>Ativo</th><th>Percentual</th><th>Objetivo</th><th>Diferença</th></tr>';

            if (r.Disclaimer || r.Error) {
                html += '<tr><td colspan="4" align="center">' + (r.Error ? r.Error : r.Disclaimer) + '</td></tr>';
            }
            else {
                for (var p in r.Items) {
                    html += '<tr><td>';

                    if (tipo == 'acao' || tipo == 'fii') {
                        html += '<a href="/mercado/' + tipo + '/' + r.Items[p].Descricao + '.aspx" target="_blank">' + r.Items[p].Descricao + '</a>';
                    } else {
                        html += r.Items[p].Descricao;
                    }

                    html += '</td><td>' + r.Items[p].Percentual.toFixed(2) + '%</td><td>' + r.Items[p].Objetivo.toFixed(2) + '%</td><td>' + (r.Items[p].Percentual - r.Items[p].Objetivo).toFixed(2) + '%</td></tr>';
                }
            }

            html += '</table>';

            $dados.html(html);
        }
    );

    if ($.cookie('ShowBSLight') == "true" || $.cookie('ShowBSLight') == true) {
        showHideBSLight(true);
    } else {
        showHideBSLight(false);
    }
};

function showHideBSLight(show) {
    if (!show) {
        $('#btnShowHideBSLight i').removeClass("fa-eye");
        $('#btnShowHideBSLight i').addClass("fa-eye-slash");
        $('#bs-light-cotacoes .panel-body, #bs-light-cotacoes .tab-content, #bs-light-cotacoes .panel-footer').hide();
        $.cookie('ShowBSLight', false);
    } else {
        $('#btnShowHideBSLight i').addClass("fa-eye");
        $('#btnShowHideBSLight i').removeClass("fa-eye-slash");
        $('#bs-light-cotacoes .panel-body, #bs-light-cotacoes .tab-content, #bs-light-cotacoes .panel-footer').show();
        $.cookie('ShowBSLight', true);
    }
}

function AtualizarUltimoAcessoCarteira(carteiraID) {
    //carrega lista de carteiras
    ajaxProxy('/WS_Carteira', 'AtualizarUltimoAcesso', JSON.stringify({ carteiraID: carteiraID }),
        function (r) {
            if (r.Error) {
                toastr.error("Erro ao alterar carteira.");
            }
            else {
                toastr.success("Carteira alterada com sucesso, carregando ativos.");
                CarregarAtivosTSDB("acao");
            }            
        }
    );
}

function AtualizarRating() {
    var $container = $('#areabastterrating'), html = '';



    ajaxProxy('/WS_Empresa', 'RatingListarTop10', '{}',
        function (r) {
            if (r.Error) {
            }
            else {
                var naoassinante = false;

                html = '<table class="table table-hover" id="block-rating"><tbody><tr><th>Geral</th><th>Segmento</th><th>Empresa</th><th class="estrelas">Rating</th></tr>';

                for (var p in r) {
                    if (!naoassinante)
                        naoassinante = r[p].CodBolsa == 'NAOASSINANTE';

                    html += '<tr><td class="rating-posicao"><h3>' + r[p].Posicao + 'º</h3></td>';

                    if (r[p].CodBolsa == 'NAOASSINANTE') {
                        html += '<td colspan="3"><a href="/Mercado/Loja/Categoria/5/Bastter-Blue.aspx">SEJA ASSINANTE TENHA ACESSO TOTAL!</a></td>';
                    } else {
                        html += '<td class="rating-posicao"><h4>' + r[p].PosicaoSegmento + 'º</h4></td>';
                        html += '<td><a href="/mercado/acao/' + r[p].CodBolsa + '.aspx" title="' + r[p].CodBolsa + ' - ' + r[p].Empresa + '"><img src="/mercado/images/acao/' + r[p].CodBolsa + '.gif" class="rating-logo"></a></td>';
                        html += '<td class="cachorros">' + r[p].Cachorros + '<br>' + r[p].Media.toFixed(2) + ' pontos</td>';
                    }

                    html += '</tr>';
                }

                html += '</tbody><tfoot><tr><td colspan="4" class="text-center">';

                if (naoassinante)
                    html += '<a class="btn btn-default margin-top" href="/Mercado/Loja/Categoria/5/Bastter-Blue.aspx">Assine já!</a>';
                else
                    html += '<a id="bb-rating-link" class="btn btn-default margin-top" href="javascript:;" onclick="location=\'/mercado/acao/default.aspx#bb-rating\'">Veja a lista completa</a>';

                html += '</td></tr></tfoot></table>';

                $container.html(html);

                if (location.href.indexOf('acao/default.aspx') != -1)
                    $('#bb-rating-link').attr('onclick', "ativaDesativaBlocos('#bloco-bb-rating','#bb-rating-empresas','Bastter Rating')");
            }
        }
    );
};

function AtualizarUltimosBalancos() {
    var $container = $('#ultimos-balancos'), html = '';



    ajaxProxy('/WS_Empresa', 'ListarPorBalanco', JSON.stringify({ tipo: 'top10' }),
        function (r) {
            if (r.Error) {
            }
            else {

                if (r.IsBastterBlue == false) {
                    html = '<a class="list-group-item text-center" href="/mercado/loja/assinatura.aspx" title="Assine já!">Seja um assinante e acompanhe a divulgação dos balanços.</a>';
                    $container.append(html);
                    return;
                }

                if (r.Empresas.length == 0)
                    $container.hide();

                if (r.Empresas.length)

                for (var p in r.Empresas) {
                    var e = r.Empresas[p],
                        html = '<a href="/mercado/acao/' + e.CodBolsa + '.aspx" class="list-group-item text-center" title="' + e.CodBolsa + ' - ' + e.Nome + '" target="_blank">';
                    html += '<img src="/mercado/images/acao/' + e.CodBolsa + '.gif" clas="img-responsive"><br>';
                    html += '<span class="label label-default">' + e.UltimoBalanco + '</span>';
                    html += '<span class="label label-default">' + e.CodBolsa + '</span>';
                    html += '</a>';
                    $container.append(html);
                    if (p == 4)
                        break;
                }

                html = '<a href="/mercado/acao/default.aspx#balancos_trimestre_atual" class="list-group-item active verMais" alt="..." title="Ver mais" target="_blank">';
                html += '    <strong>Ver todos</strong>';
                html += '    <i class="fa fa-plus-circle"></i>';
                html += '</a> ';
                $container.append(html);



            }
        });
};

function AtualizarProximosBalancos() {
    var $panel = $('#proximos-balancos'), html = '';



    ajaxProxy('/WS_Empresa', 'ListarProximosBalancos', JSON.stringify({ empresaID: 0 }),
        function (r) {
            if (r.Error) {
                $panel.html(r.Error);
            }
            else {

                if (!r.IsAssinante) {
                    html = '<a class="list-group-item text-center" href="/mercado/loja/assinatura.aspx" title="Assine já!">Seja um assinante e acompanhe a divulgação dos balanços.</a>';
                    $panel.append(html);
                    return;
                }

                if (r.Itens.length == 0)
                    $panel.hide();



                var i = 0;

                for (var p in r.Itens) {
                    var e = r.Itens[p],
                        html = '<a href="/mercado/acao/' + e.Empresa.CodBolsa + '.aspx" class="list-group-item text-center" title="' + e.Empresa.CodBolsa + ' - ' + e.Empresa.Nome + '" target="_blank">';
                    html += '<img src="' + e.Empresa.Logo + '" class="img-responsive">';
                    html += '<span class="label label-default">' + $.toDate(e.Data, false, true, false) + '</span>';
                    html += '<span class="label label-default">' + e.Empresa.CodBolsa + '</span>';
                    html += '</a>';
                    $panel.append(html);
                    if (p == 4)
                        break;
                }

                html = '<a href="/mercado/acao/default.aspx#balancos_calendario" class="list-group-item active verMais" alt="..." title="Ver mais" target="_blank">';
                html += '    <strong>Ver todos</strong>';
                html += '    <i class="fa fa-plus-circle pull-right"></i>';
                html += '</a> ';
                $panel.append(html);

            }
        });
};

function BSLightShowMore() {

    if ($('#bs-light-cotacoes .tab-content').hasClass("show-less")) {
        $('#bs-light-cotacoes .tab-content').removeClass("show-less");
        $('#bs-light-cotacoes .btnExibicao').html("Mostrar menos <i class=\"fa fa-minus-circle\"></i>");
    } else {
        $('#bs-light-cotacoes .tab-content').addClass("show-less");
        $('#bs-light-cotacoes .btnExibicao').html("Mostrar mais <i class=\"fa fa-plus-circle\"></i>");
        $('html, body').stop().animate({
            scrollTop: $('#bs-light-cotacoes').offset().top
        }, 1500, 'easeInOutExpo');
    }

};

function AtualizarNovidades() {
    ajaxProxy('/WsSite', 'ObterInformacoesSite', '{}',
        function (result) {
            if (result.Error) {
            }
            else {
                $("#bloco-usuarios-online #qtdUsuariosCadastrados").html(result.TotalUsuarios);
                $("#bloco-usuarios-online #qtdUsuariosOnline").html(result.UsuariosOnline);
                if (result.Novidades == '') {
                    $('#novidades-hoje-lista').hide();
                }
                else {
                    $('#novidades-hoje-lista').append(result.Novidades);
                    today = new Date();
                    //$('#novidades ul').addClass('bg-' + today.getDay());
                    //blinkIn('#novidades ul');
                    $('span.label.label-default.novidade-rapidinha-acao').text("Rapidinha Ações");
                    $('span.label.label-default.novidade-rapidinha-fii').text("Rapidinha Ações");
                    $('span.label.label-default.novidade-rapidinha-reit').text("Rapidinha Ações");
                    $('span.label.label-default.novidade-rapidinha-stock').text("Rapidinha Ações");
                    $('span.label.label-default.novidade-acao').text("Ações");
                    $('span.label.label-default.novidade-opcao').text("Opções");
                    $('span.label.label-default.novidade-fii').text("Fundos de Investimentos Imobiliários");
                    $('span.label.label-default.novidade-tvbastter').text("Ao vivo");
                    $('span.label.label-default.novidade-video').text("Vídeos");
                    $('span.label.label-default.novidade-voadora').text("Voadora");
                    $('span.label.label-default.novidade-chat').text("Chat");
                    $('span.label.label-default.novidade-venda-coberta').text("Venda Coberta");
                    $('span.label.label-default.novidade-promocao').text("Promoção");
                    $('span.label.label-default.novidade-youtube').text("Youtube");
                }
            }
        }
    );
};


function UltimasGeral() {
    ajaxProxy('Home', 'GetUltimasGeral', '', function (result) {
        if (result.Error) {
            toastr.error(result.Error);
        }
        else {
            var html = '';

            for (var i in result) {
                html += '<a class="list-group-item" href="' + result[i].Link + '"><b>' + result[i].Login + '</b> ' + result[i].Descricao + '</a>';
            }

            $('.tab-pane#todas ul').html(html);
        }
    });
};

function UltimasFIIs() {
    ajaxProxy('Home', 'GetUltimasFIIs', '', function (result) {
        if (result.Error) {
            alert(result.Error);
        }
        else {
            var html = '';

            for (var i in result) {
                html += '<a class="list-group-item" href="' + result[i].Link + '"><b>' + result[i].Login + '</b> ' + result[i].Descricao + '</a>';
            }

            $('.tab-pane#fiis ul').html(html);
        }
    });
};

function UltimasGrupo(grupoID) {
    ajaxProxy('Home', 'GetUltimasGrupo', JSON.stringify({ grupoID: grupoID }), function (result) {
        if (result.Error) {
            toastr.error(result.Error);
        }
        else {
            var html = '';

            for (var i in result) {
                html += '<a class="list-group-item" href="' + result[i].Link + '"><b>' + result[i].Login + '</b> ' + result[i].Descricao + '</a>';
            }

            $('.tab-pane#grupo ul').html(html);
        }
    });
};

function UltimasAcoes() {
    ajaxProxy('Home', 'GetUltimasAcoes', '', function (result) {
        if (result.Error) {
            toastr.error(result.Error);
        }
        else {
            var html = '';

            for (var i in result) {
                html += '<a class="list-group-item" href="' + result[i].Link + '"><b>' + result[i].Login + '</b> ' + result[i].Descricao + '</a>';
            }

            $('.tab-pane#acoes ul').html(html);
        }
    });
};

function UltimasStocks() {
    ajaxProxy('Home', 'GetUltimasStocks', '', function (result) {
        if (result.Error) {
            toastr.error(result.Error);
        }
        else {
            var html = '';

            for (var i in result) {
                html += '<a class="list-group-item" href="' + result[i].Link + '"><b>' + result[i].Login + '</b> ' + result[i].Descricao + '</a>';
            }

            $('.tab-pane#stocks ul').html(html);
        }
    });
};

function Login(mobile) {
    var login;
    var password;

    if (!mobile) {
        login = $('input#login-email').val();
        password = $('input#login-password').val();
    } else {
        login = $('input#login-emailM').val();
        password = $('input#login-passwordM').val();
    }

    $('.btn-login').button('loading');

    ajaxProxy('/WsUsuario', 'Login', JSON.stringify({ login: login, password: password }),
        function (result) {
            //$.unwait($meuperfil.children('div#aguarde'));

            if (result.Error) {
                toastr.error(result.Error);
            }
            else {
                if (result.Return) {
                    toastr.warning(result.Return);
                } else
                    isAuthenticated(function (e) { window.location.reload() });
            }

            $('.btn-login').button('reset');
        });
}

function Logout() {
    ajaxProxy('/WsUsuario', 'Logout', {},
        function (result) {
            if (result.Error) {
                toastr.error(result.Error);
            }
            else {
                isAuthenticated(function (e) { window.location = "/mercado/default.aspx"; });
            }
        }
    );
}

function isAuthenticated(callback) {
    ajaxProxy('/WsUsuario', 'IsAuthenticated', '{}',
        function (result) {
            if (result.Error) { }
            else {
                isAuthenticatedCache = result.IsAuthenticated;

                if (isAuthenticatedCache) {
                    usuarioID = result.UsuarioID;

                    $('ul.subsubnavigation li a.perfil div img, div.shortcuts a.perfil div img, div.js-login figure img').attr('src', result.Imagem);
                    $('div#logado span.usuario-login').html(result.Login);
                    $('div#logado span.usuario-email').html(result.Email);
                    $('div.js-login div.perfil').html(result.TipoUsuario);
                    $('div#logado').show();
                    $('div.login form').hide();
                    $('div.login h1').html('Perfil');
                    $('p#naocadastrado').hide();
                    $('div.js-login').show();
                    $('div.js-logout').hide();

                    if (result.Assinante) {
                        $('div.login form div a.assinatura, div.shortcuts a.assinatura').hide();
                    } else {
                        $('p#naoassinante').show();
                    }

                    if (result.TipoUsuario == 'Equipe')
                        VerificarPendenciaConsultor();
                }
                else {
                    usuarioID = 0;

                    $('div.js-login').hide();
                    $('div.js-logout').show();

                    $('div#deslogado').show();
                    $('div#logado').hide();
                    $('div.login form').show();
                    $('div.login h1').html('entrar');
                    $('div.login form div a.assinatura, div.shortcuts a.assinatura').show();
                    $('div#logado span.usuario-login').html('');
                    $('div#logado span.usuario-email').html('');
                    $('p#naocadastrado').show();
                }

                return callback(isAuthenticatedCache);
            }
        });
}


function ChecharNotificacoes() {
    if (!notifica)
        return;

    if (!isAuthenticatedCache || usuarioID == 0)
        return;

    $.cookie.json = true;

    var r = $.cookie('Notificacoes');

    if (r != undefined) {
        ExibirNotificacoes(r);

        return;
    }

    ajaxProxy('/WsUsuario', 'GetNotificacoes', JSON.stringify({ usuarioID: usuarioID }),
        function (r) {
            if (r.Error) {
            }
            else {
                $.cookie('Notificacoes', r, { expires: 15 });
                ExibirNotificacoes(r);
            }
        });
}

var notificacaoTipoID = 1;

function ExibirNotificacoes(r) {
    var htmlNotificaticoesItens = '', s = '', m = $('.temNotificacao').hide(), n = $('.temNotificacaoLida').hide(), isModerador = r.IsModerador;

    notificacaoTipoID = r.TipoID;

    var counts = { 0: 0 };

    if (r.Itens.length > 0) {
        for (var i in r.Itens) {
            var x = r.Itens[i];

            if (x.Status == 1) {
                if (counts[x.Tipo] == undefined) {
                    counts[x.Tipo] = 1;
                } else {
                    counts[x.Tipo] += 1;
                }
            }

            htmlNotificaticoesItens += '<li class="notificacao ' + (x.Status != 5 ? 'nova' : '') + ' notificacao-area' + x.Area + ' notificacao-tipo' + x.Tipo + ' ' + (x.Participa && x.Status != 5 ? 'bg-success' : '') + ' ' + (x.Participa ? 'comentou' : '') + '">';
            htmlNotificaticoesItens += '<a href="' + x.Link + '" ' + (x.Status != 5 ? 'data="' + x.NotificacaoID + '"' : '') + ' target="_blank">';
            htmlNotificaticoesItens += '<div class="media">';
            htmlNotificaticoesItens += '   <div class="media-left">';
            htmlNotificaticoesItens += '       <div class="media-object">';
            htmlNotificaticoesItens += '           <img src="' + x.Imagem + '" class="pull-left" alt="' + ObterTituloArea(x.Area) + '">';
            htmlNotificaticoesItens += '       </div>';
            htmlNotificaticoesItens += '   </div>';
            htmlNotificaticoesItens += '   <div class="media-body">';
            htmlNotificaticoesItens += '       <p>';            
            htmlNotificaticoesItens += '           <small class="pull-right">' + x.Tempo + '</small>';
            htmlNotificaticoesItens += '           <span class="label label-primary">' + ObterTituloArea(x.Area) + '</span>';

            if (x.Participa)
                htmlNotificaticoesItens += '<span class="label label-success" style="margin-left:5px;">VOCÊ COMENTOU</span>';

            if (x.Link.match(/#mural_|grupos\/forum.aspx/gi))
                htmlNotificaticoesItens += '<span class="label label-primary" data-link="' + x.Link + '" style="margin-left:5px" data-title="Não ser mais notificado neste tópico"><i class="fa fa-bell"></i></span>';

            htmlNotificaticoesItens += '<br>' + x.Texto;
            htmlNotificaticoesItens += '          </p>';
            htmlNotificaticoesItens += '   </div>';
            htmlNotificaticoesItens += '</div>';
            htmlNotificaticoesItens += '</a>';
            htmlNotificaticoesItens += '</li>';


            if (x.Status == 1)
                counts[0]++;
        }
        if (counts[0] > 0) {
            s = counts[0] + ' Notificaç' + (counts[0] > 1 ? 'ões' : 'ão') + ' Nova' + (counts[0] > 1 ? 's!' : '!');
            m.show().find('span').html(counts[0]);
        }
        else {
            s = 'Últimas Notificações';
            n.show();
        }
    }
    else
        s = 'Sem Notificações';

    $('ul.notifications-list').html(htmlNotificaticoesItens);

    $('ul.notifications-list li.nova a').bind('touchstart mousedown', function () {
        NotificacaoDeletar($(this).attr('data'), $(this));
    });

    $('ul.notifications-list li p span:has(> i.fa-bell)').tooltip().on('click touchstart', function (e) {
        var obj = $(this);

        bootbox.confirm("Deseja não ser mais notificado sobre este tópico?", function (result) {
            if (result) {
                ajaxProxy('WsForum', 'NaoNotificar', JSON.stringify({ link: $(obj).data('link') }), function (r) {
                    if (r.Error) {
                        toastr.error(r.Error);
                    } else {
                        if (r.Return)
                            $.cookie('Notificacoes', null, { expires: -1000 });

                            $(obj).closest('li.notificacao').remove();
                    }
                });
            }
        });
        
        e.stopPropagation();
        return false;
    });

    var htmlNotificacoesControles = '';


    htmlNotificacoesControles += '<div class="btn-group btn-group-justified" role="group" aria-label="Justified button group with nested dropdown">';

    htmlNotificacoesControles += '<a role="presentation" class="btn btn-default btn-controlesNotificacao">';
    htmlNotificacoesControles += '<select class="selectFiltroNotificacao" onchange="NotificacaoFiltrar(this.value)">';
    htmlNotificacoesControles += '</select>';
    htmlNotificacoesControles += '</a>';


    var botoes = { Pessoal: 1, Eventos: 2, Social: 3, Todos: 0, Modera: 4 };

    for (var i in botoes) {
        if (botoes[i] != 4 || (botoes[i] == 4 && isModerador))
            if (counts[botoes[i]] != undefined && counts[botoes[i]] != 0) {
                htmlNotificacoesControles += '<a href="#nf-' + botoes[i] + '" class="btn btn-default btn-notificacaoTipo" aria-controls="nf-' + botoes[i] + '" role="tab" data-toggle="tab" aria-expanded="false" onclick="notificacaoTipoID = ' + botoes[i] + ';NotificacaoFiltrar($(this).parent().find(\'select\').val());">';
                htmlNotificacoesControles += i + '<span class="badge">' + counts[botoes[i]] + '</span>';
                htmlNotificacoesControles += '</a>';
            } else {
                htmlNotificacoesControles += '<a href="#nf-' + botoes[i] + '" class="btn btn-default btn-notificacaoTipo" aria-controls="nf-' + botoes[i] + '" role="tab" data-toggle="tab" aria-expanded="false" onclick="notificacaoTipoID = ' + botoes[i] + ';NotificacaoFiltrar($(this).parent().find(\'select\').val());">' + i + '</a>';
            }
    }


    htmlNotificacoesControles += '</ul>';

    $('.notificacoesHeader').html(htmlNotificacoesControles);


    ajaxProxy('WsSite', 'ListarSecoesSite', '',
        function (result) {

            if (result.Error) {
                toastr.error(result.Error);
            }
            else {

                var html = '';
                html += '<option value="0" selected="">Áreas</option>';
                html += '<option value="11">Suporte Técnico</option>';
                html += '<option disabled="">──────────</option>';

                for (var i in result.Secoes) {

                    if (result.Secoes[i].ID == '11')
                        continue;

                    html += '<option value="' + result.Secoes[i].ID + '">' + result.Secoes[i].TITULO + '</option>';
                }
                $('.selectFiltroNotificacao').append(html);
            }
        }
    );

    $('#notificacoes-lista div#notificacao-filtro a').click(function () {
        NotificacaoFiltrar(0);
    });

    NotificacaoFiltrar(0);

    $('.notification-icon').click(function () {
        if ($('.notifications-items').toggle()) {
            if ($('.notifications-items').is(":visible")) {
                $('body').append('<div class="overlay-notifications"></div>');
                $('.overlay-notifications').click(function () {
                    $('.overlay-notifications').remove();
                    $('.notifications-items').toggle();
                });
            }else {
                $('.overlay-notifications').css("visibility","hidden");
                $('.notifications-items').hide();
            }
        }
    });

    $('#logo').attr('title', s);
}

function NotificacaoDeletar(notificacaoID, obj) {
    ajaxProxy('WsUsuario', 'DeleteNotificacao', JSON.stringify({ notificacaoID: notificacaoID }), function (r) {
        if (r.Error) {
            alertTop(r.Error, 'erro');
        } else {
            $(obj).parent().removeClass('nova').removeClass('bg-success');
        }
    });
}

function NotificacoesMarcarLidas() {
    ajaxProxy('WsUsuario', 'UpdateNotificacoes', JSON.stringify({ status: 5 }), function (r) {
        if (r.Error) {
            toastr.error(r.Error);
        } else {
            $('ul.notifications-list li.notificacao.nova').removeClass('nova').removeClass('bg-success');
        }
    });
}

function NotificacoesMarcarVistas() {
    ajaxProxy('WsUsuario', 'UpdateNotificacoes', JSON.stringify({ status: 2 }), function (r) {
        if (r.Error) {
            alertTop(r.Error, 'erro');
        } else {
            $('.notification-icon span.badge').empty();
            $('.notification-icon i.animated').removeClass('animated');

            $.cookie('Notificacoes', null, { expires: -1000 });
        }
    });
}

function notificacaoComentouToggle(obj) {
    var $li = $('ul.notifications-list li.notificacao').not('.comentou');

    var $i = $(obj).children('i');

    if ($i.hasClass('fa-comments')) {
        $li.show();
        $i.addClass('fa-comments-o');
        $i.removeClass('fa-comments');
    } else {
        $li.hide();
        $i.removeClass('fa-comments-o');
        $i.addClass('fa-comments');
    }

}

$(document).ready(function () {


    $('.dropdown.notificacoes').on('shown.bs.dropdown', function () {
        if (!isAuthenticatedCache || usuarioID == 0) {
            toastr.warning('Faça o login para visualizar suas notificações.');
            return;
        }

        // bloco não está funcionando, verificar
        var l = $(".notifications-items");
        //l.toggle();
        if (l.is(':visible')) {
            notifica = false;
            $('.temNotificacao').hide();
            $('.temNotificacaoLida').show();

            $.cookie('Notificacoes', null, { expires: -1000 });
        }
    });

    $('.login-input').keyup(function (e) {
        if (e.which == 13) {
            Login(false);
        }
    });
    //forumUltimas.listar();
});


function NotificacaoFiltrar(filtroArea) {

    var $n = $('ul.notifications-list');

    var areaID = filtroArea;

    $n.children().show();

    if (notificacaoTipoID != 0)
        $n.children().not('li.notificacao-tipo' + notificacaoTipoID).hide();

    if (areaID != 0)
        $n.children().not('li.notificacao-area' + areaID).hide();

    // salva filtro padrao
    ajaxProxy('/WsUsuario', 'SaveNotificacoesDefaultTipo', JSON.stringify({ tipoID: notificacaoTipoID }),
        function (r) {

        });
}

function ObterTituloArea(areaID) {
    switch (parseInt(areaID)) {
        case 1:
            return 'AÇÕES';
        case 12:
            return 'BASTTER BLUE';
        case 6:
            return 'INVESTIMENTOS NO EXTERIOR';
        case 4:
            return 'FIIS & IMÓVEIS';
        case 8:
            return 'SAÚDE & ESPORTES';
        case 3:
            return 'TRANQUILIDADE FINANCEIRA';
        case 9:
            return 'IMPOSTO DE RENDA';
        case 7:
            return 'INICIANTE';
        case 5:
            return 'RENDA FIXA';
        case 2:
            return 'RESERVA DE VALOR';
        case 10:
            return 'ASSUNTOS GERAIS';
        case 11:
            return 'SUPORTE';
    }
}

function ObterArea(id) {
    switch (parseInt(id)) {
        case 226:
        case 285:
            return 'AÇÕES';
        case 177:
            return 'BASTTER BLUE';
        case 289:
        case 335:
        case 344:
            return 'INVESTIMENTOS NO EXTERIOR';
        case 240:
        case 298:
            return 'FIIS & IMÓVEIS';
        case 337:
        case 71:
            return 'SAÚDE & ESPORTES';
        case 281:
        case 331:
            return 'TRANQUILIDADE FINANCEIRA';
        case 184:
            return 'IMPOSTO DE RENDA';
        case 224:
            return 'INICIANTE';
        case 107:
            return 'RENDA FIXA';
        case 170:
        case 341:
            return 'RESERVA DE VALOR';
        case 206:
            return 'ASSUNTOS GERAIS';
        case 89:
            return 'SUPORTE';
    }
}

function ChatOnLine() {
    var html = '';
    ajaxProxy('/WsForum', 'Live', '', function (result) {
        if (result.Error) {
            toastr.error(result.Error);
        }
        else {
            if (result.Status) {
                var showChat = true;

                $('.panel-chat h4.panel-title').html('<strong>' + result.Login + '</strong>');

                if (result.Assinante == false)
                    html += '<a href="/Mercado/Loja/Categoria/5/Bastter-Blue.aspx" target="_blank"><img src="/mercado/images/banners/banner-exclusivo-assinante.png?v=2" style="width:300px;"></a>';
                else
                    html += '<iframe width=\"100%\" height="315px" src=\"https://www.youtube.com/embed/' + result.YouTubeCode + '\" frameborder=\"0\" allowfullscreen></iframe>';

                $(".videoChatOnline").html(html);
                $('.panel-chat-container').show();

                if ($.cookie('scrollChat') == "true" || $.cookie('scrollChat') == true || $.cookie('scrollChat') == undefined) {
                    $('.panel-chat .close img').attr("src", "/mercado/images/pin_inactive.svg");
                } else {
                    $('.panel-chat .close img').attr("src", "/mercado/images/pin_active.svg");
                }


                $(window).scroll(function () {
                    if ($.cookie('scrollChat') == "true" || $.cookie('scrollChat') == true || $.cookie('scrollChat') == undefined) {
                        $('.panel-chat .close img').attr("src", "/mercado/images/pin_inactive.svg");
                        $('.panel-chat iframe').attr("height", "");
                        var ha = ($('.panel-chat').offset().top + $('.panel-chat').height());
                        if ($(window).scrollTop() > 600) {
                            if (showChat) {
                                $('.panel-chat').removeClass('in').addClass('out');
                                $('.colunaConteudo').css('padding-top', '560px');
                                $('.panel-chat-container .panel-footer').hide();
                            }
                        } else {

                            if ($(window).scrollTop() == 0) {
                                showChat = true;
                                $('.panel-chat-container .panel-footer').show();
                            }

                            $('.panel-chat').removeClass('out').addClass('in');
                            $('.panel-chat iframe').attr('height', '315px');
                            $('.colunaConteudo').css('padding-top', '0px');
                            //$('.panel-chat').css('bottom','-500px');             
                        };
                    } else {
                        $('.panel-chat .close img').attr("src", "/mercado/images/pin_active.svg");
                    }

                });

                $('.panel-chat .close').click(function () {
                    if ($.cookie('scrollChat') == "true" || $.cookie('scrollChat') == true || $.cookie('scrollChat') == undefined) {
                        $('.panel-chat').removeClass('out').addClass('in');
                        $('.colunaConteudo').css('padding-top', '0px');
                        $('.panel-chat iframe').attr('height', '315px');
                        showChat = false;
                        $.cookie('scrollChat', false);
                        $('.panel-chat .close img').attr("src", "/mercado/images/pin_active.svg");
                    } else {
                        showChat = true;
                        $.cookie('scrollChat', true);
                        $('.panel-chat .close img').attr("src", "/mercado/images/pin_inactive.svg");
                    }
                    //$('.panel-chat').hide();
                });
            }
            /*
            if (result.Status) {
                $("a.btn-ao-vivo, button.btn-ao-vivo").show();

                var html = '<a href="javascript:;" class="btn-fechar-chat-fixed pull-left" data-toggle="dropdown">';
                html += '    <i class="fa fa-close"></i>';
                html += '   </a >';

                if (result.Assinante == false)
                    html += '<a href="/Mercado/Loja/Categoria/5/Bastter-Blue.aspx" target="_blank"><img src="/mercado/images/banners/banner-exclusivo-assinante.png?v=2" style="width:300px;"></a>';
                else
                    html += '<iframe width=\"530\" height=\"315\" src=\"https://www.youtube.com/embed/' + result.YouTubeCode + '\" frameborder=\"0\" allowfullscreen></iframe><br /><iframe allowfullscreen=\"\" frameborder=\"0\" height=\"315\" src=\"https://www.youtube.com/live_chat?v=' + result.YouTubeCode + '&embed_domain=' + result.Host + '\" width=\"530\"></iframe>';

                $("#videoBox").html(html);
                $('#dropdownChatClose, .btn-fechar-chat-fixed').click(function () {
                   // $('.dropdownChat').dropdown('toggle');
                });

                $('#livestream').show();
                $('#livestream a img').attr('src', '/Mercado/Images/banner-forum-livestream-' + result.Login + '.png');

                $('.dropdownChat h3.panel-title').html('Chat online - ' + result.Login);
                    

            } else {
                $('#livestream').hide();
            }
            */
        }
    });
}

function AtualizarAssinantes() {
    var $amigos = $('div#amigos');

    if ($amigos.length == 0)
        return;

    ajaxProxy('/WsSite', 'ObterAssinantes', '{}',
        function (result) {
            if (result.Error) {
            }
            else {
                for (var i in result.Assinantes) {
                    $('ul.amigosAssinantes').append('<li><a href="/mercado/loja/assinaturas.aspx" title="Amigo ' + result.Assinantes[i].Login + '" class="perfil"><img src="/Mercado/Images/Perfil/' + result.Assinantes[i].Imagem + '.jpg" class="img-rounded"></a></li>');
                }
            }
        }
    );
}

// ULTIMAS
var topicoID = 0,
    topicoIDGrupo = 0;

var forumUltimas = {
    listar: function () {
        var $itens = $('div#bloco-posts-forum');
        var btnCarregarMais = $('#carregarMais');
        html = '';

        if (topicoID == 0)
            $itens.html(html);

        //$('.bastter-loading').show();
        $('#carregarMais').button('loading');

        var serviceName = '';

        if ($.isMobile.any())
            serviceName = 'GetMessagesMobile';
        else
            serviceName = 'GetMessages';

        ajaxProxy('/WsForum', serviceName, JSON.stringify({ topicoID: topicoID, pageSize: ($.cookie('qtdTopicosCarregar') == undefined ? 0 : $.cookie('qtdTopicosCarregar'))}),
            function (result) {
                if (result.Error) {
                    toastr.error(result.Error);
                }
                else {
                    for (var i in result.Mensagens) {
                        var item = result.Mensagens[i];
                        var topicoSelo = item.TipoUsuario == 'Assinante' || item.TipoUsuario == 'Equipe';

                        topicoID = item.TopicoID;

                        if (item.UsuarioID == 2600) {
                            if (item.Titulo == 'Ações > Últimos Balanços Publicados!' || item.Titulo == 'Ações > Novas Rapidinhas!' || item.Titulo == 'Ações > Comentários Trimestrais!' || item.Titulo == 'Videos e Chats - Resumo Semanal' || item.Titulo == 'Stocks e REITs > Últimos Balanços Publicados!' || item.Titulo == 'FIIs > Últimos Balanços Publicados!' || item.Titulo == 'Novo Livro Digital para Assinantes!' || item.Titulo.indexOf('Novo Video:') > -1) {
                                $itens.append(forumUltimas.panelBastter(item, result.IsAssinante));
                                continue;
                            }
                            else if (item.Titulo == 'Análise de Carteiras para Assinantes' && result.IsAssinante) {
                                item.Texto = item.Texto.replace('/loja/assinaturas.aspx', '/vcblue/default.aspx');
                            }
                            else if (item.Titulo == 'Boletins Bastter Blue ATUALIZADOS!' && result.IsAssinante) {
                                item.Texto = item.Texto.replace('/loja/assinaturas.aspx', '/bastterblue/default.aspx#boletins');
                            }
                        }

                        html = '';
                        html += '<div id="topico_' + item.TopicoID + '" class="panel panel-default ' + (item.UsuarioID == 2600 ? 'bloco-destaque ' : '') + (item.Status == 5 ? 'topico-deletado' : '') + '">';
                        html += '   <div class="panel-heading">';

                        if (item.UsuarioID == 2600) {
                            html += '       <h4>' + item.Titulo + '</h4>';
                        } else {
                            html += '       <ul class="opcoes-topico pull-right" id="opcoes-topico-' + item.TopicoID + '">';

                            //determina quantos comentarios ainda nao foram lidos
                            //Se o usuário já abriu o tópico alguma vez pega o numero de comentarios não lidos ainda
                            //Se o usuário nunca abriu o tópico, pega o numero de respostas total.
                            if (item.JaLeu) {
                                if (item.NaoLidas > 0)
                                    html += '<li><a href="javascript:;" onclick="topicoDiscussao(' + item.TopicoID + ',' + item.Status + ',' + result.IsAdmin + ',' + result.IsModerador + ',false ,false, ' + item.UltimaRespostaVista + ')" data-toggle="tooltip" data-original-title="' + item.NaoLidas + ' novos comentários" class="novo-comentario" id="badge-comentarios-' + item.TopicoID + '">' + item.NaoLidas + '</a></li>';
                                else
                                    html += '<li><a href="javascript:;" onclick="topicoDiscussao(' + item.TopicoID + ',' + item.Status + ',' + result.IsAdmin + ',' + result.IsModerador + ',false, false, ' + item.UltimaRespostaVista + ')" data-toggle="tooltip" data-original-title="0 comentários novos" class="novo-comentario visto" id="badge-comentarios-' + item.TopicoID + '"><i class="fa fa-check"></i></a></li>';
                            } else {
                                if (item.QtdRespostas > 0)
                                    html += '<li><a href="javascript:;" onclick="topicoDiscussao(' + item.TopicoID + ',' + item.Status + ',' + result.IsAdmin + ',' + result.IsModerador + ',false, false, ' + item.UltimaRespostaVista + ')" data-toggle="tooltip" data-original-title="' + item.QtdRespostas + ' novos comentários" class="novo-comentario" id="badge-comentarios-' + item.TopicoID + '">' + item.QtdRespostas + '</a></li>';
                                else
                                    html += '<li><a href="javascript:;" onclick="topicoDiscussao(' + item.TopicoID + ',' + item.Status + ',' + result.IsAdmin + ',' + result.IsModerador + ',false, false, ' + item.UltimaRespostaVista + ')" data-toggle="tooltip" data-original-title="0 comentários novos" class="novo-comentario visto" id="badge-comentarios-' + item.TopicoID + '"><i class="fa fa-check"></i></a></li>';
                            }


                            if (!item.SimNotificar && !item.NaoNotificar) {
                                html += '<li class="simNotificar" ><a href="javascript:;" onclick="Notificar(' + null + ',' + item.TopicoID + ',true)" title="Não ser notificado" data-toggle="tooltip"><i class="fa fa-bell-o"></i></a></li>';
                            } else if (item.NaoNotificar) {
                                html += '<li class="simNotificar" ><a href="javascript:;" onclick="Notificar(' + null + ',' + item.TopicoID + ',true)" title="Não ser notificado" data-toggle="tooltip"><i class="fa fa-bell-slash"></i></a></li>';
                            } else if (item.SimNotificar) {
                                html += '<li class="naoNotificar"><a href="javascript:;" onclick="Notificar(' + null + ',' + item.TopicoID + ',false)" title="Ser notificado" data-toggle="tooltip"><i class="fa fa-bell"></i></a></li>';
                            }

                            html += '               <li title="Adicionar/Remover dos Favoritos" data-toggle="tooltip">';
                            html += '                   <a href="javascript:;" onclick="AdicionarFavorito(' + item.TopicoID + ', this)"  data-placement="left">';
                            html += (!item.Favorito ? '<i class="fa fa-star-o"></i>' : '<i class="fa fa-star"></i>');
                            html += '                   </a>';
                            html += '               </li>';
                            html += '       </ul>';
                            /*
                            html += '       <div class="dropdown pull-right">';
                            html += '           <div class="menu-dots dropdown-toggle tooltipActive" role="button" id="opcoes-topico" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" title="Opções"></div >';
                            html += '           <ul id="opcoes-topico-'+item.TopicoID+'"class="dropdown-menu opcoes-topico" aria-labelledby="opcoes-topico">';
                            html += (!item.SimNotificar ? '               <li class="simNotificar"><a href="javascript:;" onclick="Notificar(' + null + ',' + item.TopicoID +',true)"><i class="fa fa-bell" ></i> Seguir tópico</a></li>' : '');
                            html += (!item.NaoNotificar && item.SimNotificar  ? '               <li class="naoNotificar"><a href="javascript:;" onclick="Notificar(' + null + ',' + item.TopicoID +',false)"><i class="fa fa-bell-slash" ></i> Deixar de seguir</a></li>' : '');

                            html += '           </ul>';
                            html += '       </div >';
                            */
                            html += '       <h4>';
                            html += '           <a href="/mercado/forum/' + item.TopicoID + '/' + item.Link + '.aspx" title="' + item.Titulo + '" target="_blank">' + item.Titulo + '</a>';
                            html += (item.QtdRespostas > 0) ? '<br/><small class="text-muted hidden-lg hidden-sm hiddem-md">comentada em ' + $.toDate(item.DataUltimaResposta, false, true, false) + '</small>' : '';
                            html += '       </h4>';
                        }

                        html += (item.LinkArea != '' ? item.LinkArea : '<span class="btn btn-default btn-xs pull-left">Bastter.com</span>');
                        html += (item.Status != 1 ? '<span class="statusTopico ">' +
                            (item.Status == 9 ? ' <i class="fa fa-lock"></i> Tópico fechado' : '') +
                            (item.Status == 5 ? ' <i class="fa fa-close"></i> Tópico excluído' : '') +
                            '</span>' : '');
                        html += '   </div >';
                        html += '   <div class="panel-body">';
                        html += '       <div class="row">';
                        html += '           <div class="col-md-12 col-xs-12 margin-top margin-bottom">';
                        html += '               <div class="media">';
                        html += '                   <div class="media-left">';
                        html += '                       <a id="profilePopup_' + item.TopicoID + '" onMouseOver="getUserProfilePic(\'#profilePopup_' + item.TopicoID + '\',' + item.UsuarioID + ', \'' + item.Avatar + '\', \'' + item.Login + '\', ' + result.IsAdmin + ', \'' + item.IP + '\')" title="Ver perfil" href="javascript:;" tabindex="0" class="pop avatar img-circle" role="button" data-toggle="popover" data-trigger="hover" title="" data-html="true" data-placement="right" data-content="Carregando.."><img src="' + item.Avatar + '" class="img-responsive user-photo" alt="' + item.Login + '"></a>';
                        html += '                   </div>';
                        html += '                   <div class="media-body">';
                        html += (topicoSelo) ? '<a href="/mercado/loja/assinaturas.aspx" data-toggle="tooltip" class="pull-right" title="Amigo da Bastter.com Torne-se um também!"><img class="img-responsive" src="images/badge-amigo-bastter.png" style="width:75px" alt="' + item.Login + '"></a>' : '';
                        html += '                       <a class="profileLink pop ' + (item.TipoUsuario == 'Usuario' ? 'naoAssinante':'') + '" onMouseOver="$(\'#profilePopup_' + item.TopicoID + '\').mouseover();" href="/Mercado/Perfil.aspx?ID=' + item.UsuarioID + '">' + item.Login + '</a><br />';
                        html += '                       <small class="text-muted data-topico"> em ' + $.toDate(item.Data, false, true, false) + '</small>';
                        html += (item.QtdRespostas > 0) ? '<br/><small class="badge hidden-xs">comentada em ' + $.toDate(item.DataUltimaResposta, false, true, false) + '</small>' : '';
                        html += '                   </div>';
                        html += '               </div>';
                        html += '           </div>';
                        html += '           <div id="conteudo-topico_' + item.TopicoID + '" class="col-md-12 col-xs-12">';
                        html += '               <div class="conteudo-topico ' + (item.UsuarioID != 2600 ? 'expandable' : '') + '">';
                        html += item.Texto;
                        html += item.Imagem != '' && item.Imagem != null ? '<img src="/mercado/arquivos/grupo/' + item.Imagem + '" alt="Clique para exibir a imagem" style="max-width:100%"/>' : '';
                        html += '               </div>';
                        html += '               <div class="expandir-conteudo"></div>';
                        html += '           </div>';
                        html += '       </div>';
                        html += '       <div class="row" id="topicoControles_' + item.TopicoID + '"></div>';
                        html += '   </div>';
                        html += '   <div class="panel-footer">';
                        html += '       <div class="row collapse discussao" id="topico_' + item.TopicoID + '_discussao"></div>';
                        html += '       <div class="row" id="topicoSocial_' + item.TopicoID + '"></div>';
                        html += '       <div class="row" id="topicoAlertas_' + item.TopicoID + '">';
                        html += '           <div class="col-md-12">';
                        html += '           </div>';
                        html += '       </div>';
                        html += '       <div class="row" id="topico_' + item.TopicoID + '_comentarioBox"></div>';
                        html += '   </div>';
                        html += '</div>';

                        $itens.append(html);



                        topicoControles(item, result.IsAdmin, result.IsModerador);

                        topicoSocial(item, result.IsAdmin, result.IsModerador);

                        //$('#profilePopup_' + item.ID).mouseover(getUserProfilePic($('#profilePopup_' + item.ID),item.UsuarioID, item.Avatar, item.Login));

                    }

                    btnCarregarMais.unbind('click').click(function () { forumUltimas.listar() }).show();

                    //busca emojis nos topicos
                    /*
                    $('.conteudo-topico').each(function () {
                        var texto = $(this).html();
                        $(this).html(emojione.shortnameToImage(texto));
                    });
                    */

                    //configura imgens para abrir ampliadas no popup
                    if (!$.isMobile.any()) {
                        $('.conteudo-topico img ').not('.conteudo-topico.panel-bastter img').each(function () {
                            if (!$(this).parent().is("a")) {
                                    imagemFullSize($(this));
                            }
                        });
                    }


                    //limita tamanho do texto                    
                    $('.conteudo-topico.expandable').each(function () {
                        var height = $(this).height();
                        if (height > 150) {
                            topicoComprimir($(this));
                        }
                    });

                    $(".pop").popover({ trigger: "manual", html: true, animation: false })
                        .on("mouseenter", function () {
                            var _this = this;
                            $(this).popover("show");
                            $(".popover").on("mouseleave", function () {
                                $(_this).popover('hide');
                            });
                        }).on("mouseleave", function () {
                            var _this = this;
                            setTimeout(function () {
                                if (!$(".popover:hover").length) {
                                    $(_this).popover("hide");
                                }
                            }, 300);
                        });

                    $('.bastter-loading').hide();
                    $('#carregarMais').button('reset');
                    $('.carregarMais').show();
                }
            });

        //configura imgens para abrir ampliadas no popup


    },

    listarGrupo: function (grupoID, tipoOrdem, pesquisaTermo, pesquisaTipo) {
        var $itens = $('div#bloco-posts-forum');
        var btnCarregarMais = $('#carregarMais');
        html = '';

        if (topicoIDGrupo == 0)
            $itens.html(html);

        

        $('#carregarMais').button('loading');

        var mobile = ($.isMobile.any() ? 1 : 0);

        ajaxProxy('/WsForum', 'GetMessagesGrupo', JSON.stringify({ topicoID: topicoIDGrupo, grupos: grupoID.toString(), isMobile: mobile, pageSize: ($.cookie('qtdTopicosCarregar') == undefined ? 0 : $.cookie('qtdTopicosCarregar')), tipoOrdem: tipoOrdem, pesquisaTermo: pesquisaTermo, pesquisaTipo: pesquisaTipo }),
            function (result) {
                if (result.Error) {
                    toastr.error(result.Error);
                }
                else {
                    for (var i in result.Mensagens) {
                        var item = result.Mensagens[i];
                        var topicoSelo = item.TipoUsuario == 'Assinante' || item.TipoUsuario == 'Equipe';

                        topicoIDGrupo = item.TopicoID;

                        html = '';
                        html += '<div id="topico_' + item.TopicoID + '" class="panel panel-default ' + (item.Status == 5 ? 'topico-deletado' : '') + '">';
                        html += '   <div class="panel-heading">';

                        if (item.UsuarioID == 2600) {
                            html += '       <h4>' + item.Titulo + '</h4>';
                        } else {
                            html += '       <ul class="opcoes-topico pull-right" id="opcoes-topico-' + item.TopicoID + '">';

                            //determina quantos comentarios ainda nao foram lidos
                            //Se o usuário já abriu o tópico alguma vez pega o numero de comentarios não lidos ainda
                            //Se o usuário nunca abriu o tópico, pega o numero de respostas total.
                            if (item.JaLeu) {
                                if (item.NaoLidas > 0)
                                    html += '<li><a href="javascript:;" onclick="topicoDiscussao(' + item.TopicoID + ',' + item.Status + ',' + result.IsAdmin + ',' + result.IsModerador + ',false, false, ' + item.UltimaRespostaVista + ')" data-toggle="tooltip" data-original-title="' + item.NaoLidas + ' novos comentários" class="novo-comentario" id="badge-comentarios-' + item.TopicoID + '">' + item.NaoLidas + '</a></li>';
                                else
                                    html += '<li><a href="javascript:;" onclick="topicoDiscussao(' + item.TopicoID + ',' + item.Status + ',' + result.IsAdmin + ',' + result.IsModerador + ',false, false, ' + item.UltimaRespostaVista + ')" data-toggle="tooltip" data-original-title="0 comentários novos" class="novo-comentario visto" id="badge-comentarios-' + item.TopicoID + '"><i class="fa fa-check"></i></a></li>';
                            } else {
                                if (item.QtdRespostas > 0)
                                    html += '<li><a href="javascript:;" onclick="topicoDiscussao(' + item.TopicoID + ',' + item.Status + ',' + result.IsAdmin + ',' + result.IsModerador + ',false, false, ' + item.UltimaRespostaVista + ')" data-toggle="tooltip" data-original-title="' + item.QtdRespostas + ' novos comentários" class="novo-comentario" id="badge-comentarios-' + item.TopicoID + '">' + item.QtdRespostas + '</a></li>';
                                else
                                    html += '<li><a href="javascript:;" onclick="topicoDiscussao(' + item.TopicoID + ',' + item.Status + ',' + result.IsAdmin + ',' + result.IsModerador + ',false, false, ' + item.UltimaRespostaVista + ')" data-toggle="tooltip" data-original-title="0 comentários novos" class="novo-comentario visto" id="badge-comentarios-' + item.TopicoID + '"><i class="fa fa-check"></i></a></li>';
                            }

                            html += (!item.SimNotificar && !item.NaoNotificar ? '               <li class="simNotificar" ><a href="javascript:;" onclick="Notificar(' + null + ',' + item.TopicoID + ',true)" title="Não ser notificado" data-toggle="tooltip"><i class="fa fa-bell-o"></i></a></li>' : '');
                            html += (item.NaoNotificar ? '               <li class="simNotificar" ><a href="javascript:;" onclick="Notificar(' + null + ',' + item.TopicoID + ',true)" title="Não ser notificado" data-toggle="tooltip"><i class="fa fa-bell-slash"></i></a></li>' : '');
                            html += (item.SimNotificar ? '               <li class="naoNotificar"><a href="javascript:;" onclick="Notificar(' + null + ',' + item.TopicoID + ',false)" title="Ser notificado" data-toggle="tooltip"><i class="fa fa-bell"></i></a></li>' : '');                            
                            html += '               <li title="Adicionar/Remover dos Favoritos" data-toggle="tooltip">';
                            html += '                   <a href="javascript:;" onclick="AdicionarFavorito(' + item.TopicoID + ', this)"  data-placement="left">';
                            html += (!item.Favorito ? '<i class="fa fa-star-o"></i>' : '<i class="fa fa-star"></i>');
                            html += '                   </a>';
                            html += '               </li>';
                            html += '       </ul>';
                            /*
                            html += '       <div class="dropdown pull-right">';
                            html += '           <div class="menu-dots dropdown-toggle tooltipActive" role="button" id="opcoes-topico" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" title="Opções"></div >';
                            html += '           <ul id="opcoes-topico-'+item.TopicoID+'"class="dropdown-menu opcoes-topico" aria-labelledby="opcoes-topico">';
                            html += (!item.SimNotificar ? '               <li class="simNotificar"><a href="javascript:;" onclick="Notificar(' + null + ',' + item.TopicoID +',true)"><i class="fa fa-bell" ></i> Seguir tópico</a></li>' : '');
                            html += (!item.NaoNotificar && item.SimNotificar  ? '               <li class="naoNotificar"><a href="javascript:;" onclick="Notificar(' + null + ',' + item.TopicoID +',false)"><i class="fa fa-bell-slash" ></i> Deixar de seguir</a></li>' : '');

                            html += '           </ul>';
                            html += '       </div >';
                            */
                            
                            html += '       <h4>';
                            html += '           <a href="/mercado/forum/' + item.TopicoID + '/' + item.Link + '.aspx" title="' + item.Titulo + '" target="_blank">' + item.Titulo + '</a>';
                            html += (item.QtdRespostas > 0) ? '<br/><small class="text-muted hidden-lg hidden-sm hiddem-md">comentada em ' + $.toDate(item.DataUltimaResposta, false, true, false) + '</small>' : '';
                            html += '       </h4>';
                        }
                        html += (item.LinkArea != '' ? item.LinkArea : '<span class="btn btn-default btn-xs pull-right">Bastter.com</span>');

                        html += (item.Status != 1 ? '<span class="statusTopico ">' +
                            (item.Status == 9 ? ' <i class="fa fa-lock"></i> Tópico fechado' : '') +
                            (item.Status == 5 ? ' <i class="fa fa-close"></i> Tópico excluído' : '') +
                            '</span>' : '');
                        html += '   </div >';
                        html += '   <div class="panel-body">';
                        html += '       <div class="row">';
                        html += '           <div class="col-md-12 col-xs-12 margin-top margin-bottom">';
                        html += '               <div class="media">';
                        html += '                   <div class="media-left">';
                        html += '                       <a id="profilePopup_' + item.TopicoID + '" onMouseOver="getUserProfilePic(\'#profilePopup_' + item.TopicoID + '\',' + item.UsuarioID + ', \'' + item.Avatar + '\', \'' + item.Login + '\', ' + result.IsAdmin + ', \'' + item.IP + '\')" href="javascript:;" title="Ver perfil" tabindex="0" class="pop avatar img-circle" role="button" data-toggle="popover" data-trigger="hover" title="" data-html="true" data-placement="right" data-content="Carregando.."><img src="' + item.Avatar + '" class="img-responsive user-photo" alt="' + item.Login + '"></a>';
                        html += '                   </div>';
                        html += '                   <div class="media-body">';
                        html += (topicoSelo) ? '<a href="/mercado/loja/assinaturas.aspx" data-toggle="tooltip" class="pull-right" title="Amigo da Bastter.com Torne-se um também!"><img class="img-responsive" src="images/badge-amigo-bastter.png" style="width:75px" alt="' + item.Login + '"></a>' : '';
                        html += '                       <a class="profileLink pop ' + (item.TipoUsuario == 'Usuario' ? 'naoAssinante': '') + '" onMouseOver="$(\'#profilePopup_' + item.TopicoID + '\').mouseover();" href="/Mercado/Perfil.aspx?ID=' + item.UsuarioID + '">' + item.Login + '</a><br />';
                        html += '                       <small class="text-muted data-topico"> em ' + $.toDate(item.Data, false, true, false) + '</small>';
                        html += (item.QtdRespostas > 0) ? '<br/><small class="badge hidden-xs">comentada em ' + $.toDate(item.DataUltimaResposta, false, true, false) + '</small>' : '';
                        html += '                   </div>';
                        html += '               </div>';
                        html += '           </div>';
                        html += '           <div id="conteudo-topico_' + item.TopicoID + '" class="col-md-12 col-xs-12">';
                        html += '               <div class="conteudo-topico ' + (item.UsuarioID != 2600 ? 'expandable' : '') + '">';
                        html += item.Texto;
                        html += item.Imagem != '' && item.Imagem != null ? '<img src="/mercado/arquivos/grupo/' + item.Imagem + '" alt="Clique para exibir a imagem" style="max-width:100%"/>' : '';
                        html += '               </div>';
                        html += '               <div class="expandir-conteudo"></div>';
                        html += '           </div>';
                        html += '       </div>';
                        html += '       <div class="row" id="topicoControles_' + item.TopicoID + '"></div>';
                        html += '   </div>';
                        html += '   <div class="panel-footer">';
                        html += '       <div class="row collapse discussao" id="topico_' + item.TopicoID + '_discussao"></div>';
                        html += '       <div class="row" id="topicoSocial_' + item.TopicoID + '"></div>';
                        html += '       <div class="row margin-top" id="topicoAlertas_' + item.TopicoID + '">';
                        html += '           <div class="col-md-12">';
                        html += '           </div>';
                        html += '       </div>';
                        html += '       <div class="row" id="topico_' + item.TopicoID + '_comentarioBox"></div>';
                        html += '   </div>';
                        html += '</div>';

                        $itens.append(html);



                        topicoControles(item, result.IsAdmin, result.IsModerador);

                        topicoSocial(item, result.IsAdmin, result.IsModerador);

                    }

                    btnCarregarMais.unbind('click').click(function () { forumUltimas.listarGrupo(grupoID, 1, '', 0) }).show();

                    //busca emojis nos topicos
                    /*
                    $('.conteudo-topico').each(function () {
                        var texto = $(this).html();
                        $(this).html(emojione.shortnameToImage(texto));
                    });
                    */

                    //configura imgens para abrir ampliadas no popup
                    if (!$.isMobile.any()) {
                        $('.conteudo-topico img').not('.conteudo-topico.panel-bastter').each(function () {
                            if (!$(this).parent().is("a")) {
                                    imagemFullSize($(this));
                            }
                        });
                    }

                    //limita tamanho do texto                    
                    $('.conteudo-topico.expandable').each(function () {
                        var height = $(this).height();
                        if (height > 150) {
                            topicoComprimir($(this));
                        }
                    });





                    $(".pop").popover({ trigger: "manual", html: true, animation: false })
                        .on("mouseenter", function () {
                            var _this = this;
                            $(this).popover("show");
                            $(".popover").on("mouseleave", function () {
                                $(_this).popover('hide');
                            });
                        }).on("mouseleave", function () {
                            var _this = this;
                            setTimeout(function () {
                                if (!$(".popover:hover").length) {
                                    $(_this).popover("hide");
                                }
                            }, 300);
                        });



                    $('.bastter-loading').hide();
                    $('#carregarMais').button('reset');
                    $('.carregarMais').show();
                }
            });

        //configura imgens para abrir ampliadas no popup


    },

    panelBastter: function (item, isAssinante) {
        var html = '';

        html += '<div class="panel panel-default bloco-destaque">';

        html += '<div class="panel-heading"> <h4>' + item.Titulo + '</h4><span class="btn btn-default btn-xs pull-right">Bastter.com</span></div>';

        html += '<div class="panel-body">';

        html += '   <div class="row">';

        html += '           <div class="col-md-12 col-xs-12">';
        html += '               <div class="media">';
        html += '                   <div class="media-left">';
        html += '                       <img src="/Mercado/Images/Perfil/2600.jpg" class="img-responsive user-photo" alt="Bastter.com">';
        html += '                   </div>';
        html += '                   <div class="media-body">';
        html += '                       <a href="#">bastter.com</a>';
        html += '                       <small> em ' + $.toDate(item.Data, false, true, false) + '</small><br />';
        html += '                       <a href="/mercado/loja/assinaturas.aspx" class="btn btn-primary btn-xs">Seja Bastter Blue!</a>';
        html += '                   </div>';
        html += '               </div>';
        html += '           </div>';

        html += '           <div id="conteudo-topico_' + item.TopicoID + '" class="col-md-12 col-xs-12">';
        html += '               <div class="conteudo-topico panel-bastter">';
        html += item.Texto;
        html += '               </div>';
        html += '               <div class="expandir-conteudo"></div>';
        html += '           </div>';

        html += '   </div>';
        html += '</div>';

        if (!isAssinante) {
            html += '<div class="panel-footer">';
            html += '   <div class="row">';
            html += '       <div class="col-md-12">';
            html += '           <a href="/mercado/loja/assinaturas.aspx"><img src="/mercado/images/banners/banner-assinante-timeline.png" class="img-responsive img-rounded center-block"></a>';
            html += '       </div>';
            html += '   </div>';
            html += '</div>';
        }

        return html;
    }
};

function topicoControles(item, IsAdmin, IsModerador) {
    var html = '';

    if (item.UsuarioID == 2600)
        return;

    html += '    <ul class="col-md-12 list-inline list-unstyled topicoControles">';

    if (IsAdmin || IsModerador) {
        html += item.Status == 1 ? '<li class=\"btnModerador btnExcluirRestaurar\"><a href="javascript:;" onclick="DeleteMessage(' + item.TopicoID + ', true, ' + item.UsuarioID + ')" class="btn btn-danger btn-xs" role="button">Excluir</a></li>' : '';
        html += item.Status == 5 || item.Status == 9 ? '<li class=\"btnModerador btnExcluirRestaurar\"><a href="javascript:;" onclick="RestoreMessage(' + item.TopicoID + ', true, 1, ' + item.UsuarioID + ')" class="btn btn-danger btn-xs" role="button">Restaurar</a></li>' : '';
        html += item.Status == 1 ? '<li class=\"btnModerador\ btnTrancar"><a href="javascript:;" onclick="CloseMessage(' + item.TopicoID + ')" class="btn btn-danger btn-xs" role="button">Trancar</a></li>' : '';
        html += '        <li class=\"btnModerador\"">';
        html += '            <div class="dropdown">';
        html += '                <button class="btn btn-danger btn-xs dropdown-toggle" type="button" id="dropdownAreas" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" onclick="Linkar(' + item.TopicoID + ', 0)">';
        html += '                    Mover';
        html += '                      <span class="caret"></span>';
        html += '                </button>';
        html += '                <ul class="dropdown-menu" aria-labelledby="dropdownAreas" id="topico_' + item.TopicoID + '_linkar">';
        html += '                </ul>';
        html += '            </div>';
        html += '        </li>';
        html += '        <li class=\"btnModerador\"><a href="javascript:;" class="btn btn-warning btn-xs" role="button" onClick="EditarMensagem(' + item.TopicoID + ', ' + item.TopicoID + ', true,' + IsAdmin + ')">Editar</a></li>';
        html += '        <li class=\"btnModerador\"><a href="javascript:;" class="btn btn-default btn-xs" role="button" onClick="converterParaDepoimento(' + item.TopicoID + ', true, ' + item.UsuarioID + ', \'' + $.toDate(item.Data, false, true, false) +'\')">Depoimento</a></li>';
    } else {
        html += item.IsEditable ? '        <li class=\"btnModerador\"><a href="javascript:;" class="btn btn-warning btn-xs" role="button" onClick="EditarMensagem(' + item.TopicoID + ', ' + item.TopicoID + ', true,' + IsAdmin + ')">Editar</a></li>' : '';
    }

    html += '    </ul>';

    $("#topicoControles_" + item.TopicoID).append(html);
}

function topicoSocial(item, IsAdmin, IsModerador) {
    var html = '';



    if (item.UsuarioID == 2600) {
        html += '   <div class="col-md-12">';
        html += '       <div class="dropdown pull-left">';
        html += '           <a data-toggle="dropdown" class="btn btn-default dropdown-toggle share btn-responsive" id="btn-compartilhar" title="Compartilhar">';
        html += '           <i class="fa fa-share-alt"></i>';
        html += '           <span class="caret"></span>';
        html += '           </a>';
        html += '           <ul class="dropdown-menu mobile-social-share pull-right">';
        html += Social(item.Link, item.Titulo, item.TopicoID, item.UsuarioID, item.Login);
        html += '           </ul>';
        html += '       </div>';
        html += '   </div>';
    } else {
        html += '   <div class="col-md-12">';
        html += '       <div class="btn-group pull-left" role="group" aria-label="..." style="margin-bottom:5px">';
        html += '           <a href="javascript:;" id="curtiu_' + item.TopicoID +'"  title="Gostei" class="btn btn-default ' + (item.Gostei ? 'btn-ja-gostei' : '') + '" role="button" onclick="Votar(' + item.TopicoID + ', true, true, ' + item.TotalGostei + ')"><i class="fa fa-thumbs-up"></i> </a>';
        html += '                <a href="#curtiramTopico" title="Quem curtiu?" class="btn btn-default " onClick="modalCurtidas(' + item.TopicoID + ', true)" id="qtdCurtiram_' + item.TopicoID + '" role="button" data-toggle="modal" data-target="#curtiramTopico">' + item.TotalGostei + '</a>';
        html += '                <a href="javascript:;" id="naoCurtiu_' + item.TopicoID +'" class="btn btn-default ' + (item.NaoGostei ? 'btn-ja-naogostei' : '') + '" role="button" onclick="Votar(' + item.TopicoID + ', true, false, ' + item.TotalNaoGostei + ')"><i class="fa fa-thumbs-down" title="Não gostei"></i></a>';
        html += '                <a href="javascriot:;" class="btn btn-default no-cursor" id="qtdNaoCurtiram_' + item.TopicoID + '" role="button">' + item.TotalNaoGostei + '</a>';
        html += '       </div>';
        html += '       <div class="dropdown pull-left" style="margin-bottom:5px">';
        html += '           <a data-toggle="dropdown" class="btn btn-default dropdown-toggle share btn-responsive tooltipActive" id="btn-compartilhar" title="Compartilhar">';
        html += '           <i class="fa fa-share-alt"></i>';
        html += '           <span class="caret"></span>';
        html += '           </a>';
        html += '           <ul class="dropdown-menu mobile-social-share pull-right">';
        html += Social(item.Link, item.Titulo, item.TopicoID, item.UsuarioID, item.Login);
        html += '           </ul>';
        html += '       </div>';

        html += '       <div class="btn-group pull-left" role="group" aria-label="..." style="margin-bottom:5px">';

        if (item.QtdRespostas != 0) {
            html += '       <a title="Ir para o primeiro comentário"  id="btn_comentariosDOWN_' + item.TopicoID + '" class="btn btn-warning pull-left btn-comments btn_comentarios__' + item.TopicoID + ' " onclick="topicoDiscussao(' + item.TopicoID + ',' + item.Status + ',' + IsAdmin + ',' + IsModerador + ')" data-toggle="collapse" href="#topico_' + item.TopicoID + '_discussao" aria-expanded="false" aria-controls="topico_' + item.TopicoID + '_discussao" role="button"><i class="fa fa-comments"></i><i class="fa fa-chevron-up"></i></a>';
            html += '       <a title="Ir para o último comentário" id="btn_comentariosUP_' + item.TopicoID + '" class="btn btn-warning pull-left btn-comments btn_comentarios__' + item.TopicoID + ' " data-toggle="collapse" href="#topico_' + item.TopicoID + '_discussao" aria-expanded="false" aria-controls="topico_' + item.TopicoID + '_discussao" role="button"><i class="fa fa-comments "></i><i class="fa fa-chevron-down"></i></a>';
        } else {
            html += '       <a title="Ir para o primeiro comentário"  id="btn_comentariosDOWN_' + item.TopicoID + '" class="btn btn-warning pull-left btn-comments btn_comentarios__' + item.TopicoID + ' " onclick="topicoDiscussao(' + item.TopicoID + ',' + item.Status + ',' + IsAdmin + ',' + IsModerador + ')" data-toggle="collapse" href="#topico_' + item.TopicoID + '_discussao" aria-expanded="false" aria-controls="topico_' + item.TopicoID + '_discussao" role="button"><i class="fa fa-comments"></i><i class="fa fa-chevron-up"></i></a>';
            html += '       <a title="Ir para o último comentário"  id="btn_comentariosUP_' + item.TopicoID + '" class="btn btn-warning pull-left btn-comments btn_comentarios__' + item.TopicoID + ' " data-toggle="collapse" href="#topico_' + item.TopicoID + '_discussao" aria-expanded="false" aria-controls="topico_' + item.TopicoID + '_discussao" role="button"><i class="fa fa-comments "></i><i class="fa fa-chevron-down"></i></a>';
        }


        html += '           <a title="Comentar" href="javascript:;" class="btn btn-warning btn-comments" onclick="addResposta(' + item.TopicoID + ',' + IsAdmin + ',' + IsModerador + ',' + item.Status + ')"><span class="hidden-xs">Responder tópico </span><i class="fa fa-reply"></i> <span class="qtdRespostas_' + item.TopicoID + '"> ' + item.QtdRespostas + '</span></a>'
        html += '       </div>';
        html += '   </div>';
    }

    $("#topicoSocial_" + item.TopicoID).append(html);

    $('#btn_comentariosUP_' + item.TopicoID).click(function () {
        rolarTela.setStatus('');
        if(!$('#topico_' + item.TopicoID + '_discussao').is(":visible"))
            topicoDiscussao(item.TopicoID, item.Status, IsAdmin, IsModerador,false,true);
    });

    $('#topico_' + item.TopicoID + '_discussao').on("hide.bs.collapse", function () {
        $('#topico_' + item.TopicoID + '_discussao').unbind("shown.bs.collapse");
        $('html, body').stop().animate({
            scrollTop: $('#topico_' + item.TopicoID).offset().top
        }, 1500, 'easeInOutExpo');
    });

    //inicializa tooltips
    $('[data-toggle="tooltip"], .tooltipActive').tooltip();


}


function Votar(id, isTopic, gostei) {
    ValidateSession(function (isValid) {
        if (isValid) {
            ajaxProxy('/WsForum', 'Votar', JSON.stringify({id: id, isTopic: isTopic, gostei: gostei}),
                function (result) {
                    if (result.Error) {
                        toastr.error(result.Error);
                    }
                    else {

                        if (gostei) {
                            if (id != null) {
                                $("#qtdCurtiram_" + id).html(result.QtdGostei);
                                $("#qtdNaoCurtiram_" + id).html(result.QtdNGostei);

                                $('#curtiu_' + id).toggleClass('btn-ja-gostei');
                                $('#naoCurtiu_' + id).removeClass('btn-ja-naogostei');

                            } else {
                                $("#qtdCurtiram_" + respostaID).html(result.QtdGostei);
                                $("#qtdNaoCurtiram_" + respostaID).html(result.QtdNGostei);

                                $('#curtiu_' + respostaID).toggleClass('btn-ja-gostei');
                                $('#naoCurtiu_' + respostaID).removeClass('btn-ja-naogostei');

                            }
                        } else {
                            if (id != null) {
                                $("#qtdCurtiram_" + id).html(result.QtdGostei);
                                $("#qtdNaoCurtiram_" + id).html(result.QtdNGostei);

                                $('#naoCurtiu_' + id).toggleClass('btn-ja-naogostei');
                                $("#curtiu_" + id).removeClass('btn-ja-gostei');
                            } else {
                                $("#qtdCurtiram_" + respostaID).html(result.QtdGostei);
                                $("#qtdNaoCurtiram_" + respostaID).html(result.QtdNGostei);

                                $('#naoCurtiu_' + respostaID).toggleClass('btn-ja-naogostei');
                                $("#curtiu_" + respostaID).removeClass('btn-ja-gostei');
                            }
                        }

                    }
                }
            );
        }
    }, 'votar na mensagem');
}

function ValidateSession(callback, message) {
    isAuthenticated(function (result) {
        if (!result) {
            var html = '';
            html += '<div class="form-group">'
            html += '   <label class="sr-only" for="modalLogin">Login</label>';
            html += '   <input type="text" class="form-control" id="modalLogin" placeholder="Login" required="">';
            html += '</div>';
            html += '<div class="form-group">';
            html += '   <label class="sr-only" for="modalPassword">Senha</label>';
            html += '   <input type="password" class="form-control" id="modalPassword" placeholder="Senha" required="">';
            html += '   <div class="help-block text-right"><strong><a href="javascript:;" onclick="$(\'.modal.in\').modal(\'hide\');$.scrollTo(\'#cadastro-rodape\')">Cadastre-se!</a></strong>&nbsp;&nbsp;<a href="/Mercado/EsqueciSenha.aspx">Esqueceu sua senha?</a></div>';
            html += '</div>';

            bootbox.dialog({
                title: 'Login necessário',
                message: html,
                buttons: {
                    cancel: {
                        label: "Cancelar",
                        className: 'btn-danger'
                    },
                    ok: {
                        label: "Entrar",
                        className: 'btn-primary',
                        callback: function () {
                            ajaxProxy('WsUsuario', 'Login', JSON.stringify({ login: $('#modalLogin').val(), password: $('#modalPassword').val() }),
                                function (loginresult) {
                                    if (loginresult.Error) {
                                        toastr.error(loginresult.Error);
                                    } else {
                                        if (loginresult.Return) {
                                            toastr.warning(loginresult.Return);

                                            ValidateSession(function () { callback(true) }, '');
                                        } else {
                                            isAuthenticated(function () { callback(true) });
                                        }
                                    }
                                });
                        }
                    }
                }
            }).on("shown.bs.modal", function (e) {
                $('#modalPassword').on('keydown', function (e) {
                    if (e.which == 13) {
                        $('div.bootbox button[data-bb-handler="ok"]').click();
                        e.preventDefault();
                    }
                });
            });
        }
        else {
            callback(result);
        }
    });
}

function mensagemFeedback(isTopic, ID, tipo, mensagem) {
    var html = '';

    html += '       <div class="alert alert-' + tipo + '" style="display:none">';
    html += '           <button type="button" class="close" data-dismiss="alert">x</button>';
    html += '           <strong>' + mensagem + '</strong>';
    html += '       </div>';

    if (isTopic) {
        $("#topicoAlertas_" + ID + " .col-md-12").html(html);
        $("#topicoAlertas_" + ID + " .col-md-12 .alert").fadeTo(4000, 500).slideUp(500, function () {
            $(".alert").slideUp(500);
        });
    } else {
        $("#respostaAlertas_" + ID + " .col-md-12").html(html);
        $("#respostaAlertas_" + ID + " .col-md-12 .alert").fadeTo(4000, 500).slideUp(500, function () {
            $(".alert").slideUp(500);
        });
    }

};

function modalCurtidas(ID, IsTopic) {
    var html = '';
    var json = '';
    var service = '';
    if (IsTopic) {
        json = JSON.stringify({ TopicoID: ID });
        service = 'GetTopicoVotos';
    } else {
        json = JSON.stringify({ RespostaID: ID });
        service = 'GetRespostaVotos';
    }

    ajaxProxy('/WsForum', service, json,
        function (result) {
            if (result.Error) {
                $.facebox(result.Error);
            }
            else {
                for (var i in result.VotosDetalhe) {
                    var item = result.VotosDetalhe[i];
                    html += '<div class="media">';
                    html += '    <div class="media-left">';
                    html += '        <a href="/mercado/perfil.aspx?ID=' + item.UsuarioID + '">';
                    html += '            <img class="media-object img-rounded img-thumbnail" src="' + item.Avatar + '" alt="Conheça o perfil do ' + item.Login + '">';
                    html += '        </a>';
                    html += '   </div>';
                    html += '   <div class="media-body">';
                    html += '       <h4 class="media-heading"><a href="/mercado/perfil.aspx?ID=' + item.UsuarioID + '" title="Conheça o perfil do ' + item.Login + '">' + item.Login + '</a></h4>';
                    if (item.TipoUsuario != "Usuario")
                        html += '       <span class="btn btn-primary btn-xs btn-amigo" role="button">Amigo da Bastter.com</span>';
                    //html += '       <a href="#" class="btn btn-link btn-xs" role="button" title="Seguir este amigo">Enviar mensagem</a>';
                    //html += '       <p>1000 seguidores</p>';
                    html += '   </div>';
                    html += '</div>';
                }
                $(".modal-curtidas").html(html);
            }
        }
    );
}

function Social(link, titulo, mensagemID, usuarioID, login) {
    var html = '';
    link = 'http://www.bastter.com/Mercado/Forum/' + mensagemID + '/' + link + '.aspx';
    var isTopico = titulo != '';
    var emailbody = 'Mensagem do Forum [a href=http://www.bastter.com/Mercado/Forum/]Bastter.com[/a][br /][br /]' + escape(titulo) + '[br /][a href=' + link + ']' + link + '[/a][br /][br /]Participe do [a href=http://www.bastter.com/Mercado/Forum/]Forum de Mercado Bastter.com[/a].';

    if (usuarioID != 2600) {
        html += '               <li>';
        html += '                   <a data-original-title="Mensagens do Forense" href="javascript:;" onclick="GetMessagesByUser(\'1\',\'' + usuarioID + '\',\'' + login + '\')" title="Ver mensagens deste forense"  class="btn btn-forense sharer button" data-placement="left">';
        html += '                       <i class="fa fa-user"></i>';
        html += '                   </a>';
        html += '               </li>';

        if (isTopico) {
            html += '               <li>';
            html += '                   <a data-original-title="Mensagens do Forense" onclick="AdicionarFavorito(' + mensagemID + ')" title="Salvar tópico como favorito"  class="btn btn-favorito sharer button" data-placement="left">';
            html += '                       <i class="fa fa-star"></i>';
            html += '                   </a>';
            html += '               </li>';
        }
    }

    var urlEnviar = '/mercado/Controls/EnviarSocial.aspx?tipo=';
    if (isTopico) {

        html += '               <li>';
        html += '                   <a data-original-title="Facebook" href="' + urlEnviar + 'facebook&link=' + link + '&texto=' + titulo + '... " title="Compartilhar no Facebook" target="_blank" data-sharer="facebook" data-url="http://localhost/bastter/index.html#bloco-posts-forum" class="btn btn-facebook sharer button" data-placement="left">';
        html += '                       <i class="fa fa-facebook"></i>';
        html += '                   </a>';
        html += '               </li>';
        html += '               <li>';
        html += '                   <a data-original-title="Whatsapp" href="' + urlEnviar + 'whatsapp&link=' + link + '" title="Compartilhar no Whatsapp" target="_blank" data-sharer="whatsapp" data-url="http://localhost/bastter/index.html#bloco-posts-forum" class="btn btn-whatsapp sharer button" data-placement="left">';
        html += '                       <i class="fa fa-whatsapp"></i>';
        html += '                   </a>';
        html += '               </li>';
        html += '               <li>';
        html += '                   <a data-original-title="Twitter" href="' + urlEnviar + 'twitter&link=' + link + '&texto=' + titulo + '... " title="Compartilhar no Twitter" target="_blank" data-sharer="twitter" data-url="http://localhost/bastter/index.html#bloco-posts-forum" class="btn btn-twitter sharer button" data-placement="left">';
        html += '                       <i class="fa fa-twitter"></i>';
        html += '                   </a>';
        html += '               </li>';
        html += '               <li>';
        html += '                   <a data-original-title="Google+" href="' + urlEnviar + 'google&link=' + link + '&texto=' + titulo + '... " title="Compartilhar no Google+" target="_blank" data-sharer="googleplus" data-url="http://localhost/bastter/index.html#bloco-posts-forum" class="btn btn-google sharer button" data-placement="left">';
        html += '                       <i class="fa fa-google-plus"></i>';
        html += '                   </a>';
        html += '               </li>';
        //Não implementamos linkedin
        //html += '               <li>';
        //html += '                   <a data-original-title="LinkedIn" href="#" data-sharer="linkedin" data-url="http://localhost/bastter/index.html#bloco-posts-forum" class="btn btn-linkedin sharer button" data-placement="left">';
        //html += '                       <i class="fa fa-linkedin"></i>';
        //html += '                   </a>';
        //html += '               </li>';
        html += '               <li>';
        html += '                   <a data-original-title="Email" href="javascript:;" onclick="ShareByEmail(\'\',\'' + emailbody + '\')" title="Enviar por email" data-sharer="email" data-subject="Título do tópico" data-to="Digite o e-mail" data-title="Hey, vá lá na Bastter.com para ler este conteúdo!" data-url="http://localhost/bastter/index.html#bloco-posts-forum" class="btn btn-mail sharer button" data-placement="left">';
        html += '                       <i class="fa fa-envelope"></i>';
        html += '                   </a>';
        html += '               </li>';

        return html;
    }

}

function ShareByEmail(to, content) {
    $.get('../Controls/EnviarEmail.aspx', { titulo: 'Compartilhar por email', destinatario: to, texto: content.replace(/Mercado\/Forum/g, 'Mercado-Forum') }, function (data) {
        $.facebox(data);
        $('#btnEnviar').unbind("click").click(function () { SendEmail(); $(document).trigger('close.facebox'); });
    });
}

function AdicionarFavorito(topicoID, obj) {
    ValidateSession(function (isValid) {
        if (isValid) {
            ajaxProxy('/WsForum', 'AdicionarFavorito', JSON.stringify({ topicoID: topicoID }),
                function (result) {
                    if (result.Error) {
                        toastr.error(result.Error);
                    }
                    else {
                        var $favIcon = $(obj).find('i');
                        if ($favIcon.hasClass('fa-star-o')) {
                            $favIcon.removeClass('fa-star-o').addClass('fa-star');
                        } else {
                            $favIcon.removeClass('fa-star').addClass('fa-star-o');
                        }
                    }

                }
            );
        }
    }, 'adicionar favorito');
}

function Notificar(grupoID, topicoID, notificar) {
    ValidateSession(function (isValid) {
        if (isValid) {
            ajaxProxy('/WS_Grupos', 'NotificacaoGranular', '{ grupoID: ' + grupoID + ', topicoID: ' + topicoID + ', notificar:' + notificar + '}',
                function (result) {
                    var tipo = grupoID != null ? 'grupo' : 'tópico';

                    if (notificar) {
                        $('#opcoes-topico-' + topicoID + ' .simNotificar').remove();
                        if ($('#opcoes-topico-' + topicoID + ' .naoNotificar').length < 1)
                            $('#opcoes-topico-' + topicoID).prepend('<li class="naoNotificar"><a href="javascript:;" onclick="Notificar(' + null + ',' + topicoID + ',false)" title="Ser notificado" data-toggle="tooltip"><i class="fa fa-bell"></i></a></li>');                        
                    } else {
                        $('#opcoes-topico-' + topicoID + ' .naoNotificar').remove();
                        if ($('#opcoes-topico-' + topicoID + ' .simNotificar').length < 1)
                            $('#opcoes-topico-' + topicoID).prepend('<li class="simNotificar"><a href="javascript:;" onclick="Notificar(' + null + ',' + topicoID + ',true)" title="Não ser notificado" data-toggle="tooltip"><i class="fa fa-bell-slash"></i></a></li>');
                    }
                    //inicializa tooltips
                    $('[data-toggle="tooltip"], .tooltipActive').tooltip();
                    toastr.success((notificar ? 'Você será notificado sobre este ' + tipo + '.' : 'Você não será mais notificado sobre este ' + tipo + '.'));
                }
            );
        }
    }, 'deixar de seguir.');
}


function topicoDiscussao(topicoID, topicoStatus, IsAdmin, IsModerador, novaResposta, ultimoComentario, ultimaRespostaVista) {
    /*if ($("#topico_" + topicoID + "_discussao.collapse.in").length > 0 && resposta) {
        $('html, body').stop().animate({
            scrollTop: $('#topico_'+topicoID).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
        return;
    }*/

    $('#topico_' + topicoID + '_discussao').collapse('show');

    var html = '';

    html += '<div class="row" style="margin-bottom:20px">';
    html += '<div class="col-md-12">';
    html += '   <hr id="bloco-topico-inicio-' + topicoID + '" class="invisivel">';
    html += '       <div class="col-md-12 col-xs-12">';
    html += '           <h3 style="margin-top:5px;margin-bottom:0px">Comentários</h3>';
    html += '       </div>';
    html += '       <div class="col-md-12 col-xs-12">';
    html += '           <span class="pull-right" style="margin-right:10px"><a href="javascript:;" data-ultima-resposta=".topico_' + topicoID + '_resposta" class="page-scroll ultima-resposta btn btn-default btn-xs">Último comentário <i class="fa fa-arrow-circle-down"></i></a></span>';
    html += '       </div>';
    html += '    <div class="col-md-12 col-xs-12 progress" id="loading_comentarios_' + topicoID + '">';
    html += '       <div class="progress-bar progress-bar-striped active" role = "progressbar" aria - valuenow="100" aria - valuemin="0" aria - valuemax="100" style = "width: 100%">';
    html += '           <span>Carregando comentários ...</span>';
    html += '       </div >';
    html += '   </div >';
    html += '</div>';
    html += '</div>';



    //altera a class do botão de comments para loading
    $('.btn_comentarios_' + topicoID + ' i').attr("class", "fa fa-circle-o-notch fa-spin");
    //Exibe loading dos comentários
    $('#loading_comentarios_' + topicoID + '').show();


    ajaxProxy('/WsForum', 'GetTopicoRespostas', JSON.stringify({ topicoID: topicoID, ordem: 2 }),
        function (result) {
            if (result.Error) {
                toastr.error(result.Error);
            }
            else {

                var qtdRespostas = 0;
                result.Respostas.forEach(function (r) {
                    if (r.Status == 1)
                        qtdRespostas++;
                })
                $('span.qtdRespostas_' + topicoID).text(qtdRespostas);

                if (qtdRespostas == 0) {
                    $("#topico_" + topicoID + "_discussao").html(html);
                    $('#loading_comentarios_' + topicoID + '').html("Nenhum comentário feito ainda. Seja o primeiro a comentar!");
                    $('#loading_comentarios_' + topicoID + '').show();
                    return;
                }

                html += '<div class="row list-comentarios">';
                for (var i in result.Respostas) {
                    var resposta = result.Respostas[i];

                    html += '       <div id="topico_resposta_' + resposta.ID + '" class="col-sm-12 topico_' + resposta.TopicoID + '_resposta ' + (resposta.Status == 5 ? 'resposta-deletado' : '') + '" >';
                    html += '           <div class="panel panel-default comentario">';
                    html += '               <div class="panel-heading">';
                    html += '                   <div class="media">';
                    html += '                       <div class="media-left">';
                    html += '                           <a href="/mercado/Perfil.aspx?ID=' + resposta.UsuarioID + '">';
                    html += '                           <a id="profilePopup_' + resposta.ID + '" onMouseOver="getUserProfilePic(\'#profilePopup_' + resposta.ID + '\',' + resposta.UsuarioID + ', \'' + resposta.Avatar + '\', \'' + resposta.Login + '\',' + IsAdmin + ', \'' + resposta.IP + '\')" title="Ver perfil" tabindex="0" class="pop avatar img-circle" role="button" data-toggle="popover" data-trigger="hover" title="" data-html="true" data-placement="right" data-content="Carregando.."><img src="' + resposta.Avatar + '" class="img-responsive user-photo" alt="' + resposta.Login + '"></a>';
                    html += '                           </a>';
                    html += '                       </div>';
                    html += '                       <div class="media-body">';
                    html += resposta.TipoUsuario != "Usuario" ? '<a href="/mercado/loja/assinaturas.aspx" data-toggle="tooltip" class="pull-right" title="Amigo da Bastter.com Torne-se um também!"><img class="img-responsive" src="images/badge-amigo-bastter-p.png" style="width:47px" alt="' + resposta.Login + '"></a>' : '';
                    html += resposta.Ressucitado ? '<img class="topico-resucitado img-responsive pull-right" data-toggle="tooltip" title="Ressuscitou o tópico :-)" src="/mercado/images/topico-ressucitado.png" width="75">' : '';
                    html += '                           <a class="profileLink pop ' + (resposta.TipoUsuario == 'Usuario' ? 'naoAssinante': '') + '" onMouseOver="$(\'#profilePopup_' + resposta.ID + '\').mouseover();" href="/Mercado/Perfil.aspx?ID=' + resposta.UsuarioID + '">' + resposta.Login + '</a><br/>';
                    html += '                           <small class="text-muted">em ' + resposta.Data + '</small>';
                    html += '                       </div>';
                    html += '                   </div>';
                    html += '               </div>';
                    html += '               <div class="panel-body">';
                    html += '                   <div class="row">';
                    html += '                       <div class="col-md-12 margin-bottom">';
                    html += '                           <div id="resposta_conteudo_' + resposta.ID + '"  class="resposta-conteudo">' + resposta.Texto + '</div>';
                    html += resposta.Imagem != '' && resposta.Imagem != null ? '  <img src="/mercado/arquivos/grupo/' + resposta.Imagem + '" alt="Clique para exibir a imagem" style="max-width:100%"/>' : '';
                    html += '                       </div>';
                    html += '                   </div>';
                    html += '                   <div class="row" id="respostaControles_' + resposta.ID + '">';
                    html += respostaControles(resposta, IsAdmin, IsModerador);
                    html += '                   </div > ';
                    html += '                   <div class="row" id="resposta_text_' + resposta.ID + '">';
                    html += '                   </div>';
                    html += '                   <div class="row" id="respostaAlertas_' + resposta.ID + '">';
                    html += '                       <div class="col-md-12">';
                    html += '                       </div>';
                    html += '                   </div>';
                    html += '               </div>';
                    html += '           </div>';
                    html += '       </div>';


                    $


                }
                html += '</div>';
                //habilita resposta ao tópico caso este ainda esteja aberto (status == 1)


                html += '   </div>';
                html += '</div>';

                if (topicoID != undefined) {
                    html += '<div class="col-sm-12" id="bloco-topico-fim-' + topicoID + '">';
                    html += '   <p class="text-right">';
                    html += '       <strnong><a href="#bloco-topico-inicio-' + topicoID + '" class="page-scroll btn btn-default btn-xs">Voltar ao início dos comentários <i class="fa fa-arrow-circle-up"></i></a>';
                    html += '       </strnong>';
                    html += '   </p>';
                    html += '   <p class="text-right small">';
                    html += '       Você está em <a href="' + $('#topico_' + topicoID + ' .panel-heading h4 a').attr("href") + '" title="Acessar tópico">' + $('#topico_' + topicoID + ' .panel-heading a > span').text() + ' > ' + $('#topico_' + topicoID + ' .panel-heading h4 a').text() + '</a>';
                    html += '       </br> por <a href="'+ $('#topico_' + topicoID + ' .panel-body .profileLink').attr("href") +'" title="Perfil">' + $('#topico_' + topicoID + ' .panel-body .profileLink').html() + '</a>' + $('#topico_' + topicoID + ' .panel-body .data-topico').html();
                    html += '   </p>';
                    html += '</div>';
                }

                $("#topico_" + topicoID + "_discussao").html(html);



                //if (tinymce.get('topico_' + topicoID + '_respostaTexto') != undefined) 
                //    tinymce.get('topico_' + topicoID + '_respostaTexto').destroy();

                //inicializarTMCE('#topico_' + topicoID + '_respostaTexto');



                /*//inicia emojis
                $("#topico_" + topicoID + "_discussao .emojis").emojioneArea({
                    standalone: false,
                    useInternalCDN: true,
                    search: false,
                    searchPlaceholder: "Pesquisar",
                    buttonTitle: "Use a tecla TAB para abrir os emojis",
                    filtersPosition: "bottom",
                    tones: false,
                    saveEmojisAs:'shortname',
                    filters: {
                        recent: true, // disable recent
                        animals_nature: {
                            title: 'Animais',
                            icon: 'dog'
                        },
                        smileys_people: {
                            title: 'Carinhas e Pessoas'
                        },
                        food_drink: {
                            title: 'Comidas e Bebidas'
                        },
                        activity: {
                            title: 'Atividades e Exercícios',
                            icon: 'person_biking'
                        },
                        travel_places: {
                            title: 'Viagens e Lugares',
                            icon: 'airplane'
                        },
                        objects: false, // disable objects filter
                        symbols: false, // disable symbols filter
                        flags: false // disable flags filter
                    }
                });
            */

                //busca emojis nas respostas
                /*
                $('.resposta-conteudo').each(function () {
                    var texto = $(this).html();
                    $(this).html(emojione.shortnameToImage(texto));
                });
                */

                //jQuery for page scrolling feature - requires jQuery Easing plugin
                $(function () {
                    $('a.page-scroll.ultima-resposta').bind('click', function (event) {
                        var $anchor = $(this);
                        $('html, body').stop().animate({
                            scrollTop: $($anchor.attr('data-ultima-resposta')).last().offset().top
                        }, 1500, 'easeInOutExpo');
                    });

                    //jQuery for page scrolling feature - requires jQuery Easing plugin
                    $(function () {
                        $('a.page-scroll').not('.ultima-resposta').bind('click', function (event) {
                            var $anchor = $(this);
                            $('html, body').stop().animate({
                                scrollTop: $($anchor.attr('href')).offset().top
                            }, 1500, 'easeInOutExpo');
                        });
                    });
                });

                //configura imgens para abrir ampliadas no popup    
                if (!$.isMobile.any()) {

                    $('.resposta-conteudo img').each(function () {
                        imagemFullSize($(this));
                    });
                }

                $(".pop").popover({ trigger: "manual", html: true, animation: false })
                    .on("mouseenter", function () {
                        var _this = this;
                        $(this).popover("show");
                        $(".popover").on("mouseleave", function () {
                            $(_this).popover('hide');
                        });
                    }).on("mouseleave", function () {
                        var _this = this;
                        setTimeout(function () {
                            if (!$(".popover:hover").length) {
                                $(_this).popover("hide");
                            }
                        }, 300);
                    });

                //inicializa tooltips
                $('[data-toggle="tooltip"], .tooltipActive').tooltip();

                //remove o loading do botão de comentários
                $('.btn_comentarios_' + topicoID + ' i').attr("class", "fa fa-comments faa-shake animated");

                //esconde loading dos comentários
                $('#loading_comentarios_' + topicoID + '').hide();

                //rola a tela em caso de nova resposta
                if (novaResposta) {
                    var scrollElement = $('.topico_' + topicoID + '_resposta').last();
                    $('html, body').stop().animate({
                        scrollTop: scrollElement.offset().top
                    }, 1500, 'easeInOutExpo');
                    event.preventDefault();
                }

                if (ultimoComentario)
                    rolarTela.setStatus(topicoID);

                //altera badge de leitura do tópico
                $('#badge-comentarios-' + topicoID).addClass('visto').html('<i class="fa fa-check"></i>');


                //rola até o ultimo comentario ou primeiro de acordo com a ultima resposta vista
                if (ultimaRespostaVista != undefined) {
                    if (ultimaRespostaVista == 0) {
                        $('html, body').stop().animate({
                            scrollTop: $('.topico_' + topicoID + '_resposta:eq(0)').offset().top
                        }, 1500);
                    } else {
                        $('html, body').stop().animate({
                            scrollTop: $('#topico_resposta_' + ultimaRespostaVista).offset().top
                        }, 1500);
                    }
                }

                /*//define evento quando esconder comentarios
                $('#topico_' + topicoID + '_discussao').on("hide.bs.collapse", function () {
                    $('html, body').stop().animate({
                        scrollTop: $('#topico_' + topicoID).offset().top
                    }, 1500, 'easeInOutExpo');
                    event.preventDefault();
                });

                $('#topico_' + topicoID + '_discussao').on("shown.bs.collapse", function () {
                    $('html, body').stop().animate({
                        scrollTop: $('.topico_' + topicoID + '_resposta').last().offset().top
                    }, 1500, 'easeInOutExpo');
                    event.preventDefault();
                });
                */

            }
        });
};

function respostaControles(item, IsAdmin, IsModerador) {
    var html = '';

    if (item.UsuarioID == 2600)
        return;

    html += '    <ul class="col-md-6 list-inline list-unstyled topicoControles">';

    if (IsAdmin || IsModerador) {
        html += item.Status == 1 ? '<li class=\"btnModerador btnExcluirRestaurar\"><a href="javascript:;" onclick="DeleteMessage(' + item.ID + ', false, ' + item.UsuarioID + ')" class="btn btn-danger btn-xs" role="button">Excluir</a></li>' : '';
        html += item.Status == 5 || item.Status == 9 ? '<li class=\"btnModerador btnExcluirRestaurar\"><a href="javascript:;" onclick="RestoreMessage(' + item.ID + ', false, 1, ' + item.UsuarioID + ')" class="btn btn-danger btn-xs" role="button">Restaurar</a></li>' : '';
        html += '<li class=\"btnModerador\"><a href="javascript:;" class="btn btn-warning btn-xs" role="button" onClick="EditarMensagem(' + item.ID + ', ' + item.TopicoID + ', false,' + IsAdmin + ')">Editar</a></li>';
        html += '<li class=\"btnModerador\"><a href="javascript:;" class="btn btn-default btn-xs" role="button" onClick="converterParaDepoimento(' + item.ID + ', false, ' + item.UsuarioID + ', \'' + item.Data + '\')">Depoimento</a></li>';
    } else {
        html += item.IsEditable ? '        <li class=\"btnModerador\"><a href="javascript:;" class="btn btn-warning btn-xs" role="button" onClick="EditarMensagem(' + item.ID + ', ' + item.TopicoID + ', false,' + IsAdmin + ')">Editar</a></li>' : '';
    }
    html += '    </ul>';
    html += '   <div class="btn-group col-md-6 pull-left" role="group" aria-label="...">';
    html += '       <div class="btn-group pull-right" role="group">';
    html += '           <a href="javascript:;" id="curtiu_'+item.ID+'" class="btn btn-default ' + (item.Gostei ? 'btn-ja-gostei' : '') + '" role="button" onclick="Votar(' + item.ID + ', false, true)" title="Gostei"><i class="fa fa-thumbs-up"></i> </a>';
    html += '           <a href="#curtiramTopico" title="' + item.TotalGostei + ' usuários gostaram desta resposta" class="btn btn-default " onClick="modalCurtidas(' + item.ID + ',false)" id="qtdCurtiram_' + item.ID + '" role="button" data-toggle="modal" data-target="#curtiramTopico">' + item.TotalGostei + '</a>';
    html += '           <a href="javascript:;" id="naoCurtiu_' + item.ID +'" class="btn btn-default ' + (item.NaoGostei ? 'btn-ja-naogostei' : '') + '" role="button" onclick="Votar(' + item.ID + ', false, false)" title="Não gostei"><i class="fa fa-thumbs-down" ></i></a>';
    html += '           <a href="javascript:;" title="' + item.TotalNaoGostei + ' usuários náo gostaram desta resposta" class="btn btn-default" id="qtdNaoCurtiram_' + item.ID + '" role="button">' + item.TotalNaoGostei + '</a>';

    html += '       </div>';
    html += '   </div>';

    return html;
}



function addResposta(topicoID, IsAdmin, IsModerador,status) {
    if (status != 1) {
        toastr.warning("Tópico fechado");
        return;
    }

    html = '';

    html += '        <div class="col-md-12 col-xs-12 margin-top">';

    html += '           <div id="editor_' + topicoID + '">';
    html += '               <div class="editable" id="topico_' + topicoID + '_respostaTexto"></div>';
    html += '           </div>';


    //html += '            <textarea id="topico_' + topicoID + '_respostaTexto" class="form-control emojis" placeholder="Responder ao tópico"></textarea>';
    html += '        </div>';
    html += '        <div class="col-md-2 col-xs-12 margin-top">';
    html += '            <button id="btnResponderTopico_' + topicoID + '" type="button" onClick="ResponderTopico(' + topicoID + ', true,' + IsAdmin + ', ' + IsModerador + ',{id: 0, idTopic: ' + topicoID + '}, false, \'socio\');" class="btn btn-default btn-primary btn-block loading" data-loading-text="Enviando">Enviar</button>';
    html += '        </div>';


    $('#topico_' + topicoID + '_comentarioBox').html(html);

    if (tinymce.get('topico_' + topicoID + '_respostaTexto') != undefined)
        tinymce.get('topico_' + topicoID + '_respostaTexto').destroy();

    $('html, body').stop().animate({
        scrollTop: $('#topico_' + topicoID + '_respostaTexto').offset().top - 200
    }, 1500, 'easeInOutExpo');


    inicializarTMCE('#topico_' + topicoID + '_respostaTexto', '#editor_' + topicoID);
    dirtyPush();

}

function ResponderTopico(id, IsTopico, IsAdmin, IsModerador, currentMessage, isEdit) {
    ValidateSession(function (isValid) {
        var text;
        var title;
        if (isValid) {
            if (IsTopico) {
                //title = $.jsonText($('#topico_' + id + '_topicoTitulo').val());
                text = $.jsonText(tinymce.get('topico_' + id + '_respostaTexto').getContent());
            }
            else
                text = $.jsonText(tinymce.get('resposta_' + id + '_respostaTexto').getContent());
            //var image = $("#ImageContainer img:eq(0)").attr('src') == undefined ? '' : $("#ImageContainer img:eq(0)").attr('src');
            var image = "";
            if ((text == '' || text == '<span style="color: #a9a9a9;">Digite sua mensagem</span>') && image == '') {
                mensagemFeedback(IsTopico, id, "danger", "Informe o texto da resposta.");
                return;
            }

            if (text.indexOf("base64") != -1 || text.indexOf("blob") != -1) {
                toastr.error('Atenção, ouve uma falha no upload de uma ou mais imegens do post. Remova as imagens e tente novamente.');
                return;
            }

            //altera a class do botão de enviar para loading
            $('#btnResponderTopico_' + currentMessage.idTopic).button("loading");

            //currentMessage = { 'id': '0', 'idTopic': topicoID };
            ajaxProxy('/WsForum', 'SaveResposta', JSON.stringify({ respostaID: currentMessage.id, topicoID: currentMessage.idTopic, texto: text, imagem: image }),
                function (result) {
                    if (result.Error) {
                        mensagemFeedback(IsTopico, id, "danger", result.Error);
                        //altera a class do botão de enviar para normal
                        $('#btnResponderTopico_' + currentMessage.idTopic).button("reset");
                    }
                    else {
                        //rolagem de tele caso seja uma nova resposta
                        if (!isEdit) {
                            topicoDiscussao(currentMessage.idTopic, 1, IsAdmin, IsModerador, true);
                        } else {
                            topicoDiscussao(currentMessage.idTopic, 1, IsAdmin, IsModerador, false);
                        }


                        //altera a class do botão de enviar para normal
                        $('#btnResponderTopico_' + currentMessage.idTopic).button("reset");

                        $("#topico_" + currentMessage.idTopic + "_comentarioBox").html("");

                        $('#topico_' + currentMessage.idTopic + '_discussao').collapse("show");

                        dirtyPop();
                    }
                }
            );
        }
    }, 'enviar mensagens.');
};

//O parametro ID e TopicoID serão iguais quando for a edição de um tópico
function EditarMensagem(id, TopicoID, isTopic, IsAdmin, IsModerador) {
    ValidateSession(function (isValid) {
        if (isValid) {
            //var jsonString = "{id: '" + id + "', topicoID: '" + TopicoID + "', isTopico: '" + isTopic + "'}";
            currentMessage = { id: id, topicoID: TopicoID, isTopico: isTopic };

            ajaxProxy('/WsForum', 'GetMensagemNovaHome', JSON.stringify(currentMessage),
                function (result) {
                    if (result.Error) {
                        mensagemFeedback(isTopic, id, 'warning', result.Error);
                    }
                    else {
                        dirtyPush();

                        if (result.texto.indexOf('selo-mensagem-premiada') > -1) {
                            mensagemFeedback(isTopic, id, 'warning', 'Esta mensagem não pode ser editada.');
                            return;
                        }

                        if (isTopic) {
                            var html = '';
                            html += '        <div class="col-md-12 col-xs-12 margin-top">';
                            html += '            <label for=""topico_' + id + '_topicoTítulo">Título</label>';
                            html += '            <input type="text" id="topico_' + id + '_topicoTítulo" class="form-control emojis" placeholder="Título do tópico" value="' + result.titulo + '">';
                            html += '        </div>';
                            html += '        <div class="col-md-12 col-xs-12 margin-top">';
                            html += '            <label for="topico_' + id + '_topicoTexto">Texto</label>';

                            html += '           <div id="editor_' + id + '">';
                            html += '               <div class="editable" id="topico_' + id + '_topicoTexto">' + result.texto + '</div>';
                            html += '           </div>';

                            //html += '            <textarea id="topico_' + id + '_topicoTexto" class="form-control emojis" placeholder="Escreva à vontade...">' + result.texto + '</textarea>';
                            html += '        </div>';
                            html += '        <div class="col-md-2 col-xs-12 margin-top">';
                            html += '            <button type="button" onClick="SaveTopic({id: ' + id + '}, true);" class="btn btn-default btn-primary loading" data-loading-text="Enviando">Salvar</button>';
                            html += '        </div>';

                            $('#conteudo-topico_' + id).html(html);

                            if (tinymce.get('topico_' + id + '_topicoTexto') != undefined)
                                tinymce.get('topico_' + id + '_topicoTexto').destroy();

                            inicializarTMCE('#topico_' + id + '_topicoTexto', '#editor_' + id);

                            //inicia emojis 
                            /*
                            $('#topico_' + id + '_topicoTexto').emojioneArea({
                                standalone: false,
                                useInternalCDN: true,
                                search: false,
                                searchPlaceholder: "Pesquisar",
                                buttonTitle: "Use a tecla TAB para abrir os emojis",
                                filtersPosition: "bottom",
                                tones: false,
                                saveEmojisAs: 'shortname',
                                filters: {
                                    recent: true, // disable recent
                                    animals_nature: {
                                        title: 'Animais',
                                        icon: 'dog'
                                    },
                                    smileys_people: {
                                        title: 'Carinhas e Pessoas'
                                    },
                                    food_drink: {
                                        title: 'Comidas e Bebidas'
                                    },
                                    activity: {
                                        title: 'Atividades e Exercícios',
                                        icon: 'person_biking'
                                    },
                                    travel_places: {
                                        title: 'Viagens e Lugares',
                                        icon: 'airplane'
                                    },
                                    objects: false, // disable objects filter
                                    symbols: false, // disable symbols filter
                                    flags: false // disable flags filter
                                }
                            });
                            */
                        } else {

                            var html = '';

                            html += '        <div class="col-md-12 col-xs-12 margin-top">';

                            html += '           <div id="editor_' + id + '">';
                            html += '               <div class="editable" id="resposta_' + id + '_respostaTexto">' + result.texto + '</div>';
                            html += '           </div>';

                            //html += '            <textarea id="resposta_' + id + '_respostaTexto" class="form-control emojis" placeholder="Editar resposta">' + result.texto + '</textarea>';
                            html += '        </div>';
                            html += '        <div class="col-md-2 col-xs-12 margin-top">';
                            html += '            <button type="button" onClick="ResponderTopico(' + id + ', ' + isTopic + ',' + IsAdmin + ', ' + IsModerador + ',{id: ' + id + ', idTopic: ' + TopicoID + '}, true, \'socio\');" class="btn btn-default btn-primary loading" data-loading-text="Enviando">Salvar</button>';
                            html += '        </div>';

                            $('#resposta_conteudo_' + id).html(html);

                            if (tinymce.get('resposta_' + id + '_respostaTexto') != undefined)
                                tinymce.get('resposta_' + id + '_respostaTexto').destroy();

                            inicializarTMCE('#resposta_' + id + '_respostaTexto', '#editor_' + id);

                            //inicia emojis 
                            /*
                            $('#resposta_' + id + '_respostaTexto').emojioneArea({
                                standalone: false,
                                useInternalCDN: true,
                                search: false,
                                searchPlaceholder: "Pesquisar",
                                buttonTitle: "Use a tecla TAB para abrir os emojis",
                                filtersPosition: "bottom",
                                tones: false,
                                saveEmojisAs: 'shortname',
                                filters: {
                                    recent: true, // disable recent
                                    animals_nature: {
                                        title: 'Animais',
                                        icon: 'dog'
                                    },
                                    smileys_people: {
                                        title: 'Carinhas e Pessoas'
                                    },
                                    food_drink: {
                                        title: 'Comidas e Bebidas'
                                    },
                                    activity: {
                                        title: 'Atividades e Exercícios',
                                        icon: 'person_biking'
                                    },
                                    travel_places: {
                                        title: 'Viagens e Lugares',
                                        icon: 'airplane'
                                    },
                                    objects: false, // disable objects filter
                                    symbols: false, // disable symbols filter
                                    flags: false // disable flags filter
                                }
                            });
                            */
                        }

                    }
                }
            );
        }
    }, 'editar mensagem');
}

function DeleteMessage(id, isTopic, usuarioID ,tipoMural) {
    ValidateSession(function (isValid) {
        if (isValid) {          
            var webService = '/WsForum';
            var method = 'DeleteMensagem';

            var dialog = bootbox.dialog({
                title: 'Deseja excluir esta mensagem?',
                message: '<label><input type="checkbox" checked="checked" onclick="$(\'.bootbox-body textarea\').toggle()"> Enviar recado</label><textarea id="motivo-exclusao" rows="3" cols="50" class="bootbox-input bootbox-input-textarea form-control">Sua mensagem foi excluída pois o conteúdo infringe as regras do site.\nhttps://bastter.com/mercado/regras.aspx</textarea>',
                closeButton: true,
                buttons: {
                    cancel: {
                        label: "Cancelar"
                    },
                    confirm: {
                        label: "Confirmar",
                        callback: function () {
                            var enviarRecado = $('.bootbox-body input[type=checkbox]').is(':checked') && usuarioID != undefined,
                                recado = {
                                    Texto: $.truncateText($.jsonText($('#motivo-exclusao').val(), 500)),
                                    Destinatario: { UsuarioID: usuarioID }
                                };

                            //tratamento para obter o webservice correto de acordo com o tipo do mural
                            if (tipoMural != undefined) {
                                webService = GetWebService(tipoMural, 'WsForum');
                            }


                            ajaxProxy(webService, method, JSON.stringify({ id: id, grupoID: null, isTopico: isTopic, isAdmin: true }),
                            function (result) {
                                if (result.Error) {
                                    alert(result.Error);
                                }
                                else {
                                    mensagemFeedback(isTopic, id, "success", result.Return);

                                    var item = $('#' + (isTopic ? 'topico_' : 'topico_resposta_') + id).addClass((isTopic ? 'topico' : 'resposta') + '-deletado');
                                    var botao = $('#' + (isTopic ? 'topicoControles_' : 'respostaControles_') + id + ' ul li.btnExcluirRestaurar').html('<a href="javascript:;" onclick="RestoreMessage(' + id + ', ' + isTopic + ', 1, ' + usuarioID + ',\'' + tipoMural + '\')" class="btn btn-danger btn-xs" role="button">Restaurar</a></li>');

                                    if (enviarRecado) {
                                        if ($.clearText($.trim(recado.Texto)) == '') {
                                            toastr.warning('Preencha o texto do recado.');
                                            return;
                                        }

                                        ajaxProxy('WsUsuario', 'SaveRecado', JSON.stringify({ recado: recado }),
                                            function (result) {
                                                if (result.Error) {
                                                    toastr.error(result.Error);
                                                }
                                                else {
                                                    toastr.success('Recado enviado!');
                                                }
                                            });
                                    }
                                }
                            });
                        }
                    }
                }
            });
        }
    }, 'deletar mensagem');
}

function RestoreMessage(id, isTopic, status, usuarioID, tipoMural) {
    ValidateSession(function (isValid) {
        if (isValid) {
            var webService = '/WsForum';
            var method = 'RestoreMensagem';

            bootbox.confirm("Deseja restaurar este item?", function (result) {
                if (result) {

                    //tratamento para obter o webservice correto de acordo com o tipo do mural
                    if (tipoMural != undefined) {
                        webService = GetWebService(tipoMural, 'WsForum');
                    }

                    ajaxProxy(webService, method, JSON.stringify({id: id , isTopico: isTopic}),
                        function (result) {
                            if (result.Error) {
                                alert(result.Error);
                            }
                            else {
                                mensagemFeedback(isTopic, id, "success", result.Return);

                                var item = $('#' + (isTopic ? 'topico_' : 'topico_resposta_') + id).removeClass((isTopic ? 'topico' : 'resposta') + '-deletado');
                                var botao = $('#' + (isTopic ? 'topicoControles_' : 'respostaControles_') + id + ' ul li.btnExcluirRestaurar').html('<a href="javascript:;" onclick="DeleteMessage(' + id + ', ' + isTopic + ', ' + usuarioID + ' ,\'' + tipoMural + '\')" class="btn btn-danger btn-xs" role="button">Excluir</a>');
                                $('#' + (isTopic ? 'topicoControles_' : 'respostaControles_') + id + ' ul li.btnTrancar').html('<a href="javascript:;" onclick="CloseMessage(' + id + ', ' + isTopic + ')" class="btn btn-danger btn-xs" role="button">Trancar</a>');
                                $('#topico_' + id + ' span.statusTopico').hide();
                            }
                        }
                    );
                }
            });
        }
    });
}

function scrollResponderTopico(id) {
    $('html, body').stop().animate({
        scrollTop: $(id).offset().top
    }, 1500, 'easeInOutExpo');

};


function SaveTopic(currentMessage, isEdit) {
    ValidateSession(function (isValid) {
        if (isValid) {

            if (!isEdit) {
                $('#btnEnviarNovoTopico').button("loading");
                var title = $.truncateText($.jsonText($.clearText($('#titulo-topico').val())), 100);
                var text = $.jsonText(tinymce.get('novoTopicoEditable').getContent().replace("/\r?\n|\r/g", " "));
                var linkID = ($('#selectLinkTopico').val() != undefined ? $('#selectLinkTopico').val() : 0);

            } else {
                var title = $.truncateText($.jsonText($.clearText($('#topico_' + currentMessage.id + '_topicoTítulo').val())), 100);
                var text = $.jsonText(tinymce.get('topico_' + currentMessage.id + '_topicoTexto').getContent());
                var linkID = 0;

            }
            if ($.trim(title) == '') {
                $('#btnEnviarNovoTopico').button("reset");
                toastr.warning('O tópico precisa de um título!');
                return;
            }

            if (text == '' || text == '<span style="color: #a9a9a9;">Digite sua mensagem</span>') {
                $('#btnEnviarNovoTopico').button("reset");
                toastr.warning('O tópico precisa de um texto!');
                return;
            }

            //$('#btnEnviar').hide();
            if (text.indexOf("base64") != -1 || text.indexOf("blob") != -1) {
                toastr.error('Atenção, ouve uma falha no upload de uma ou mais imegens do post. Remova as imagens e tente novamente.');
                return
            }

            ajaxProxy('/WsForum', 'SaveTopico', JSON.stringify({ referenciaID: linkID, topicoID: currentMessage.id, titulo: title, texto: text, imagem: '' }),
                function (result) {
                    if (result.Error) {
                        toastr.error(result.Error);
                        $('#btnEnviarNovoTopico').button("reset");
                    }
                    else {
                        if (linkID != 89)
                            mensagemFeedback(true, currentMessage.id, "success", result.Return);

                        if (!isEdit) {
                            $('#btnEnviarNovoTopico').button("reset");

                            if (linkID == 89)
                                toastr.success('Este tópico foi enviado para o Suporte, acompanhe este tópico por lá.');
                            
                            $('#btnNovoTopico').click();
                            $('#titulo-topico').val('');
                            tinymce.get('novoTopicoEditable').setContent("");
                            $('.overlay').hide();
                            $('div#bloco-posts-forum').html('');

                            dirtyPop('novoTopico');

                            // carrega TL do zero
                            topicoID = 0;

                            forumUltimas.listar();
                            //

                            $('html, body').stop().animate({
                                scrollTop: $('body').last().offset().top
                            }, 1500, 'easeInOutExpo');
                        }


                        if (isEdit) {
                            $('#conteudo-topico_' + currentMessage.id).html(text);
                            $('#topico_' + currentMessage.id + ' .panel-heading h4').html(title);
                            dirtyPop();
                        }
                        //busca emojis no topico
                        //var texto = $('#conteudo-topico_' + currentMessage.id).html();
                        //$('#conteudo-topico_' + currentMessage.id).html(emojione.shortnameToImage(texto));
                        
                    }
                }
            );
        }
    }, 'enviar mensagens.');
}

function Linkar(id, grupoAtual) {
    ValidateSession(function () {
        if ($('ul#topico_' + id + '_linkar li').length > 0)
            return;

        var $linkargrupos = $('ul#topico_' + id + '_linkar');

        ajaxProxy('WS_Grupos', 'GetGruposByMembro', JSON.stringify({ grupoID: grupoAtual }),
            function (result) {

                if (result.Error) {
                    toastr.error(result.Error);
                }
                else {

                    var html = '';
                    html += '<li><a href="javascript:;" onclick="MoverGrupo(' + id + ', 89)">Suporte Técnico</a></li>';
                    html += '<li role="separator" class="divider"></li>';
                    for (var i in result) {
                        html += '<li><a href="javascript:;" onclick="MoverGrupo(' + id + ', ' + result[i].Key + ')">' + result[i].Value + '</a></li>';
                    }
                    $linkargrupos.append(html);
                }
            }
        );
    }, ' linkar o tópico');
}

function ValidarLinkar(g, t) {
    ValidateSession(function () {

        var $grupos = new Array();

        if (g == 91) {
            toastr.warning('Para o grupo <strong>Assuntos Juridicos</strong> você deve postar diretamente no grupo.');
        } else {
            $grupos.push(g);
        }


        if ($grupos.length == 0) {
            toastr.warning('Você deve selecionar pelo menos uma área.');
            return;
        }

        if ($grupos[0] == 89 || $grupos[0] == 0) {
            MoverGrupo(t, $grupos[0]);
            return;
        }



        ajaxProxy('WS_Grupos', 'IsMembro', JSON.stringify({ grupoID: $grupos }),
            function (result) {
                if (result.Error) {
                    toastr.error(result.Error);
                }
                else {
                    if (result.Return == 'False') {
                        bootbox.confirm("Você não é membro do grupo que deseja linkar. Deseja se tornar membro ?", function (result) {
                            if (result) {
                                ajaxProxy('WS_Grupos', 'SaveMembro', JSON.stringify({ m: { GrupoID: $grupos[0] }, sair: false }),
                                    function (result) {
                                        if (result.Error) {
                                            toastr.error(result.Error);
                                        }
                                        else {
                                            if (result.Return == 'Agora você está seguindo esta área!')
                                                MoverGrupo(t, $grupos[0]);
                                        }
                                    });
                            }
                        });
                    } else {
                        MoverGrupo(t, $grupos[0]);
                    }

                    //$linkar.remove();
                }
            });

    }, 'linkar o tópico');
}

function SaveLinkar(t, grupos) {

    ajaxProxy('WsForum', 'SaveLinkar', JSON.stringify({ topicoID: t, grupos: grupos }),
        function (result) {

            if (result.Error) {
                mensagemFeedback(true, t, "danger", result.Error);
            }
            else {
                mensagemFeedback(true, t, "success", result.Return);

                ajaxProxy('WsForum', 'GetTopicoLinks', JSON.stringify({ topicoID: t }),
                    function (result) {

                        if (result.Error) {
                            mensagemFeedback(true, t, "danger", result.Error);
                        }
                        else {
                            $('#topico_' + t + ' .panel-heading span').remove()
                            var html = $('#topico_' + t + ' .panel-heading').append(result.Links);
                        }
                    });

            }
        });
}

function CloseMessage(id) {
    ValidateSession(function (isValid) {
        if (isValid) {
            bootbox.confirm("Deseja fechar o tópico?", function (result) {
                if (result) {
                    ajaxProxy('/WsForum', 'CloseMensagem', JSON.stringify({ topicoID: id, grupoID: 0 }),
                        function (result) {
                            if (result.Error) {
                                mensagemFeedback(true, id, "danger", result.Error);
                            }
                            else {
                                mensagemFeedback(true, id, "success", result.Return);


                                $('#topico_' + id + ' .panel-heading').append('<span class="statusTopico"><i class="fa fa-lock"></i> Tópico fechado</span>');
                                $('#topicoControles_' + id + ' ul li.btnTrancar').html('<a href="javascript:;" onclick="RestoreMessage(' + id + ', true, 1)" class="btn btn-danger btn-xs" role="button">Restaurar</a></li>');

                            }
                        }
                    );
                }
            });
        }
    });
}

function filtroArea() {

    var html = '';

    ajaxProxy('WS_Grupos', 'GetGruposByMembro', JSON.stringify({ grupoID: 0 }),
        function (result) {

            if (result.Error) {
                toastr.error(result.Error);
            }
            else {
                html += '<li data-grupoID="0"><a href="javascript:;" onclick="topicoID = 0;grupoFiltro(0)">Todas as áreas</a></li>';
                html += '<li role="separator" class="divider"></li>';
                //html += '<li><a href="javascript:;" onclick="topicoIDGrupo = 0;forumUltimas.listarGrupo(89,1,  \'\', 0)">Suporte Técnico</a></li>';
                //html += '<li role="separator" class="divider"></li>';
                for (var i in result) {
                    html += '<li data-grupoID="' + result[i].Key + '"><a href="javascript:;" onclick="topicoIDGrupo = 0;grupoFiltro(' + result[i].Key + ')">' + result[i].Value + '</a></li>';
                }
                $('#filtroArea').html(html);

                marcaFiltroArea(gruposFiltro);
            }
        }
    );

};

function filtroAreaTimeLine() {

    var html = '';

    ajaxProxy('WS_Grupos', 'GetGruposByMembro', JSON.stringify({ grupoID: 0 }),
        function (result) {

            if (result.Error) {
                toastr.error(result.Error);
            }
            else {
                html += '<li data-grupoID="0"><a href="javascript:;" onclick="topicoID = 0;grupoFiltro(0)"><input type="checkbox" id="ckGrupo_0" checked/> Todas as áreas</a></li>';
                html += '<li role="separator" class="divider"></li>';
                //html += '<li><a href="javascript:;" onclick="topicoIDGrupo = 0;forumUltimas.listarGrupo(89,1,  \'\', 0)">Suporte Técnico</a></li>';
                //html += '<li role="separator" class="divider"></li>';
                for (var i in result) {
                    html += '<li data-grupoID="' + result[i].Key + '">';
                    //html += ' <a href="javascript:;" onclick="topicoIDGrupo = 0;grupoFiltro(' + result[i].Key + ')"><input type="checkbox" id="ckGrupo_' + result[i].Key + '" name="ckGruposFiltro"/> ' + result[i].Value + '</a>';
                    html += '   <label><input type="checkbox" id="ckGrupo_' + result[i].Key + '" name="ckGruposFiltro" onclick="topicoIDGrupo = 0;grupoFiltro()" value="' + result[i].Key + '"/> ' + result[i].Value + '</label>';
                    html += '</li >';
                }
                $('#filtroArea').html(html);

                marcaFiltroArea(gruposFiltro);

                $('#filtroArea.dropdown-menu').click(function (e) {
                    e.stopPropagation();
                });
            }
        }
    );

};

function selectLinkNovoTopico() {
    ValidateSession(function (isValid) {
        if (isValid) {

            var html = '';

            ajaxProxy('WS_Grupos', 'GetGruposByMembro', JSON.stringify({ grupoID: 0 }),
                function (result) {

                    if (result.Error) {
                        toastr.error(result.Error);
                    }
                    else {

                        html += '<option value="0">Nenhum Link</option>';
                        html += '<option value="89">Suporte Técnico</option>';
                        html += '<option disabled>──────────</option>';
                        html += '<li role="separator" class="divider"></li>';
                        for (var i in result) {
                            html += '<option value="' + result[i].Key + '">' + result[i].Value + '</option>';
                        }
                        $('#selectLinkNovoTopico').append(html);
                    }
                }
            );



        }
    }, 'filtrarArea');
};

function MoverGrupo(topicoID, novoGrupoID) {
    ajaxProxy('WsForum', 'UpdateTopico', JSON.stringify({ topicoID: topicoID, grupoID: novoGrupoID, grupoIDOrigem: 0 }),
        function (result) {
            if (result.Error) {
                toastr.error(result.Error);
            } else {
                toastr.success(result.Return);
                $('#topico_' + topicoID + ' .panel-heading span').remove()
                $('#topico_' + topicoID + ' .panel-heading').append('<span class="btn btn-default btn-xs pull-right">' + ObterArea(novoGrupoID) + '</span>');
            }
        });
};


function SeguirCursos() {
    ajaxProxy('WsSite', 'CursoIsSeguidor', '',
        function (result) {
            if (result.Error) {
                alertBox('error', result.Error);
            }
            else {
                if (result.Return == 'False') {
                    bootbox.confirm({
                        message: "Deseja receber notificações sobre novos cursos ?",
                        buttons: {
                            confirm: {
                                label: 'Sim',
                                className: 'btn-success'
                            },
                            cancel: {
                                label: 'Não',
                                className: 'btn-danger'
                            }
                        },
                        callback: function (r) {
                            if (r) {
                                ajaxProxy('WsSite', 'CursoSeguir', '',
                                    function (result) {
                                        if (result.Error) {
                                            toastr.error(result.Error);
                                        }
                                        else if (result.Return == 'OK') {
                                            toastr.success('A partir de agora você receberá notificações sobre os novos cursos!');
                                        }
                                    });
                            }
                        }
                    });
                } else if (result.Return == 'True') {

                    bootbox.confirm({
                        message: "Você já está recebendo notificações sobre novos cursos.<br /><br />Deseja CANCELAR o recebimento das notificações sobre novos cursos ?",
                        buttons: {
                            confirm: {
                                label: 'Sim',
                                className: 'btn-success'
                            },
                            cancel: {
                                label: 'Não',
                                className: 'btn-danger'
                            }
                        },
                        callback: function (r) {
                            if (r) {
                                ajaxProxy('WsSite', 'CursoNaoSeguir', '',
                                    function (result) {
                                        if (result.Error) {
                                            toastr.error(result.Error);
                                        }
                                        else if (result.Return == 'OK') {
                                            toastr.success('A partir de agora você NÃO receberá notificações sobre os novos cursos!');
                                        }
                                    });
                            }
                        }
                    });
                }
            }
        });
}



function getUserProfilePic(obj, usuarioID, avatar, login, isAdmin, ip) {

    var dataContent = '';
    var dataTitle = '';

    if (usuarioID == 2600) {
        $(obj).attr("data-content", "Mensagem automática");
        $(obj).attr("data-original-title", 'Bastter.com');
        $(obj).popover('hide');
        $(obj).popover('show');
        return;
    }

    ajaxProxy('WsForum', 'GetPerfilPopUp', JSON.stringify({ usuarioID: usuarioID }),
        function (result) {

            if (result.Error) {
                toastr.error(result.Error);
            }
            else {

                //html += '<a href="/Mercado/Perfil.aspx?ID=' + usuarioID + '" tabindex="0" class="pop" role="button" data-toggle="popover" data-trigger="hover" title="" data-html="true" data-placement="right" data-content="';
                //html += '                     <h5><strong>Atividades Recentes</strong></h5>';
                //html += '                     <ul class=\'small\'>';
                //html += '                       <li><a href=\'javascript:;\'>Ambev e o setor de alimentos</a></li>';
                //html += '                       <li><a href=\'javascript:;\'>Não estou conseguindo interagir na nova home</a></li>';
                //html += '                       <li><a href=\'javascript:;\'>Novo comentário para ABEV!</a></li>';
                //html += '                       <li><a href=\'javascript:;\'>Custo da dívida</a></li>';
                //html += '                     </ul>';
                dataContent += '                     <div class=\'btn-group btn-group-justified\' role=\'group\' aria-label=\'\'>';
                dataContent += '                       <a class=\'btn btn-default btn-sm\' href=\'/Mercado/Perfil.aspx?ID=' + usuarioID + '\' role=\'button\' title=\'Conhecer Perfil\'>Conhecer</a>';

                if (result.IsSeguidor) {
                    dataContent += '                       <a class=\'btn btn-default btn-sm\' href=\'javascript:;\' role=\'button\' title=\'Deixar de seguir este usuário\' onClick=\'UsuarioNaoSeguir(' + usuarioID + ',this)\'>Deixar de Seguir</a>';
                } else {
                    dataContent += '                       <a class=\'btn btn-default btn-sm\' href=\'javascript:;\' role=\'button\' title=\'Seguir este usuário\' onClick=\'UsuarioSeguir(' + usuarioID + ', this)\'>Seguir</a>';
                }

                dataContent += '                    </div>';
                dataContent += '                    <a href=\'javascript:;\' class=\'btn btn-primary btn-sm btn-block margin-top\' role=\'button\' title=\'Enviar mensagem para bastter\' onclick=\'SalvarRecado("' + login + '", ' + usuarioID + ')\'>Enviar Mensagem</a>';

                if (isAdmin) {
                    dataTitle += '<a class=\'btn btn-primary btn-xs pull-right\' data-toggle=\'tooltip\' title=\'Administrar Usuário\' href=\'/Mercado/Admin/usuario.aspx?ID=' + usuarioID + '&IP=' + ip + '\' target=\'_blanc\'><i class=\'fa fa-address-card\'></i></a>';
                }

                dataTitle += '<a class=\'btn btn-link btn-xs\' href=\'/Mercado/Perfil.aspx?ID=' + usuarioID + '\' role=\'button\'><strong>' + login + '</strong> - ' + result.QtdSeguidores + ' Seguidores</a>';
                dataTitle += '<br/><span style="font-size:80%;padding-left:5px;color:#8a8a8a">' + result.MembroTempo + '</span>';
                dataTitle += (result.AssinaturaTempo != undefined ? '<br/><span style="font-size:80%;padding-left:5px;color:#8a8a8a">' + result.AssinaturaTempo + '</span>' : '');



                //html += '   <img src="' + avatar + '" class="img-responsive user-photo" alt="' + login + '">';
                //html += '</a>';
                //return html;

                $(obj).attr("data-content", dataContent);
                $(obj).attr("data-original-title", dataTitle);

                $(obj).popover('hide');
                $(obj).popover('show').data('bs.popover').tip().addClass('profile');
                $('[data-toggle="tooltip"], .tooltipActive').tooltip();



            }
        }
    );



}

function UsuarioNaoSeguir(usuarioID, obj) {
    ajaxProxy('WsUsuario', 'UsuarioNaoSeguir', JSON.stringify({ usuarioID: usuarioID }),
        function (result) {
            if (result.Error) {
                toastr.error(result.Error);
            }
            else {
                toastr.success(result.Return);

                $(obj).html('Seguir').removeAttr('onclick');
                $(obj).attr('onclick', 'UsuarioSeguir(' + usuarioID + ', this)');
                $(obj).removeClass('icon-naoacompanhar').addClass('icon-acompanhar');
            }
        });
}

function UsuarioSeguir(usuarioID, obj) {
    ajaxProxy('WsUsuario', 'UsuarioSeguir', JSON.stringify({ usuarioID: usuarioID }),
        function (result) {
            if (result.Error) {
                toastr.error(result.Error);
            }
            else {
                toastr.success(result.Return);

                $(obj).html('Deixar de Seguir').removeAttr('onclick');
                $(obj).attr('onclick', 'UsuarioNaoSeguir(' + usuarioID + ', this)');
                $(obj).removeClass('icon-acompanhar').addClass('icon-naoacompanhar');
            }
        });
}

function SalvarRecado(destLogin, destID) {
    var recado = { Destinatario: '', Texto: '' };

    var box = bootbox.dialog({
        title: "Enviar recado para <strong>" + destLogin + "</strong>",
        message: '<textarea id="txttexto" rows="4" cols="50" autofocus class="bootbox-input bootbox-input-textarea form-control"></textarea><span id="caracrestante" style="display:block;text-align:right;font-style:italic;">500 caracteres restantes</span>',
        buttons: {
            confirm: {
                label: 'Enviar',
                className: 'btn-success',
                callback: function () {
                    recado.Texto = $.truncateText($.jsonText($('#txttexto').val()), 500);
                    recado.Destinatario = { UsuarioID: destID };

                    if ($.clearText($.trim(recado.Texto)) == '') {
                        toastr.warning('Preencha o recado.');
                        return;
                    }

                    ajaxProxy('WsUsuario', 'SaveRecado', JSON.stringify({ recado: recado }),
                        function (result) {
                            if (result.Error) {
                                toastr.error(result.Error);
                            }
                            else {
                                toastr.success('Recado enviado!');
                            }
                        }
                    );
                }
            },
            cancel: {
                label: 'Cancelar',
                className: 'btn-danger'
            }
        }
    });
    box.bind('shown.bs.modal', function () {
        var txt = $('#txttexto');

        txt.keyup(function () {
            var rest = (500 - $(this).val().length);

            $('span#caracrestante').html((rest <= 0 ? 0 : rest) + ' caracteres restantes.');
        });

        $.limit(txt, 500);

        txt.focus();
    });
}

function FavoritoSalvar(url, titulo) {
    ajaxProxy('WsUsuario', 'FavoritoSalvar', '{ url: \'' + url + '\', titulo: \'' + $.jsonText(titulo) + '\'}',
        function (result) {
            if (result.Error) {
                toastr.error(result.Error);
            }
            else {
                toastr.success(result.Return);
            }
        });
}


function qtdTopicosCarregar(qtdTopicos,tipo) {
    $.cookie('qtdTopicosCarregar', qtdTopicos);

    if(tipo != undefined)
        $('#' + tipo + '-carregarMais').click();
    else
        $('#carregarMais').click();
}

function uploadBannerCurso() {
    ValidateSession(function (isValid) {
        if (isValid) {
            $.get('/mercado/Controls/EditorBannerCurso.aspx', { titulo: 'Editar Banner Curso' }, function (data) {
                bootbox.dialog({
                    title: 'Editar Banner - Cursos',
                    message:data
                });

                $('#btnEnviar').unbind("click").click(function () { ValidarImagem(); });

                $('img.thumb').attr('src', '/Mercado/Images/Banners/banner-proximos-cursos.png?v=' + new Date());
                $('img.thumb').toggle();

                createUploader2('BannerCurso', ['gif', 'png', 'jpg', 'jpeg', 'bmp'], 1024000, 'arquivo', UploadImagem_OnComplete);
            });              
        }
    }, 'editar mensagem.');
}


function createUploader2(tipo, formatos, tamanho, botao, onComplete) {
    var uploader = new qq.FileUploaderBasic({
        params: { tipo: tipo },
        allowedExtensions: formatos,
        sizeLimit: tamanho,
        button: document.getElementById(botao),
        onSubmit: function (id, fileName) { $('#editormensagem #btnEnviar').hide(); $('#' + botao + ' span').hide(); $('#' + botao + ' label').after('<img id="loading" src="/mercado/images/loading.gif" />'); },
        onComplete: function (id, fileName, response) { $('#editormensagem #btnEnviar').show(); $('#' + botao + ' span').show(); $('#' + botao + ' span').html(fileName.length > 55 ? $.truncateText(fileName, 52) + '...' : fileName); $('#' + botao + ' #loading').remove(); onComplete(fileName, response); },
        action: '/Mercado/Controls/Upload.ashx',
        showMessage: function (message) { alert(message); }
    });
}

function UploadImagem_OnComplete(filename, response) {
    if (response.success) {
        switch (instance) {
            case 'i': imagem.arquivo = response.filename; break;
            default:
        }

        $('img.thumb').attr('src', '/Mercado/Images/Banners/banner-proximos-cursos.png?v='+new Date());
        $('img.thumb').show();

        toastr.success("Imagem do Banner atualizada.");
    } else alert(response.error);
}

function topicoExpamdir(e) {
    var parent = e.parent();
    e.css('height', 'auto');
    parent.find(".expandir-conteudo").html('...<a href="javascript:;">[diminuir texto]</a>');
    parent.find(".expandir-conteudo").unbind().click(function () {
        topicoComprimir(e);
    });
}

function topicoComprimir(e) {
    var parent = e.parent();
    e.css('height', '150px');
    parent.find('.expandir-conteudo').html('...<a href="javascript:;">[continuar lendo]</a>');
    parent.find(".expandir-conteudo").unbind().click(function () {
        topicoExpamdir(e);
    });
}



var latestAjaxCallDateTime;
function TopicoSugestion(termo, grupoID) {
    $("#titulo-topico").on('shown.bs.popover', function () {

        $(document.body).click(function (e) {
            if ($(e.target).parents(".popover").length === 0) {
                $('#titulo-topico').popover('hide');
                $(document.body).unbind();
            }
        });

    });

    $('#titulo-topico').popover({
        title: 'Talvez esse assunto já tenha sido discutido...',
        html: true,
        content: 'Digite o título do tópico, mas antes de criar, veja na lista se o assunto já não foi discutido pela comunidade.',
        placement: 'bottom',
        trigger: 'manual'
    });

    

    if (termo.length < 3)
        return;

    

    if ($('#titulo-topico').is(":focus")) { 
        latestAjaxCallDateTime = moment();
        $('#titulo-topico').popover('show');
        $container = $('#cria-topico .popover-content');
        $.wait($container);


        //armazena o timestamp antes de executar o próximo ajax
        latestAjaxCallDateTime = moment();

        //define o timestamp da próxima chamada ajax a ser executada como o mesmo da ultima chamada
        var currentAjaxCallDateTime = latestAjaxCallDateTime;

        ajaxProxy('WsForum', 'PesquisaTopicosExistentes', JSON.stringify({ pesquisaTermo: termo, grupoID: grupoID }),
            function (result) {

                //se o timestamp atual é mais antigo que o ultimo timestamp, omite o request
                if (currentAjaxCallDateTime.isBefore(latestAjaxCallDateTime))
                    return;

                if (result.Error) {
                    toastr.error(result.Error);
                }
                else {

                    if (result.topicos.length == 0) {
                        html = 'parece que este assunto ainda não foi discutido. Crie seu tópico!';
                    } else {

                        html = '<ul>';

                        for (var i in result.topicos) {
                            html += '<li><a href="/mercado/forum/' + result.topicos[i].TopicoID + '/' + result.topicos[i].Link + '.aspx" title="' + result.topicos[i].Titulo + '" target="_blank">' + result.topicos[i].Titulo + '</a></li>';
                        }

                        html += '</ul>';
                    }
                
                    $container.html(html);
                

                    var $popover = $('#cria-topico .popover');
                    $('#titulo-topico').focus(function () {
                        event.stopPropagation();
                        TopicoSugestion($('#cria-topico').val())
                    });

                    $(document.body).click(function (e) {
                        if ($(e.target).parents(".popover").length === 0) {                    
                            $('#titulo-topico').popover('hide');
                            $(document.body).unbind();
                        }
                    });
                
                }
            }
        );
    }
}

function PesquisarPerfil(termo) {
    $("#pesquisarPerfil").on('shown.bs.popover', function () {

        $(document.body).click(function (e) {
            if ($(e.target).parents(".popover").length === 0) {
                $('#pesquisarPerfil').popover('hide');
                $(document.body).unbind();
            }
        });

    });

    $('#pesquisarPerfil').popover({
        title: 'Perfis encontrados',
        html: true,
        content: 'Informe o login para encontrar um usuário.',
        placement: 'bottom',
        trigger: 'manual'
    });



    if (termo.length < 3)
        return;

    latestAjaxCallDateTime = moment();
    $('#pesquisarPerfil').popover('show');
    $container = $('#pesquisarPerfilContainer .popover-content');
    $.wait($container);

    //armazena o timestamp antes de executar o próximo ajax
    latestAjaxCallDateTime = moment();

    //define o timestamp da próxima chamada ajax a ser executada como o mesmo da ultima chamada
    var currentAjaxCallDateTime = latestAjaxCallDateTime;

    ajaxProxy('WsUsuario', 'GetPerfisByLogin', JSON.stringify({ login: termo }),
        function (result) {

            //se o timestamp atual é mais antigo que o ultimo timestamp, omite o request
            if (currentAjaxCallDateTime.isBefore(latestAjaxCallDateTime))
                return;

            if (result.Error) {
                toastr.error(result.Error);
            }
            else {

                if (result.length == 0) {
                    html = 'Nenhum usuário encontrado.';
                } else {

                    html = '<ul>';

                    for (var i in result) {
                        html += '<li><a href="/mercado/perfil.aspx?id=' + result[i].UsuarioID + '" target="_blank"><img src="' + result[i].Imagem + '"/>' + result[i].Login + '</a></li>';
                    }

                    html += '</ul>';
                }

                $container.html(html);


                var $popover = $('#cria-topico .popover');
                $('#pesquisarPerfil').focus(function () {
                    event.stopPropagation();
                    TopicoSugestion($('#cria-topico').val())
                });

                $(document.body).click(function (e) {
                    if ($(e.target).parents(".popover").length === 0) {
                        $('#pesquisarPerfil').popover('hide');
                        $(document.body).unbind();
                    }
                });

            }
        }
    );
}

function VerificarPendenciaConsultor() {
    if ($.cookie('VerificarPendenciaConsultor') != undefined)
        return;

    ajaxProxy('WsSite', 'VerificarPendenciaConsultor', '',
        function (result) {
            if (result.Error) {
                alertBox('error', result.Error);
            }
            else {
                if (result.Return == 'Pendencia') {
                    bootbox.alert('Você possui perguntas / solicitações sem resposta.<br /><br />Acesse o <a href="/mercado/grupos/pendencia.aspx">relatório (clique)</a> para verificar as pendências.');
                }
            }

            $.cookie('VerificarPendenciaConsultor', 'ok', { expires: 1000 });
        });

}

//função que trata inclusão/exclusão de grupos no array gruposFiltro
var requestDelayGrupoFiltro;
function grupoFiltro(grupoID) {
    if (grupoID === 0) {
        gruposFiltro = [];
        marcaFiltroArea(gruposFiltro);
        forumUltimas.listar();
        //salva informaçõa do filtro em cookie
        setGrupoFiltroUsuario('');
        return;
    }

    gruposFiltro = [];
    $("input:checkbox[name=ckGruposFiltro]:checked").each(function () {
        var grupoID = $(this).val() + "";
        gruposFiltro.push(grupoID);
    });

    

    marcaFiltroArea(gruposFiltro);

    if (requestDelayGrupoFiltro !== undefined)
        clearTimeout(requestDelayGrupoFiltro);

    if (gruposFiltro.length > 0) {
        requestDelayGrupoFiltro = setTimeout(function () {
            forumUltimas.listarGrupo(gruposFiltro, 1, '', 0);
            //salva informaçõa do filtro em cookie
            setGrupoFiltroUsuario(gruposFiltro.toString());
        }, 1500);
        
    } else {
        requestDelayGrupoFiltro = setTimeout(function () {
            forumUltimas.listar();
            //salva informaçõa do filtro em cookie
            setGrupoFiltroUsuario(gruposFiltro.toString());
        }, 1500);
        
    }


}

//função responsavel apenas pela marcação visual no menu
function marcaFiltroArea(gruposFiltro) {
    $('#filtroArea li input').prop("checked",false);

    if (gruposFiltro.length > 0) {
        gruposFiltro.forEach(function (g) {
            if (g != '')
                $('#filtroArea li #ckGrupo_' + g).prop("checked", true);
            else {
                if (gruposFiltro.length == 1)
                $('#filtroArea li #ckGrupo_0').prop("checked", true);
            }

        })
    } else {
        $('#filtroArea li #ckGrupo_0').prop("checked", true);
    }
}


function setGrupoFiltroUsuario(grupos) {
    ajaxProxy('WsUsuario', 'SetUsuarioGruposFiltro', JSON.stringify({ grupos: grupos}),
        function (result) {

            if (result.Error) {
                toastr.error(result.Error);
            }
            else {
                gruposFiltro = result.Grupos.split(',');
            }
        }
    );
}


function inicializarTimeline() {

    ajaxProxy('WsUsuario', 'GetUsuarioGruposFiltro', '',
        function (result) {

            if (result.Error) {
                toastr.error(result.Error);
            }
            else {
                if (result.Grupos == null || result.Grupos == "") {
                    gruposFIltro = [];
                } else {
                    gruposFiltro = result.Grupos.split(',');
                }

                if (gruposFiltro.length > 0) {
                    forumUltimas.listarGrupo(gruposFiltro, 1, '', 0);
                }
                else
                    forumUltimas.listar();
            }
        }
    );   
}

function converterParaDepoimento(itemID, isTopic, usuarioID, data){
    bootbox.confirm("Tem certeza que deseja converter para depoimento?", function (result) {
        if (result) {
            var texto = '';


            if (isTopic) {
                texto = $('#conteudo-topico_' + itemID + ' .expandable').html();
            } else {
                texto = $('#resposta_conteudo_' + itemID).html();
            }


            ajaxProxy('WsDepoimentos', 'ConverterParaDepoimento', JSON.stringify({ usuarioID: usuarioID, data: data, texto: texto }),
                function (result) {
                    if (result.Error) {
                        toastr.error(result.Error);
                    } else {
                        toastr.success(result.Return);
                    }
                });
        }
    });
}

function UltimosDepoimentos (pageSize, page) {
    var $container = $('div.ultimos-depoimentos');

    $.wait($container.find('.item.active'));

    ajaxProxy('WsDepoimentos', 'UltimosDepoimentos', JSON.stringify({ pageSize: pageSize, page: page }),
        function (result) {
            if (result.Error) {
                toastr.error(result.Error);
            } else {
                var html = '';
                for (var i in result.Depoimentos) {
                    html += '<div class="item ' + (i == 0 ? 'active' : '') + '">';
                    html += '   <a class="depoimento-perfil" href="/mercado/perfil.aspx?id=' + result.Depoimentos[i].UsuarioID + '" title="Visualizar Perfil">';
                    html += '       <span class="depoimento-avatar-home center-block"><img class="center-block" src="' + result.Depoimentos[i].Avatar + '"></span><br/>';
                    html += '       <span class="depoimento-usuario"><strong>' + result.Depoimentos[i].Login + '</strong><br/><span class="small">' + $.toDate(result.Depoimentos[i].Data, false, false, false) + '</span></span>';
                    html += '   </a>';                    
                    html += '   <blockquote class="depoimento">';
                    html += '       <p class="depoimentos-texto">' + result.Depoimentos[i].Texto + '</p>';
                    html += '   </blockquote>';
                    html += '</div>';
                }
                $container.html(html);

                $('.depoimentos-texto').expander({
                    slicePoint: 300,  // default is 100
                    expandPrefix: '... ', // default is '... '
                    expandText: '<button class="btn btn-default btn-xs">Leia todo</button>', // default is 'read more'
                    userCollapseText: '<button class="btn btn-default btn-xs">Diminuir</button>'  // default is 'read less'
                });
            }
        }
    );
}