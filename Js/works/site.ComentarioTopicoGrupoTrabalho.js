$('.salvarComentarioTopico').hide();


$(".comentarioTopico").click(function(event) {
    event.preventDefault();
});


function ListaComentariosTopicoGrupoTrabalho(id) {

    var dados = JSON.stringify( { GrupoTrabalhoId : $('#IdGrupoTrabalho').val(), Topico_GrupoTrabalhoId : id } );
    
    $.ajax({
        type: "POST",
        url: '/ComentariosTopico/ListaComentarioTopicoGrupoTrabalho',
        contentType: "application/json; charset=utf-8",
        data: dados,
        dataType: "HTML",
        success: function(response) { 
            $('#listaComentariosTopicoGrupoTrabalho-'+id).empty();
            $('#listaComentariosTopicoGrupoTrabalho-'+id).append(response);
        },
        error: function() { alert('Ops, algo errado.'); }
    }); 
}


function abrirEditorComentarioTopico(id) {

    $('.editarComentarioTopico-'+id).hide();
    $('.salvarComentarioTopico-'+id).show();
   
    if (!$('#comentarioTopico-'+id).data('froala.editor')) {

        $("#comentarioTopico-"+id).froalaEditor({
            language: 'pt_br',
                imageUploadURL: '/Editor/UploadFiles',
                imageUploadParams: {
                  id: 'my_editor'
                },
                // Set custom buttons with separator between them.
                toolbarButtons: ['undo', 'redo' , '|', 'insertLink', 'insertImage', 'insertVideo', 'emoticons'],
                toolbarButtonsXS: ['undo', 'redo' , '|', 'insertLink', 'insertImage', 'insertVideo', 'emoticons'],
                quickInsertButtons: ['image', 'video'],
                charCounterMax: 5000
        });

        // Catch image remove
        $('#comentarioTopico-'+id).on('froalaEditor.image.removed', function (e, editor, $img) {
            $.ajax({
                // Request method.
                method: "POST",

                // Request URL.
                url: "/Editor/DeleteImage",

                // Request params.
                data: {
                    src: $img.attr('src')
                }
            })
            .done (function (data) {
                console.log ('image was deleted');
            })
            .fail (function () {
                console.log ('image delete problem');
            })
        })
    }
} 


function fecharEditorComentario(id) {
    $('.editarComentarioTopico-'+id).show();
    $('.salvarComentarioTopico-'+id).hide();
    
    if ($("#comentarioTopico-"+id).data('froala.editor')) {
      $("#comentarioTopico-"+id).froalaEditor('destroy');
    }
}


function SalvarResponderTopico(id) {

    var comentario_GrupoTrabalho = {
        comentario: $('#responderTopico-'+id).val(),
        grupoTrabalhoId: $('#IdGrupoTrabalho').val(),
        Topico_GrupoTrabalhoId: id
    };

    var dados =  JSON.stringify({ comentario_GrupoTrabalho : comentario_GrupoTrabalho });
      
    $.ajax({
        type: "POST",
        dataType: "JSON",
        url: '/ComentariosTopico/SalvarComentario',
        contentType: "application/json; charset=utf-8",
        data: dados,
        success: function(response) { 
            if (response.success) {
                
                //Recarregar lista
                $('#listaTopicoGrupoTrabalho').empty();
                ListaTopicoGrupoTrabalho();
                
            } else {
                alert(response.mensagem);
            }
        },
        error: function() { alert('Ops, algo errado.'); }
    });
} 


function salvarComentarioTopico(id, Topico_GrupoTrabalhoId){

    fecharEditorComentario(id);

    var comentario_GrupoTrabalho = {
        comentario: $('#comentarioTopico-'+id).html(),
        grupoTrabalhoId: $('#IdGrupoTrabalho').val(),
        Topico_GrupoTrabalhoId: Topico_GrupoTrabalhoId,
        Id: id
    };

    var dados =  JSON.stringify({ comentario_GrupoTrabalho : comentario_GrupoTrabalho });
      
    $.ajax({
        type: "POST",
        dataType: "JSON",
        url: '/ComentariosTopico/SalvarAlteracaoComentario',
        contentType: "application/json; charset=utf-8",
        data: dados,
        success: function(response) { 
            if (response.success) {

            } else {

                alert(response.mensagem);
            }  
        },
        error: function() { alert('Ops, algo errado.'); }
    });
}

function excluirComentarioTopico(id, topico_GrupoTrabalhoId){

    var comentarioTopico = {
        GrupoTrabalhoId: $('#IdGrupoTrabalho').val(),
        Topico_GrupoTrabalhoId: topico_GrupoTrabalhoId,
        Id: id
    };

    var dados =  JSON.stringify({  comentarioTopico });
      
    $.ajax({
        type: "POST",
        dataType: "JSON",
        url: '/ComentariosTopico/ExcluirComentarioTopico',
        contentType: "application/json; charset=utf-8",
        data: dados,
        success: function(response) { 
            if (response.success) {
                $('#listaTopicoGrupoTrabalho').empty();
                ListaTopicoGrupoTrabalho();
            } else {

                alert(response.mensagem);
            }  
        },
        error: function() { alert('Ops, algo errado.'); }
    });
}



