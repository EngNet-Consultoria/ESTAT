import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import { MetricasSchema, Metricas } from './schemas/metricas.schema';
import { number } from 'zod';
import { skipPartiallyEmittedExpressions } from 'typescript';
import { max, nextSunday } from 'date-fns';
import { NUMBER } from 'sequelize';


const prisma = new PrismaClient();
const AUTH_HEADER = 'Basic ZDE1YjBkYWM6ZTA2NjgyODY=';
const API_LISTAGEM = 'https://cta.stays.com.br/external/v1/content/listings';
const API_PROPRIETARIO = 'https://cta.stays.com.br/external/v1/content/properties';
const API_CLIENT = "https://cta.stays.com.br/external/v1/booking/clients"; 

interface FetchDataReservasParams {
  fromDate: string;
  toDate: string;
  skip: number;
  limit: number;
}

async function fetchDataReservas({ fromDate, toDate, skip, limit }: FetchDataReservasParams) {
  const API_RESERVAS = `https://cta.stays.com.br/external/v1/booking/reservations?from=${fromDate}&to=${toDate}&dateType=arrival&skip=${skip}&limit=${limit}`;
  try {
    const response = await axios.get(API_RESERVAS, {
      headers: {
        accept: 'application/json',
        Authorization: AUTH_HEADER,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar dados da API de reservas:', error);
    throw error;
  }
}

interface FetchDataUsingListingIdParams {
  idListing: string;
}

async function fetchDataUsingListingId({ idListing }: FetchDataUsingListingIdParams) {
  try {
    const response = await axios.get(`${API_LISTAGEM}/${idListing}`, {
      headers: {
        accept: 'application/json',
        Authorization: AUTH_HEADER,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar dados da API de listagem:', error);
    throw error;
  }
}

interface FetchDataUsingPropriedadeIdParams {
  idPropriedade: string;
}

async function fetchDataUsingPropriedadeId({ idPropriedade }: FetchDataUsingPropriedadeIdParams) {
  try {
    const response = await axios.get(`${API_PROPRIETARIO}/${idPropriedade}`, {
      headers: {
        accept: 'application/json',
        Authorization: AUTH_HEADER,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar dados da API do proprietário:', error);
    throw error;
  }
}

function calcularDiasEntreDatas(data1: string, data2: string): number {
  const dataInicial = new Date(data1);
  const dataFinal = new Date(data2);

  if (isNaN(dataInicial.getTime()) || isNaN(dataFinal.getTime())) {
    console.error('Uma das datas fornecidas é inválida.');
    return 0;
  }

  const diffTime = Math.abs(dataFinal.getTime() - dataInicial.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

interface FetchDataUsingClientParams {
  id_client: string;
}

async function fetchDataUsingClientID({ id_client }: FetchDataUsingClientParams) {
  try {
    const response = await axios.get(`${API_CLIENT}/${id_client}`, {
      headers: {
        accept: 'application/json',
        Authorization: AUTH_HEADER,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar dados do cliente com ID ${id_client}:`, error.response?.data || error.message);
    throw error; // Lança o erro para ser tratado onde a função é chamada
  }
}


interface ProcessReservationDataParams {
  reserva: any;
  listagemData: any;
  propriedadeData: any;
  clienteData: any; 
}

function processReservationData({ reserva, listagemData, propriedadeData, clienteData}: ProcessReservationDataParams) {
  if (!reserva || !listagemData || !propriedadeData) {
    console.error('Dados da reserva, listagem ou propriedade estão indefinidos.');
    return;
  }

  const diasEntreDatas = calcularDiasEntreDatas(reserva.checkInDate, reserva.checkOutDate);
  const total = reserva.price?._f_total;
  const ticketDiario = diasEntreDatas > 0 ? Math.floor(total / diasEntreDatas) : 0;

  const espected = reserva.price?._f_expected || 0; 
  const taxas = Math.floor(total - espected); 

  var rua_numero = ''; 

if (propriedadeData.address && propriedadeData.address.street) {
  rua_numero = propriedadeData.address.street; // Inicia com o nome da rua

  // Verifica se o número da rua está presente e é válido
  if (propriedadeData.address.streetNumber && propriedadeData.address.streetNumber !== '') {
    rua_numero += `, ${propriedadeData.address.streetNumber}`; // Concatena com o número da rua
  }
}




  const processedData: Metricas = {
    id: reserva.id || '',
    ticket_diaria: ticketDiario || 0,
    receita_com_taxas: reserva.price?._f_total,
    taxas: taxas, 
    comissao: reserva.partner?.commission?._mcval?.BRL||0,
    nota: -1,
    data_dia: reserva.checkInDate ? new Date(reserva.checkInDate).getDate() : 0,
    data_mes: reserva.checkInDate ? new Date(reserva.checkInDate).getMonth() + 1 : 0,
    nome_mes: reserva.checkInDate ? new Date(reserva.checkInDate).toLocaleString('default', { month: 'long' }) : '',
    data_ano: reserva.checkInDate ? new Date(reserva.checkInDate).getFullYear() : 0,
    dia_chegada:reserva.checkInDate, 
    dia_saida:reserva.checkOutDate, 
    numero_noites: diasEntreDatas, 
    DDD: clienteData.phones? clienteData.phones[0].iso.replace('+', '') : '',
    hospedes:reserva.guests, 
    id_agente: reserva.agent?._id || '',
    nome_agente: reserva.agent?.name || '',
    canais: reserva.partner?.name || '',
    data_dia_criacao: reserva.creationDate ? new Date(reserva.creationDate).getDate() : 0,
    data_mes_criacao: reserva.creationDate ? (new Date(reserva.creationDate).getMonth() + 1).toString() : '',
    data_ano_criacao: reserva.creationDate ? new Date(reserva.creationDate).getFullYear() : 0,
    siglas_condominios: propriedadeData.internalName || '',
    estado: propriedadeData.address.state || '',
    cidade: propriedadeData.address.city || '',
    regiao: propriedadeData.address.region || '',
    rua_numero: rua_numero || '',
    imovel: propriedadeData._mstitle?.pt_BR || '',
  };

  try {
    MetricasSchema.parse(processedData);
  } catch (validationError) {
    console.error('Erro na validação dos dados:', validationError);
    return;
  }

  storeDataInDatabase({ data: processedData });
}

async function storeDataInDatabase({ data }: { data: Metricas }) {
  try {
    await prisma.metricas.upsert({
      where: { id: data.id },
      update: data,
      create: data,
    });
  } catch (error) {
    console.error('Erro ao armazenar dados no banco de dados:', error);
    throw error;
  }
}

async function fetchAndProcessData() {
  try {
    let skip = 0;
    const limit = 100;
    const maxItems = -1;
    let processedItems = 0;

    const today = new Date().toISOString().split('T')[0] || '';
    const date = new Date(today);
    date.setFullYear(date.getFullYear() + 1); // Adiciona um ano à data
    const nextYearDate = date.toISOString().split('T')[0] || ''; // Data formatada YYYY-MM-DD

    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1); // Data de ontem
    const yesterday = yesterdayDate.toISOString().split('T')[0] || '';

    // Loop até que todos os dados tenham sido processados ou o limite seja atingido
    while (processedItems > maxItems) {
      console.log(`Buscando dados de reservas de ${yesterday} até ${today} com skip ${skip} e limit ${limit}`);

      const reservasData = await fetchDataReservas({
        fromDate: "2017-01-01",
        toDate: nextYearDate,
        skip,
        limit,
      });

      // Verifica se há dados para processar
      if (reservasData.length === 0) {
        console.log('Nenhum dado de reservas encontrado ou todos os dados foram processados. Finalizando.');
        break;
      }

      // Processa as reservas
      const listagemPromises = reservasData.map(async (reserva: any) => {
        try {
          const idListing = reserva._idlisting;
          if (!idListing) return null;

          const idClient = reserva._idclient; 
          if (!idClient) return null;

          console.log(`Buscando dados do cliente ${idClient}`);
          const clienteData = await fetchDataUsingClientID({ id_client: idClient });

          console.log(`Buscando dados da listagem para idListing ${idListing}`);
          const listagemData = await fetchDataUsingListingId({ idListing });

          if (listagemData._idproperty) {
            console.log(`Buscando dados da propriedade ${listagemData._idproperty}`);
            const propriedadeData = await fetchDataUsingPropriedadeId({ idPropriedade: listagemData._idproperty });

            // Processa os dados da reserva, listagem e propriedade
            processReservationData({ reserva, listagemData, propriedadeData, clienteData});
          }

          return listagemData;
        } catch (error) {
          console.error('Erro ao processar reserva:', error);
          return null;
        }
      });

      await Promise.all(listagemPromises);

      processedItems += reservasData.length; // Incrementa o número de itens processados
      skip += limit; // Atualiza o skip para a próxima iteração
    }

    console.log('Processamento finalizado.');
  } catch (error) {
    console.error('Erro durante o processamento de dados:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fetchAndProcessData().catch((error) => {
  console.error('Erro não tratado na execução da função principal:', error);
  
})


/*setInterval(() => {
  console.log('Executando fetchAndProcessData no intervalo de 1 minutos...');
  fetchAndProcessData().catch((error) => {
    console.error('Erro não tratado na execução da função principal:', error);
  });
}, 60000);*/