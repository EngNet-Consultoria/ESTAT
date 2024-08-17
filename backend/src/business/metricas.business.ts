import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const listMetricas = async () => {
  return await prisma.metricas.findMany();
};

export const getMetricasById = async (id: string) => {
  return await prisma.metricas.findUnique({
    where: { id }
  });
};

export const createMetricas = async (data: {
  id: string;
  ticket_diaria: number;
  receita_com_taxas: number;
  reservas: number;
  nota: number;
  data_dia: number;
  data_mes: number;
  nome_mes: string;
  data_ano: number;
  id_agente: string;
  nome_agente: string;
  canais: string;
  data_dia_criacao: number;
  data_mes_criacao: string;
  data_ano_criacao: number;
  siglas_condominios: string;
  estado: string;
  cidade: string;
  regiao: string;
  rua_numero: string; // Corrigido para "rua_numero" em vez de "rua / numero"
  imovel: string;
}) => {
  return await prisma.metricas.create({
    data
  });
};

export const updateMetricas = async (id: string, data: {
  ticket_diaria?: number;
  receita_com_taxas?: number;
  reservas?: number;
  nota?: number;
  data_dia?: number;
  data_mes?: number;
  nome_mes?: string;
  data_ano?: number;
  id_agente?: string;
  nome_agente?: string;
  canais?: string;
  data_dia_criacao?: number;
  data_mes_criacao?: string;
  data_ano_criacao?: number;
  siglas_condominios?: string;
  estado?: string;
  cidade?: string;
  regiao?: string;
  rua_numero?: string;
  imovel?: string;
}) => {
  return await prisma.metricas.update({
    where: { id },
    data
  });
};

export const deleteMetricas = async (id: string) => {
  try {
    await prisma.metricas.delete({
      where: { id }
    });
    return true;
  } catch (error) {
    return false; // Return false if the deletion failed (e.g., if the ID does not exist)
  }
};
