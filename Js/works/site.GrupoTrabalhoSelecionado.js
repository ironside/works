$(function () {
    ListParticipantesGrupoTrabalho();
    ListAdminGrupoTrabalho();
    ListaAdministradoresConsulta();
    ListaParticipantesConsulta();
    ListaTopicoGrupoTrabalho();
    $('a#btn-save').hide();
});

function ListParticipantesGrupoTrabalho() {

    var dados = JSON.stringify( { Id : $('#IdGrupoTrabalho').val() } );
   
    $.ajax({
        type: "POST",
        url: '/GruposTrabalho/ListaParticipantesGrupoTrabalho',
        contentType: "application/json; charset=utf-8",
        data: dados,
        dataType: "JSON",
        success: function(response) { 
        
        var str = response.Ids;
        
        $('#participantes').val(str).change();

        },
        error: function() { alert('Ops, algo errado.'); }
    });
}

function ListAdminGrupoTrabalho() {

    var dados = JSON.stringify( { Id : $('#IdGrupoTrabalho').val() } );
   
    $.ajax({
        type: "POST",
        url: '/GruposTrabalho/ListaAdminGrupoTrabalho',
        contentType: "application/json; charset=utf-8",
        data: dados,
        dataType: "JSON",
        success: function(response) { 
        
        var str = response.Ids;
        
        $('#admin').val(str).change();
        },
        error: function() { alert('Ops, algo errado.'); }
    });
}

function SalvarAlteracoesGrupo() {

    var listaSelecionados = "";

    if ($('.lista-assinantes').select2("val") != null)
       listaSelecionados = $('.lista-assinantes').select2("val");

    var listaAdmin = $('.lista-admin').select2("val");

    var participantes = JSON.parse("[" + listaSelecionados + "]");

    var administradores = JSON.parse("[" + listaAdmin + "]");

    var grupoTrabalho = {
        Id : $('#IdGrupoTrabalho').val(),
        Participantes : participantes,
        Administradores : administradores,
        Status :  $('#workStatus').is(":checked")  ? 1 : 0,
        Permissao:  $('#workPermissao').is(":checked")  ? 1 : 0
    }; 

    var dados =  JSON.stringify({ gruposTrabalho: grupoTrabalho });
      
    $.ajax({
        type: "POST",
        dataType: "JSON",
        url: '/GruposTrabalho/SalvarAlteracoesGrupo',
        contentType: "application/json; charset=utf-8",
        data: dados,
        success: function(response) { 
            if (response.success) {
                $("#modal-configura-work").modal('toggle');
                $("#success-alert").css({ display: "block" });
                $("#success-alert").fadeTo(2000, 500).slideUp(500, function(){
                    $("#success-alert").slideUp(500);
                });  
            } else {
                alert(response.mensagem);
            }  
        },
        error: function() { alert('Ops, algo errado.'); }
    });
}

function ExcluirGrupo() {


    if (confirm("Tem certeza que deseja excluir essa work?")) {

        var listaSelecionados = $('.lista-assinantes').select2("val");

        var usuarios = JSON.parse("[" + listaSelecionados + "]");

        var grupoTrabalho = {
            Id : $('#IdGrupoTrabalho').val(),
            Usuarios : usuarios
        }; 

        var dados =  JSON.stringify({ gruposTrabalho: grupoTrabalho });
          
        $.ajax({
            type: "POST",
            dataType: "JSON",
            url: '/GruposTrabalho/ExcluirGrupo',
            contentType: "application/json; charset=utf-8",
            data: dados,
            success: function(response) {
                if (response.success) {
                    window.location.href = "/Home/Index";
                } else {
                    alert(response.mensagem);
                }  
            },
            error: function() { alert('Ops, algo errado.'); }
        });
    }
}

function ListaTopicoGrupoTrabalho() {

    var dados = JSON.stringify( { Id : $('#IdGrupoTrabalho').val() } );
    
    $.ajax({
        type: "POST",
        url: '/Topico/ListaTopicoGrupoTrabalho',
        contentType: "application/json; charset=utf-8",
        data: dados,
        dataType: "HTML",
        success: function(response) { 
            $('#listaTopicoGrupoTrabalho').append(response);
        },
        error: function() { alert('Ops, algo errado.'); }
    }); 
}


$('a#btn-init').on('click', function (e) {
    e.preventDefault();


    $('a#btn-init').hide();
    $('a#btn-save').show();
 
    if (!$('div#froala-editor').data('froala.editor')) {
      $('div#froala-editor').froalaEditor({
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
    }
});

function fecharEditorPostGrupo() {
    $('a#btn-init').show();
    $('a#btn-save').hide();
    
    if ($("div#froala-editor").data('froala.editor')) {
      $("div#froala-editor").froalaEditor('destroy');
    }
}

$('a#btn-save').on('click', function (e) {
    e.preventDefault();

    fecharEditorPostGrupo();
   
    var grupoTrabalho = {
        Descricao: $('#froala-editor').html(),
        id: $('#IdGrupoTrabalho').val()
    };
    

    var dados =  JSON.stringify({ gruposTrabalho : grupoTrabalho });
      
    $.ajax({
        type: "POST",
        dataType: "JSON",
        url: '/GruposTrabalho/SalvarAlteracaoPostagemGrupoTrabalho',
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
});