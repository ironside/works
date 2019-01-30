-- DROP TABLE MensagemWork
CREATE TABLE T_Works_MensagemWork
(
    [Id]                        INT NOT NULL PRIMARY KEY IDENTITY(1,1), 
    [UsuarioId]                 INT NOT NULL,
    [UsuarioRemetenteId]        INT NOT NULL,
    [DescricaoMensagemWork]     VARCHAR(500) NOT NULL,
    [DataMensagem]              [DATETIME] NOT NULL,
    [MensagemLida]              INT NOT NULL DEFAULT 0,
    [MensagemLidaAdmin]         INT NOT NULL DEFAULT 0
);

GO

