-- DROP TABLE ServicosOferecidosWork
CREATE TABLE T_Works_ServicosOferecidosWork
(
    [Id]                        INT NOT NULL PRIMARY KEY IDENTITY(1,1), 
    [IdAreaProfissional]        INT NOT NULL,
    [UsuarioId]                 INT NOT NULL,
    [TituloServico]             VARCHAR(100) NOT NULL,
    [DescricaoServico]          VARCHAR(500) NOT NULL,
    [DataCriacao]               [DATETIME] NOT NULL
);

GO