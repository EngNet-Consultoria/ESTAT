// backend/test/insertMetricasTest.ts 
import { prisma } from "../prisma";

async function main() {
  const id = "DS08J"; // ID da reserva
  const payload = {
    id: "DS08J",
    _id: "68374e2d90160cc0a7f2db72", // <- id_stays
    price: {
      _f_total: 100,
      extrasDetails: {
        fees: [
          { name: "Taxa de Limpeza", _f_val: 60 },
          { name: "Enxoval", _f_val: 40 }
        ],
        _f_total: 100
      }
    },
    stats: {
      _f_totalPaid: 0
    },
    guests: 1,
    operator: {
      _id: "6321c1335f8ee3dd9f997950",
      name: "Leonardo Nogueira"
    },
    checkInDate: "2025-12-03",
    checkOutDate: "2025-12-05",
    creationDate: "2025-05-28",
    reservationUrl: "https://cta.stays.com.br/i/account-overview/6321c1335f8ee31eb599794d?reserve=DS08J"
  };

  const existente = await prisma.metricas.findUnique({ where: { id } });

  if (existente) {
    console.log("Reserva já existe");
  } else {
    const data = {
      id,
      id_stays: payload._id,
      ticket_diaria: 0, // valor não informado
      receita_com_taxas: payload.price._f_total,
      taxas: payload.price.extrasDetails._f_total,
      taxa_de_limpeza: payload.price.extrasDetails.fees.find(f => f.name === "Taxa de Limpeza")?._f_val || 0,
      taxa_enxoval: payload.price.extrasDetails.fees.find(f => f.name === "Enxoval")?._f_val || 0,
      taxa_parcelamento: 0, // não informado
      taxa_cafe: 0, // não informado
      comissao: 0, // não informado
      nota: 0, // não informado
      data_dia: new Date(payload.creationDate).getDate(),
      data_mes: new Date(payload.creationDate).getMonth() + 1,
      nome_mes: "Maio", // Pode ser gerado dinamicamente se preferir
      data_ano: new Date(payload.creationDate).getFullYear(),
      dia_chegada: payload.checkInDate,
      dia_saida: payload.checkOutDate,
      numero_noites: Math.ceil(
        (new Date(payload.checkOutDate).getTime() - new Date(payload.checkInDate).getTime()) /
          (1000 * 60 * 60 * 24)
      ),
      DDD: "61", // Valor fictício
      hospedes: payload.guests,
      id_agente: payload.operator._id,
      nome_agente: payload.operator.name,
      canais: "Stays",
      data_dia_criacao: new Date(payload.creationDate).getDate(),
      data_mes_criacao: (new Date(payload.creationDate).getMonth() + 1).toString().padStart(2, "0"),
      data_ano_criacao: new Date(payload.creationDate).getFullYear(),
      siglas_condominios: "DF1",
      estado: "DF",
      cidade: "Brasília",
      regiao: "Plano Piloto",
      rua_numero: "Rua 123", // Valor fictício
      imovel: "Apartamento 101", // Valor fictício
      status: "Reservado"
    };

    await prisma.metricas.create({ data });
    console.log("Reserva de teste criada com sucesso");
  }
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
