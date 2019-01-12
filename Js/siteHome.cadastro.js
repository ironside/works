var aspnet_prefix = '#ctl00_';
var email_anterior = '';

$(function() {
    isAuthenticated(function(e){if(e){$('#regrasdoforum').hide();}});
    
});

function Validar(alteracao) {
    
    var login = $.trim($(aspnet_prefix + 'txtLoginCadastro').val());
    var email = $.trim($(aspnet_prefix + 'txtEmail').val());
    var regras = $(aspnet_prefix + 'aceitoRegras');

    if ($.trim($(aspnet_prefix + 'txtNome').val()) == '') {
        toastr.warning('Informe o Nome.');
        $(aspnet_prefix + 'txtNome').focus();
        return false;
    }

    if (email == '') {
        toastr.warning('Informe o Email.');
        $(aspnet_prefix + 'txtEmail').focus();
        return false;
    }

    if (!/^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/.test(email)) {
        toastr.warning('Email inválido.');
        $(aspnet_prefix + 'txtEmail').focus();
        return false;
    }

    if (!alteracao) {
        if (login == '') {
            toastr.warning('Informe o Login.');
            $(aspnet_prefix + 'txtLoginCadastro').focus();
            return false;
        }

        if(!/^(?=.{3,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+$/.test(login)) {
            toastr.warning('Login inválido.<br /><br />- mínimo de 3 caracteres;<br /><br />- permitido: letras, números e os caracteres especiais . e _');
            $(aspnet_prefix + 'txtLoginCadastro').focus();
            return false;
        }

        if (!regras.prop("checked")) {
            toastr.warning("Você deve aceitar as regras da Bastter.com para efetuar seu cadastro.");
            return false;
        }
    }

    var senha = $.trim($(aspnet_prefix + 'txtSenhaCadastro').val());

    if (!alteracao) {
        if (senha == '') {
            toastr.warning('Informe a Senha.');
            $(aspnet_prefix + 'txtSenhaCadastro').focus();
            return false;
        }

        if (senha.length < 6 || senha.match(/\d/) == null || senha.match(/\D/) == null) {
            toastr.warning('A senha deve ter pelo menos 6 caracteres com letras e números.');
            $(aspnet_prefix + 'txtSenhaCadastro').focus();
            return false;
        }
    }
    else if(senha != '' && (senha.length < 6 || senha.match(/\d/) == null || senha.match(/\D/) == null)) {
        toastr.warning('A senha deve ter pelo menos 6 caracteres com letras e números.');
        $(aspnet_prefix + 'txtSenhaCadastro').focus();
        return false;
    }

    if ($.trim($(aspnet_prefix + 'ddlSexo').val()) == '0') {
        toastr.warning('Informe o Sexo.');
        $(aspnet_prefix + 'ddlSexo').focus();
        return false;
    }

    if ($(aspnet_prefix + 'ddlEstado').val() == '0') {
        toastr.warning('Informe o Estado.');
        $(aspnet_prefix + 'ddlEstado').focus();
        return false;
    }

    var chkBastterBlueGratis = $(aspnet_prefix + 'chkBastterBlueGratis');

    if (chkBastterBlueGratis.attr('checked') != undefined) {
        var ddls = ['ddlAnoNascimento', 'ddlCorretora', 'ddlRendaMedia', 'ddlAreaAtuacao', 'ddlFormacaoAcademica'];
        var s = '';

        for (var i in ddls) {
            var ddl = $(aspnet_prefix + ddls[i]);

            if (ddl.val() == '0')
                s += '- ' + ddl.siblings().html() + '\n';
        }

        if (s != '') {
            chkBastterBlueGratis.attr('checked', false);
            toastr.warning('Você deve preencher todos os campos abaixo para ativar o acesso ao conteúdo Bastter Blue gratuitamente durante 1 mês:\n\n' + s);
            return false;
        }        
    }

    ValidarLoginEmail(alteracao, login, email);
}

function ValidarLoginEmail(alteracao, login, email) {
    // nao alteracao = validar email e login
    if (!alteracao) {
        $('.btn-cadastro, .btn-alterar').button('loading');
        ajaxProxy('WsUsuario', 'ValidarEmail', JSON.stringify({ email: email }),
            function (result) {
                if (result.Error) {
                    toastr.error(result.Error);

                    $(aspnet_prefix + 'txtEmail').focus();
                    $('.btn-cadastro, .btn-alterar').button('reset');
                } else {
                    ajaxProxy('WsUsuario', 'ValidarLogin', JSON.stringify({ login: login }),
                            function (result) {
                                if (result.Error) {
                                    toastr.error(result.Error);

                                    $(aspnet_prefix + 'txtLoginCadastro').focus();  
                                    $('.btn-cadastro, .btn-alterar').button('reset');
                                } else {
                                    ajaxProxy('WsUsuario', 'Cadastrar',
                                        JSON.stringify({
                                            nome: $(aspnet_prefix + 'txtNome').val(),
                                            email: email,
                                            login: login,
                                            senha: $(aspnet_prefix + 'txtSenhaCadastro').val(),
                                            cpf: null,
                                            sexo: '0',
                                            datanascimento: null,
                                            estado: "",
                                            rendamedia: 0,
                                            areaatuacao: 0,
                                            formacaoacademica: 0,
                                            corretora: 0,
                                            bastterBlueGratis: null,
                                            origem: "",
                                            alterouLogin: false
                                        }),
                                        function (result) {
                                            if (result.Error) {
                                                toastr.error(result.Error);

                                                $(aspnet_prefix + 'txtLoginCadastro').focus();
                                                $('.btn-cadastro, .btn-alterar').button('reset');
                                            } else {
                                                $('.btn-cadastro, .btn-alterar').button('reset');
                                                var dialog = bootbox.dialog({
                                                    message: "Seu cadastro foi salvo com sucesso!</br></br>Você receberá um email para ativação do seu cadastro.</br></br>Verifique se os emails @bastter.com estão em sua caixa de SPAM.</br></br>Qualquer dúvida, entre em contato através do email contato@bastter.com.",
                                                    buttons: {
                                                        ok: {
                                                            label: "OK",
                                                            className: 'btn-info',
                                                            callback: function () {
                                                                window.location = '/mercado/iniciante.aspx'
                                                            }
                                                        }
                                                    }
                                                });                                                
                                            }
                                        });
                                }
                            });
                }
            });
    }

    // alteracao = validar email
    if (alteracao && email_anterior != email) {
        $('.btn-cadastro, .btn-alterar').button('loading');
        ajaxProxy('WsUsuario', 'ValidarEmail', JSON.stringify({ email: email }),
            function (result) {
                if (result.Error) {
                    alert(result.Error);

                    $(aspnet_prefix + 'txtEmail').focus();
                    $('.btn-cadastro, .btn-alterar').button('reset');
                } else {
                    ajaxProxy('WsUsuario', 'Cadastrar',
                        JSON.stringify({
                            nome: $(aspnet_prefix + 'txtNome').val(),
                            email: email,
                            login: login,
                            senha: $(aspnet_prefix + 'txtSenhaCadastro').val(),
                            cpf: null,
                            sexo: '0',
                            datanascimento: null,
                            estado: "",
                            rendamedia: 0,
                            areaatuacao: 0,
                            formacaoacademica: 0,
                            corretora: 0,
                            bastterBlueGratis: null,
                            origem: "",
                            alterouLogin: false
                        }),
                        function (result) {
                            if (result.Error) {
                                toastr.error(result.Error);

                                $(aspnet_prefix + 'txtLoginCadastro').focus();
                                $('.btn-cadastro, .btn-alterar').button('reset');
                            } else {
                                
                                var dialog = bootbox.dialog({
                                    message: "Seu cadastro foi salvo com sucesso!.</br></br>Sua conta deverá ser novamente ativada por meio de link enviado no novo email informado.</br></br>Qualquer dúvida, entre em contato através do email contato@bastter.com.",
                                    buttons: {
                                        ok: {
                                            label: "OK",
                                            className: 'btn-info',
                                            callback: function () {
                                                Logout();
                                            }
                                        }
                                    }
                                });
                            }
                        });
                    $('.btn-cadastro, .btn-alterar').button('reset');
                }
            });
    }

    if (alteracao && email_anterior == email) {
        $('.btn-cadastro, .btn-alterar').button('loading');
        ajaxProxy('WsUsuario', 'Cadastrar',
            JSON.stringify({
                nome: $(aspnet_prefix + 'txtNome').val(),
                email: email,
                login: login,
                senha: $(aspnet_prefix + 'txtSenhaCadastro').val(),
                cpf: null,
                sexo: '0',
                datanascimento: null,
                estado: "",
                rendamedia: 0,
                areaatuacao: 0,
                formacaoacademica: 0,
                corretora: 0,
                bastterBlueGratis: null,
                origem: "",
                alterouLogin: false
            }),
            function (result) {
                if (result.Error) {
                    toastr.error(result.Error);

                    $(aspnet_prefix + 'txtLoginCadastro').focus();
                    $('.btn-cadastro, .btn-alterar').button('reset');
                } else {
                    $('.btn-cadastro, .btn-alterar').button('loading');
                    var dialog = bootbox.dialog({                        
                        message: "Seu cadastro foi salvo com sucesso!.</br></br>Qualquer dúvida, entre em contato através do email contato@bastter.com.",
                        buttons: {                           
                            ok: {
                                label: "OK",
                                className: 'btn-info',
                                callback: function () {
                                    window.location = '/mercado/default.aspx'
                                }
                            }
                        }
                    });
                }
            });
    }
}