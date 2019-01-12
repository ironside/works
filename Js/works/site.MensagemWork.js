
function IncluirMensagemWork() {

    var mensagemModel = {
        UsuarioId: $(".modal-body #IdUsuario").val(),
        DescricaoMensagemWork: $('#descricao-mensagem').val()
    }; 

    var dados =  JSON.stringify({ mensagemModel });
    
    $.ajax({
        type: "POST",
        dataType: "JSON",
        url: '/MensagemWork/IncluirMensagemWork',
        contentType: "application/json; charset=utf-8",
        data: dados,
        success: function(response) { 
            if (response.success) {

                $("#modal-mensagem").modal('toggle');

                $("#descricao-mensagem").val("");

                $("#success-mensagem").css({ display: "block" });
                $("#success-mensagem").fadeTo(2000, 500).slideUp(500, function(){
                    $("#success-mensagem").slideUp(500);
                }); 

            } else {
               alert(response.mensagem);
           }  
       },
        error: function() { alert('Ops, algo errado.'); }
    }); 
}

function ListaMensagem() {

    $('#contadorMsgNaoLida').text('0');
    
    $.ajax({
        type: "POST",
        url: '/MensagemWork/ListaMensagemWork',
        contentType: "application/json; charset=utf-8",
        data: {},
        dataType: "HTML",
        success: function(recData) { 
            $(".modal-body").html(recData);

            $("#modal-alerta-mensagem").modal();


        },
        error: function() { alert('Ops, algo errado.'); }
    });
}

function ListaMensagemAdmin() {

    $('#contadorMsgNaoLidaAdmin').text('0');
    
    $.ajax({
        type: "POST",
        url: '/MensagemWork/ListaMensagemWorkAdmin',
        contentType: "application/json; charset=utf-8",
        data: {},
        dataType: "HTML",
        success: function(recData) { 
            $(".modal-body").html(recData);

            $("#modal-alerta-mensagem").modal();


        },
        error: function() { alert('Ops, algo errado.'); }
    });
}


function ExcluirMensagem(idMensagem){

    var dados  =  JSON.stringify({ IdMensagem: idMensagem })
    
    $.ajax({
        type: "POST",
        dataType: "JSON",
        url: '/MensagemWork/ExcluirMensagem',
        contentType: "application/json; charset=utf-8",
        data: dados,
        success: function(response) { 
            if (response.success) {

                $("#modal-delete-mensagem").modal('toggle');

                $("#success-delete").css({ display: "block" });
                $("#success-delete").fadeTo(2000, 500).slideUp(500, function(){
                    $("#success-delete").slideUp(500);
                }); 

                $('#listaMensagem').empty();
                ListaMensagem();
            } else {

                alert(response.mensagem);
            }  
        },
        error: function() { alert('Ops, algo errado.'); }
    }); 
}






