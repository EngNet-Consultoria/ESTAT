import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import { MetricasSchema, Metricas } from './schemas/metricas.schema'; // Ajuste o caminho conforme necessário

const prisma = new PrismaClient();

const AUTH_HEADER = 'Basic ZDE1YjBkYWM6ZTA2NjgyODY='; // Header de autenticação básica
const API_LISTAGEM = 'https://cta.stays.com.br/external/v1/content/listings'; // URL da API de listagem

// Tipos para parâmetros
interface FetchDataReservasParams {
  fromDate: string;
  toDate: string;
  skip: number;
  limit: number;
}

// Função para buscar dados da API de reservas
async function fetchDataReservas({ fromDate, toDate, skip, limit }: FetchDataReservasParams) {
  const API_RESERVAS = `https://cta.stays.com.br/external/v1/booking/reservations?from=${fromDate}&to=${toDate}&dateType=arrival&skip=${skip}&limit=${limit}`;
  try {
    const response = await axios.get(API_RESERVAS, {
      headers: {
        'accept': 'application/json',
        'Authorization': AUTH_HEADER,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar dados da API de reservas:', error);
    throw error;
  }
}

// Tipos para o parâmetro da função
interface FetchDataUsingListingIdParams {
  idListing: string;
}

// Corrigido: Adicionado tipo string para os parâmetros
function calcularDiasEntreDatas(data1: string, data2: string): number {
    const dataInicial = new Date(data1);
    const dataFinal = new Date(data2);
  
    if (isNaN(dataInicial.getTime()) || isNaN(dataFinal.getTime())) {
      console.error('Uma das datas fornecidas é inválida.');
      return 0; // Retorna 0 para evitar divisão por zero
    }
  
    const diferencaEmMilissegundos = dataFinal.getTime() - dataInicial.getTime();
  
    if (diferencaEmMilissegundos <= 0) {
      console.error('A data final é anterior ou igual à data inicial.');
      return 0; // Retorna 0 para evitar divisão por zero
    }
  
    const umDiaEmMilissegundos = 1000 * 60 * 60 * 24;
    const diferencaEmDias = Math.floor(diferencaEmMilissegundos / umDiaEmMilissegundos);
  
    return diferencaEmDias;
}

// Função para buscar dados da API de listagem usando o id_listing
async function fetchDataUsingListingId({ idListing }: FetchDataUsingListingIdParams) {
  try {
    const response = await axios.get(`${API_LISTAGEM}/${idListing}`, {
      headers: {
        'accept': 'application/json',
        'Authorization': AUTH_HEADER,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar dados da API de listagem:', error);
    throw error;
  }
}

// Tipos para os parâmetros da função
interface ProcessReservationDataParams {
  reserva: any; // Defina o tipo correto se disponível
  listagemData: any; // Defina o tipo correto se disponível
}

// Função para processar dados da reserva
function processReservationData({ reserva, listagemData }: ProcessReservationDataParams) {
    if (!reserva || !listagemData) {
      console.error('Dados da reserva ou da listagem estão indefinidos.');
      return;
    }
  
    const diasEntreDatas = calcularDiasEntreDatas(reserva.checkInDate, reserva.checkOutDate);
    console.log(`Dias entre datas: ${diasEntreDatas}`); // Log de depuração
  
    const total = reserva.price._f_total;
    console.log(`Total da reserva: ${total}`); // Log de depuração
  
    const ticketDiario = diasEntreDatas > 0 ? Math.floor(total / diasEntreDatas) : 0;
    console.log(`Ticket diário calculado: ${ticketDiario}`); // Log de depuração
  
    const processedData: Metricas = {
      id: reserva.id || '', // ID da reserva
      ticket_diaria: ticketDiario || 0, // Ticket diário
      receita_com_taxas: reserva.price?._f_total || 0, // Receita com taxas
      nota: 0, // Nota (total pago)
      data_dia: reserva.checkInDate ? new Date(reserva.checkInDate).getDate() : 0, // Dia de check-in
      data_mes: reserva.checkInDate ? new Date(reserva.checkInDate).getMonth() + 1 : 0, // Mês de check-in
      nome_mes: reserva.checkInDate ? new Date(reserva.checkInDate).toLocaleString('default', { month: 'long' }) : '', // Nome do mês
      data_ano: reserva.checkInDate ? new Date(reserva.checkInDate).getFullYear() : 0, // Ano de check-in
      id_agente: reserva.agent?._id || '', // ID do agente
      nome_agente: reserva.agent?.name || '', // Nome do agente
      canais: reserva.partner?.name || '', // Canais (nome do parceiro)
      data_dia_criacao: reserva.creationDate ? new Date(reserva.creationDate).getDate() : 0, // Dia de criação
      data_mes_criacao: reserva.creationDate ? (new Date(reserva.creationDate).getMonth() + 1).toString() : '', // Mês de criação (como string)
      data_ano_criacao: reserva.creationDate ? new Date(reserva.creationDate).getFullYear() : 0, // Ano de criação (como string)
      siglas_condominios: listagemData.siglas_condominios || '', // Siglas dos condomínios (ajustar conforme necessário)
      estado: listagemData.estado || '', // Estado
      cidade: listagemData.cidade || '', // Cidade
      regiao: listagemData.regiao || '', // Região
      rua_numero: listagemData.rua_numero || '', // Rua e número
      imovel: listagemData.imovel || '', // Imóvel
    };
  
    try {
      MetricasSchema.parse(processedData);
    } catch (validationError) {
      console.error('Erro na validação dos dados:', validationError);
      return; // Interrompe o processamento se os dados não forem válidos
    }
  
    storeDataInDatabase({ data: processedData });
  }
  
// Tipos para o parâmetro da função
interface StoreDataInDatabaseParams {
  data: Metricas; // Ajustado para usar o tipo correto
}

// Função para armazenar dados no banco de dados
async function storeDataInDatabase({ data }: StoreDataInDatabaseParams) {
  try {
    await prisma.metricas.upsert({
      where: { id: data.id }, // Assume que 'id' é a chave primária
      update: data, // Atualize com os novos dados se já existir
      create: data, // Crie um novo registro se não existir
    });
  } catch (error) {
    console.error('Erro ao armazenar dados no banco de dados:', error);
    throw error;
  }
}

// Função principal para buscar e processar dados
async function fetchAndProcessData() {
  try {
    let skip = 0;
    const limit = 100; // Número máximo de registros por chamada
    const maxItems = 200; // Número máximo de itens para teste
    let processedItems = 0; // Contador de itens processados

    while (processedItems < maxItems) {
      const today: string = (new Date().toISOString().split('T')[0] || '') as string;

      console.log(`Buscando dados de reservas de ${today} com skip ${skip} e limit ${limit}`);

      const reservasData = await fetchDataReservas({
        fromDate: '2020-02-29',
        toDate: today, // `today` é garantidamente uma string
        skip,
        limit,
      });

      if (reservasData.length === 0) {
        console.log('Nenhum dado de reservas encontrado. Finalizando.');
        break; // Sai do loop se não houver mais dados
      }

      for (const reserva of reservasData) {
        const idListing = reserva._idlisting;

        if (idListing) {
          console.log(`Buscando dados da listagem para idListing ${idListing}`);
          
          const listagemData = await fetchDataUsingListingId({ idListing });
          console.log(`Processando reserva ${reserva.id}`);

          try {
            processReservationData({ reserva, listagemData });
          } catch (processingError) {
            console.error(`Erro ao processar dados da reserva ${reserva.id}:`, processingError);
          }

          processedItems++;
          if (processedItems >= maxItems) {
            break;
          }
        } else {
          console.warn(`id_listing não encontrado para a reserva com id: ${reserva.id}`);
        }
      }

      skip += limit; // Atualiza o offset para a próxima página
    }

  } catch (error) {
    console.error('Erro ao processar dados:', error);
  } finally {
    await prisma.$disconnect(); // Desconectar do Prisma Client
  }
}

// Executa a função principal
fetchAndProcessData().catch(error => {
  console.error('Erro na execução da função principal:', error);
});
