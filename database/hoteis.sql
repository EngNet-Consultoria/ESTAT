-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS ESTAT_HOTEIS;

-- Seleção do banco de dados
USE ESTAT_HOTEIS;

-- Criação da tabela
CREATE TABLE METRICAS (
    id VARCHAR(50) PRIMARY KEY, --reservation
    ticket_diaria DECIMAL(10, 2), -- reservation
    receita_com_taxas DECIMAL(10, 2), --reservation
    nota DECIMAL(3, 2), --reservation
    data_dia INT, -- reservation
    data_mes INT, --reservation
    nome_mes VARCHAR(20), -- reservation
    data_ano INT, -- reservation
    id_agente VARCHAR(50), --reservation
    nome_agente VARCHAR(50),
    canais VARCHAR(255), --reservation
    data_dia_criacao int, --reservation
    data_mes_criacao varchar(50), --reservation
    data_ano_criacao int, --reservation
    siglas_condominios VARCHAR(50), --propriedades 
    estado VARCHAR(255),
    cidade varchar(255),
    regiao VARCHAR(255),
    rua / numero varchar(255),
    imovel VARCHAR(255), --propriedades ( nome interno)
);