-- DROP TABLE ComentarioTopico_GrupoTrabalho
CREATE TABLE T_Works_ComentarioTopico_GrupoTrabalho
(
    [Id]                        INT NOT NULL PRIMARY KEY IDENTITY(1,1), 
    [GrupoTrabalhoID]           INT NOT NULL,
    [Topico_GrupoTrabalhoID]    INT NOT NULL,
    [UsuarioID]                 INT NOT NULL,
    [Comentario]                VARCHAR(5000) NOT NULL,
    [DataComentario]            DATETIME NOT NULL
);

GO