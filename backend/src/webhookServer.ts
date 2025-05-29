// backend/src/webhookServer.ts
import express from "express";
import { prisma } from "./prisma";

const app = express();
app.use(express.json());

app.post("/webhook", async (req, res) => {
  const { action, payload, _dt } = req.body;

  // 1. Valida se há um payload
  if (!payload) {
    console.warn("⚠️ Webhook recebido sem payload.");
    return res.status(400).json({ error: "Payload ausente." });
  }

  const id_stays = payload?._id;

  // 2. Se houver id_stays e ação for de cancelamento ou exclusão
  const acoesPermitidas = ["reservation.canceled", "reservation.deleted"];
  if (id_stays && acoesPermitidas.includes(action)) {
    try {
      const reserva = await prisma.metricas.findFirst({
        where: { id_stays }
      });

      if (!reserva) {
        console.log(`ℹ️ Nenhuma reserva com id_stays = ${id_stays} encontrada.`);
      } else {
        const novoStatus = action === "reservation.canceled" ? "cancelado" : "deletado";

        await prisma.metricas.update({
          where: { id: reserva.id },
          data: { status: novoStatus }
        });

        console.log(`🔄 Reserva ${reserva.id} atualizada para status "${novoStatus}".`);
      }
    } catch (error) {
      console.error("❌ Erro ao atualizar status da reserva:", error);
    }
  }

  // 3. Retorna sucesso, mesmo se não encontrou reserva
  return res.status(200).json({ status: "ok" });
});

const PORT = process.env.WEBHOOK_PORT || 3002;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
