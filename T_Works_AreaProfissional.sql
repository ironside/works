-- DROP TABLE AreaProfissionalWork
CREATE TABLE T_Works_AreaProfissionalWork
(
    [Id]                        INT NOT NULL PRIMARY KEY IDENTITY(1,1), 
    [NomeAreaProfissional]      VARCHAR(80) NOT NULL,
    [OutraAreaProfissional]     VARCHAR(100),
    [Ativo]                     SMALLINT NOT NULL
);

GO

INSERT INTO T_Works_AreaProfissionalWork
(NomeAreaProfissional, Ativo)
VALUES
('Comercial, Vendas', 1);

INSERT INTO T_Works_AreaProfissionalWork
(NomeAreaProfissional, Ativo)
VALUES
('Informática, TI, Telecomunicações', 1);

INSERT INTO T_Works_AreaProfissionalWork
(NomeAreaProfissional, Ativo)
VALUES
('Construção, Manutenção', 1);

INSERT INTO T_Works_AreaProfissionalWork
(NomeAreaProfissional, Ativo)
VALUES
('Artes', 1);

INSERT INTO T_Works_AreaProfissionalWork
(NomeAreaProfissional, Ativo)
VALUES
('Qualidade', 1);

INSERT INTO T_Works_AreaProfissionalWork
(NomeAreaProfissional, Ativo)
VALUES
('Transportes', 1);

INSERT INTO T_Works_AreaProfissionalWork
(NomeAreaProfissional, Ativo)
VALUES
('Compras ', 1);

INSERT INTO T_Works_AreaProfissionalWork
(NomeAreaProfissional, Ativo)
VALUES
('Marketing', 1);

INSERT INTO T_Works_AreaProfissionalWork
(NomeAreaProfissional, Ativo)
VALUES
('Saúde', 1);

INSERT INTO T_Works_AreaProfissionalWork
(NomeAreaProfissional, Ativo)
VALUES
('Industrial, Produção, Fábrica', 1);

INSERT INTO T_Works_AreaProfissionalWork
(NomeAreaProfissional, Ativo)
VALUES
('Moda', 1);

INSERT INTO T_Works_AreaProfissionalWork
(NomeAreaProfissional, Ativo)
VALUES
('Administração', 1);

INSERT INTO T_Works_AreaProfissionalWork
(NomeAreaProfissional, Ativo)
VALUES
('Contábil, Finanças, Economia', 1);

INSERT INTO T_Works_AreaProfissionalWork
(NomeAreaProfissional, Ativo)
VALUES
('Logística', 1);

INSERT INTO T_Works_AreaProfissionalWork
(NomeAreaProfissional, Ativo)
VALUES
('Arquitetura, Decoração, Design', 1);

INSERT INTO T_Works_AreaProfissionalWork
(NomeAreaProfissional, Ativo)
VALUES
('Engenharia', 1);

INSERT INTO T_Works_AreaProfissionalWork
(NomeAreaProfissional, Ativo)
VALUES
('Química, Petroquímica', 1);

