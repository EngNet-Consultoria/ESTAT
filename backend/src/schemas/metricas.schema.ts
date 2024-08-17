import { z } from "zod";

// Schemas
export const MetricasSchema = z.object({
  id: z.string().max(50),                      // ID da reserva
  ticket_diaria: z.number().positive(),        // Valor da diária por imóvel
  receita_com_taxas: z.number().positive(),    // Receita total incluindo taxas
  nota: z.number().min(0).max(10),             // Nota média (avaliação), assumindo escala de 0 a 10
  data_dia: z.number().int().min(1).max(31),   // Dia da reserva (1 a 31)
  data_mes: z.number().int().min(1).max(12),   // Mês da reserva (1 a 12)
  nome_mes: z.string().max(20),                // Nome do mês
  data_ano: z.number().int().positive(),       // Ano da reserva
  id_agente: z.string().max(50),               // ID do agente
  nome_agente: z.string().max(50),             // Nome do agente
  canais: z.string().max(255),                 // Canais usados para reservas
  data_dia_criacao: z.number().int().min(1).max(31), // Dia da criação (1 a 31)
  data_mes_criacao: z.string().max(50),        // Mês da criação
  data_ano_criacao: z.number().int().positive(), // Ano da criação
  siglas_condominios: z.string().max(50),      // Siglas dos condomínios
  estado: z.string().max(255),                 // Estado
  cidade: z.string().max(255),                 // Cidade
  regiao: z.string().max(255),                 // Região
  rua_numero: z.string().max(255),             // Rua / Número
  imovel: z.string().max(255),                 // Identificação ou descrição do imóvel
});

// Types
export type Metricas = z.infer<typeof MetricasSchema>;
