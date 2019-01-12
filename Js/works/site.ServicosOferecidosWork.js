$(function () {
    ListaServicos();
});

 $("#pesquisa_servico").click(function() {
    ListaServicos();
 });

$("#limpar_pesquisa_servico").click(function() {
    LimparPesquisaServico();
 });

function IncluirServicoWork() {

    var servicoModel = {
        TituloServico: $('#titulo-servico').val(),
        DescricaoServico: $('#descricao-servico').val(),
        IdAreaProfissional: $('#area-profissional').val()
    }; 

    var dados =  JSON.stringify({ servicoModel });
    
    $.ajax({
        type: "POST",
        dataType: "JSON",
        url: '/ServicosOferecidosWork/IncluirServicoWork',
        contentType: "application/json; charset=utf-8",
        data: dados,
        success: function(response) { 
            if (response.success) {

                $("#modal-novo-servico").modal('toggle');

                $("#success-alert").css({ display: "block" });
                $("#success-alert").fadeTo(2000, 500).slideUp(500, function(){
                    $("#success-alert").slideUp(500);
                }); 

                $('#listaServicos').empty();
                ListaServicos();

            } else {
               alert(response.mensagem);
           }  
       },
        error: function() { alert('Ops, algo errado.'); }
    }); 
}

function ListaServicos() {

   var selecionado =  $("#tipopesquisa_servico").val();
   
    var servicoModel = {
       TituloServico: selecionado == 1 ? $('#texto_pesquisa_servico').val() : "",
       DescricaoServico: selecionado == 2 ? $('#texto_pesquisa_servico').val() : "",
       IdAreaProfissional: $('#pesquisa-area-profissional').val()
    }; 

    var dados =  JSON.stringify({ servicoModel: servicoModel });
    
    $.ajax({
        type: "POST",
        url: '/ServicosOferecidosWork/ListaServicosOferecidosWork',
        contentType: "application/json; charset=utf-8",
        data: dados,
        dataType: "HTML",
        success: function(recData) { 
            $('#listaServicos').empty();
            $('#listaServicos').append(recData);
        },
        error: function() { alert('Ops, algo errado.'); }
    });
}


function ExcluirServico(){

    var Id = $(".modal-body #IdServico").val();

    var dados  =  JSON.stringify({ IdServico: Id })
    
    $.ajax({
        type: "POST",
        dataType: "JSON",
        url: '/ServicosOferecidosWork/ExcluirServico',
        contentType: "application/json; charset=utf-8",
        data: dados,
        success: function(response) { 
            if (response.success) {

                $("#modal-delete-servico").modal('toggle');

                $("#success-delete").css({ display: "block" });
                $("#success-delete").fadeTo(2000, 500).slideUp(500, function(){
                    $("#success-delete").slideUp(500);
                }); 

                $('#listaServicos').empty();
                ListaServicos();
            } else {

                alert(response.mensagem);
            }  
        },
        error: function() { alert('Ops, algo errado.r'); }
    }); 
}


//ABRIR MODEL E PEGAR O ID DO SERVICO E COLOCAR NO MODAL
$(document).on("click", "#delete-servico", function () {
     var myId = $(this).data('id');
     $(".modal-body #IdServico").val( myId );
     $("#modal-delete-servico").modal();
});

//ABRIR MODEL E PEGAR O ID DO SERVICO E COLOCAR NO MODAL
$(document).on("click", "#mensagem-servico", function () {
     var myId = $(this).data('id');
     $(".modal-body #IdUsuario").val( myId );
     $("#modal-mensagem").modal();
});


$("#criar-novo-servico").click(function(){
  $("#modal-novo-servico").modal();
});

function LimparPesquisaServico(){
    $('#texto_pesquisa_servico').val("");
    $('#tipopesquisa_servico').val("");
    $('#pesquisa-area-profissional').val("");
    ListaServicos();
}





