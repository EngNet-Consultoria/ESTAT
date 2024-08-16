-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS ESTAT_HOTEIS;

-- Seleção do banco de dados
USE ESTAT_HOTEIS;

-- Criação da tabela
CREATE TABLE METRICAS (
    id VARCHAR(50) PRIMARY KEY, -- ID cliente
    ticket_diaria DECIMAL(10, 2),
    ticket_medio DECIMAL(10, 2),
    receita_com_taxas DECIMAL(10, 2),
    reservas INT,
    nota DECIMAL(3, 2),
    data_dia INT,
    data_mes INT,
    nome_mes VARCHAR(20),
    data_ano INT,
    tipo_reserva VARCHAR(50),
    agente VARCHAR(50),
    canais VARCHAR(255),
    criacoes INT,
    siglas_condominios VARCHAR(50),
    localidade VARCHAR(255),
    imovel VARCHAR(255)
);