$(function () {
    ListaOfertas();
});



 $("#pesquisa_oferta").click(function() {
    ListaOfertas();
 });

$("#limpar_pesquisa_oferta").click(function() {
    LimparPesquisaOferta();
 });

function IncluirOfertaWork() {

    var ofertaModel = {
        TituloOferta: $('#titulo-oferta').val(),
        DescricaoOferta: $('#descricao-oferta').val(),
        IdAreaProfissional: $('#area-profissional').val()
    }; 

    var dados =  JSON.stringify({ ofertaModel });
    
    $.ajax({
        type: "POST",
        dataType: "JSON",
        url: '/OfertasWork/IncluirOfertaWork',
        contentType: "application/json; charset=utf-8",
        data: dados,
        success: function(response) { 
            if (response.success) {

                $("#modal-nova-oferta").modal('toggle');

                $("#success-alert").css({ display: "block" });
                $("#success-alert").fadeTo(2000, 500).slideUp(500, function(){
                    $("#success-alert").slideUp(500);
                }); 

                $('#listaOfertas').empty();
                ListaOfertas();

            } else {
               alert(response.mensagem);
           }  
       },
        error: function() { alert('Ops, algo errado.'); }
    }); 
}

function ListaOfertas() {

   var selecionado =  $("#tipopesquisa_oferta").val();
   
    var ofertaModel = {
       TituloOferta: selecionado == 1 ? $('#texto_pesquisa_oferta').val() : "",
       DescricaoOferta: selecionado == 2 ? $('#texto_pesquisa_oferta').val() : "",
       IdAreaProfissional: $('#pesquisa-area-profissional').val()
    }; 

    var dados =  JSON.stringify({ ofertaModel: ofertaModel });
    
    $.ajax({
        type: "POST",
        url: '/OfertasWork/ListaOfertasWork',
        contentType: "application/json; charset=utf-8",
        data: dados,
        dataType: "HTML",
        success: function(recData) { 
            $('#listaOfertas').empty();
            $('#listaOfertas').append(recData);
        },
        error: function() { alert('Ops, algo errado.'); }
    });
}


function ExcluirOferta(){

    var Id = $(".modal-body #IdOferta").val();

    var dados  =  JSON.stringify({ IdOferta: Id })
    
    $.ajax({
        type: "POST",
        dataType: "JSON",
        url: '/OfertasWork/ExcluirOferta',
        contentType: "application/json; charset=utf-8",
        data: dados,
        success: function(response) { 
            if (response.success) {

                $("#modal-delete-oferta").modal('toggle');

                $("#success-delete").css({ display: "block" });
                $("#success-delete").fadeTo(2000, 500).slideUp(500, function(){
                    $("#success-delete").slideUp(500);
                }); 

                $('#listaOfertas').empty();
                ListaOfertas();
            } else {

                alert(response.mensagem);
            }  
        },
        error: function() { alert('Ops, algo errado.'); }
    }); 
}


//ABRIR MODEL E PEGAR O ID DA OFERTA E COLOCAR NO MODAL
$(document).on("click", "#delete-oferta", function () {
     var myId = $(this).data('id');
     $(".modal-body #IdOferta").val( myId );
     $("#modal-delete-oferta").modal();
});

//ABRIR MODEL E PEGAR O ID DA OFERTA E COLOCAR NO MODAL
$(document).on("click", "#mensagem-oferta", function () {
     var myId = $(this).data('id');
     $(".modal-body #IdUsuario").val( myId );
     $("#modal-mensagem").modal();
});


$("#criar-nova-oferta").click(function(){
  $("#modal-nova-oferta").modal();
});

function LimparPesquisaOferta(){
    $('#texto_pesquisa_oferta').val("");
    $('#tipopesquisa_oferta').val("");
    $('#pesquisa-area-profissional').val("");
    ListaOfertas();
}





