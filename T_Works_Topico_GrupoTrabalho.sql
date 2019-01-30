-- DROP TABLE Topico_GrupoTrabalho
CREATE TABLE T_Works_Topico_GrupoTrabalho
(
    [Id]                    INT NOT NULL PRIMARY KEY IDENTITY(1,1), 
    [GrupoTrabalhoID]       INT NOT NULL,
    [UsuarioID]             INT NOT NULL,
    [TituloTopico]          VARCHAR(100) NOT NULL,
    [ComentarioTopico]      VARCHAR(5000) NOT NULL,
    [DataComentarioTopico]  DATETIME NOT NULL
);

GO