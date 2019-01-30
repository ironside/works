-- DROP TABLE Participante_GrupoTrabalho
CREATE TABLE T_Works_Participante_GrupoTrabalho
(
    [Id]                    INT NOT NULL PRIMARY KEY IDENTITY(1,1), 
    [GrupoTrabalhoID]       INT NOT NULL,
    [UsuarioID]             INT
);

GO