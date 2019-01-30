-- DROP TABLE GruposTrabalho
CREATE TABLE T_Works_GruposTrabalho
(
    [Id]                    INT NOT NULL PRIMARY KEY IDENTITY(1,1), 
    [Titulo]                VARCHAR(100) NOT NULL,
    [Descricao]             VARCHAR(5000) NOT NULL,
    [UsuarioId]             INT NOT NULL,
    [Status]                SMALLINT NOT NULL DEFAULT (0), -- 0 -ANDAMENTO / 1-CONCLUIDO
    [DataCriacao]           [DATETIME] NOT NULL,
    [Permissao]            SMALLINT NOT NULL DEFAULT (0) --ABERTO / 1 - FECHADO
);

GO
