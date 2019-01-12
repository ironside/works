$('.salvartopico').hide();

$(".topico").click(function(event) {
    event.preventDefault();
});

 $(".respondertopico").click(function(event) {
    event.preventDefault();
});



function abrirEditorTopico(id) {

    $('.editarTopico-'+id).hide();
    $('.salvarTopico-'+id).show();
    

    if (!$('#topico-grupo-'+id).data('froala.editor')) {

        $("#topico-grupo-"+id).froalaEditor({
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
        $('#topico-grupo-'+id).on('froalaEditor.image.removed', function (e, editor, $img) {
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



function abrirEditorResponderTopico(id) {
    if (!$('#responderTopico-'+id).data('froala.editor')) {

        $("#responderTopico-"+id).froalaEditor({
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
        $('#responderTopico-'+id).on('froalaEditor.image.removed', function (e, editor, $img) {
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


function fecharEditor(id) {
    $('.editarTopico-'+id).show();
    $('.salvarTopico-'+id).hide();
    
    if ($("div#topico-grupo-"+id).data('froala.editor')) {
      $("div#topico-grupo-"+id).froalaEditor('destroy');
    }
}


function salvarNovoTopico() {

    var Topico_GrupoTrabalho = {
        ComentarioTopico: $('#topicoGrupo').val(),
        grupoTrabalhoId: $('#IdGrupoTrabalho').val(),
        TituloTopico: $('#tituloTopico').val()
    };

    var dados =  JSON.stringify({ Topico_GrupoTrabalho : Topico_GrupoTrabalho });
      
    $.ajax({
        type: "POST",
        dataType: "JSON",
        url: '/Topico/SalvarNovoTopico',
        contentType: "application/json; charset=utf-8",
        data: dados,
        success: function(response) { 
            if (response.success) {
                //Limpar Campos
                $('#topicoGrupo').froalaEditor('html.set', '');
                $('#tituloTopico').val("");
                $('#topicoGrupo').val("");
                $('#listaTopicoGrupoTrabalho').empty();
                $("#collapseTopicoGrupo").collapse('hide');
                //Recarregar lista
                ListaTopicoGrupoTrabalho();
            } else {
                alert(response.mensagem);
            }
        },
        error: function() { alert('Ops, algo errado.'); }
    });
}


function salvarAlteracaoTopico(id){

    fecharEditor(id);

    var topico_GrupoTrabalho = {
        ComentarioTopico: $('#topico-grupo-'+id).html(),
        GrupoTrabalhoId: $('#IdGrupoTrabalho').val(),
        Id: id
    };

    var dados =  JSON.stringify({ Topico_GrupoTrabalho : topico_GrupoTrabalho });
      
    $.ajax({
        type: "POST",
        dataType: "JSON",
        url: '/Topico/SalvarAlteracaoTopico',
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

function excluirTopico(id){

    var topico_GrupoTrabalho = {
        GrupoTrabalhoId: $('#IdGrupoTrabalho').val(),
        Id: id
    };

    var dados =  JSON.stringify({ Topico_GrupoTrabalho : topico_GrupoTrabalho });
      
    $.ajax({
        type: "POST",
        dataType: "JSON",
        url: '/Topico/ExcluirTopico',
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
        error: function() { alert('AOps, algo errado.'); }
    });
}



