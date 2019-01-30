-- DROP TABLE OfertasWork
CREATE TABLE T_Works_OfertasWork
(
    [Id]                        INT NOT NULL PRIMARY KEY IDENTITY(1,1), 
    [IdAreaProfissional]        INT NOT NULL,
    [UsuarioId]                 INT NOT NULL,
    [TituloOferta]              VARCHAR(100) NOT NULL,
    [DescricaoOferta]           VARCHAR(500) NOT NULL,
    [DataCriacao]               [DATETIME] NOT NULL
);

GO