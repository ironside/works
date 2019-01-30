-- DROP TABLE Admin_GrupoTrabalho
CREATE TABLE T_Works_Admin_GrupoTrabalho
(
    [Id]                    INT NOT NULL PRIMARY KEY IDENTITY(1,1), 
    [GrupoTrabalhoID]       INT NOT NULL,
    [UsuarioID]             INT
);

GO