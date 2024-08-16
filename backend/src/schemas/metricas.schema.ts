import { z } from "zod";

// Schemas
export const MetricasSchema = z.object({
  id: z.string().max(50),                      // ID do cliente, definido como string
  ticket_diaria: z.number().positive(),        // Valor da diária por imóvel
  ticket_medio: z.number().positive(),         // Ticket médio
  receita_com_taxas: z.number().positive(),    // Receita total incluindo taxas
  reservas: z.number().int().nonnegative(),    // Total de reservas
  nota: z.number().min(0).max(10),             // Nota média (avaliação), assumindo escala de 0 a 10
  data_dia: z.number().int().min(1).max(31),   // Dia da reserva (1 a 31)
  data_mes: z.number().int().min(1).max(12),   // Mês da reserva (1 a 12)
  nome_mes: z.string().max(20),                // Nome do mês
  data_ano: z.number().int().positive(),       // Ano da reserva
  tipo_reserva: z.string().max(50),            // Tipo de reserva (direta, por agente, etc.)
  agente: z.string().max(50),                  // Nome ou identificador do agente da reserva
  canais: z.string().max(255),                 // Canais usados para reservas
  criacoes: z.number().int().nonnegative(),    // Número de criações
  data_dia_criacao: z.number().int().max(31), 
  
  siglas_condominios: z.string().max(50),      // Siglas dos condomínios
  localidade: z.string().max(255),             // Localidade da reserva ou imóvel
  imovel: z.string().max(255),                 // Identificação ou descrição do imóvel
});

// Types
export type Metricas = z.infer<typeof MetricasSchema>;
