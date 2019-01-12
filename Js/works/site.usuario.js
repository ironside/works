$(function () {
    ListaAdministradores();
    ListaParticipantes();
});

function ListaParticipantes() {

    var usuario = $("#UsuarioId").val();

    var dados =  JSON.stringify({ usuario : usuario });

    $.ajax({
        type: "POST",
        url: '/Usuario/Participantes_Work',
        contentType: "application/json; charset=utf-8",
        data: dados,
        dataType: "HTML",
        success: function(recData) { 
            $('#listaParticipantes').append(recData);
        },
        error: function() { alert('Ops, algo errado.'); }
    });
}

function ListaParticipantesConsulta() {

    var dados =  JSON.stringify({ grupoTrabalhoId : $('#IdGrupoTrabalho').val() });

    $.ajax({
        type: "POST",
        url: '/Usuario/Participantes_WorkConsulta',
        contentType: "application/json; charset=utf-8",
        data: dados,
        dataType: "HTML",
        success: function(recData) { 
            $('#listaParticipantesConsulta').append(recData);
        },
        error: function() { alert('Ops, algo errado.'); }
    });
}

function ListaAdministradores() {

    var usuario = $("#UsuarioId").val();

    var dados =  JSON.stringify({ usuario : usuario });

    $.ajax({
        type: "POST",
        url: '/Usuario/Admin_Work',
        contentType: "application/json; charset=utf-8",
        data: dados,
        dataType: "HTML",
        success: function(recData) { 
            $('#listaAdministradores').append(recData);
        },
        error: function() { alert('Ops, algo errado.'); }
    });
}

function ListaAdministradoresConsulta() {

    var dados =  JSON.stringify({ grupoTrabalhoId : $('#IdGrupoTrabalho').val() });

    $.ajax({
        type: "POST",
        url: '/Usuario/Admin_WorkConsulta',
        contentType: "application/json; charset=utf-8",
        data: dados,
        dataType: "HTML",
        success: function(recData) { 
            $('#listaAdministradoresConsulta').append(recData);
        },
        error: function() { alert('Ops, algo errado.'); }
    });
}



