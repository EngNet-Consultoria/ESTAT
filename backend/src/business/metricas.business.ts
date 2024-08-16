import { PrismaClient } from "@prisma/client"; // Se estiver usando Prisma, ajuste conforme o ORM que você está usando

const prisma = new PrismaClient();

export const listMetricas = async () => {
  return await prisma.metricas.findMany(); // Adapte o método conforme o ORM ou driver de banco de dados que você usa
};
