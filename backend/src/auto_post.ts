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
  // Transforme os dados da reserva e da listagem conforme necessário
  const processedData: Metricas = {
    id: reserva.id, // ID da reserva
    ticket_diaria: reserva.price._f_expected, // Ticket diário
    receita_com_taxas: reserva.price._f_total, // Receita com taxas
    nota: 0 , // Nota (total pago)
    data_dia: new Date(reserva.checkInDate).getDate(), // Dia de check-in
    data_mes: new Date(reserva.checkInDate).getMonth() + 1, // Mês de check-in
    nome_mes: new Date(reserva.checkInDate).toLocaleString('default', { month: 'long' }), // Nome do mês
    data_ano: new Date(reserva.checkInDate).getFullYear(), // Ano de check-in
    id_agente: reserva.agent._id, // ID do agente
    nome_agente: reserva.agent.name, // Nome do agente
    canais: reserva.partner.name, // Canais (nome do parceiro)
    data_dia_criacao: new Date(reserva.creationDate).getDate(), // Dia de criação
    data_mes_criacao: (new Date(reserva.creationDate).getMonth() + 1).toString(), // Mês de criação (como string)
    data_ano_criacao: new Date(reserva.creationDate).getFullYear(), // Ano de criação (como string)
    siglas_condominios: listagemData.siglas_condominios || '', // Siglas dos condomínios (ajustar conforme necessário)
    estado: listagemData.estado || '', // Estado
    cidade: listagemData.cidade || '', // Cidade
    regiao: listagemData.regiao || '', // Região
    rua_numero: listagemData.rua_numero || '', // Rua e número
    imovel: listagemData.imovel || '', // Imóvel
  };

  // Valida os dados usando o esquema zod
  try {
    MetricasSchema.parse(processedData);
  } catch (validationError) {
    console.error('Erro na validação dos dados:', validationError);
    return; // Interrompe o processamento se os dados não forem válidos
  }

  // Armazena os dados no banco de dados
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

      // Buscar dados da API de reservas
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
          
          // Buscar dados da API de listagem
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
