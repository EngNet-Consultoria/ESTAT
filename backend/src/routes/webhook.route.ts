// backend/src/routes/webhook.route.ts
import { Router } from "express";
import { prisma } from "../prisma";

const router = Router();

router.post("/", async (req, res) => {
  const { action, payload, _dt } = req.body;

  if (!payload) {
    console.warn("⚠️ Webhook recebido sem payload.");
    return res.status(400).json({ error: "Payload ausente." });
  }

  const id_stays = payload?._id;
  const acoesPermitidas = ["reservation.canceled", "reservation.deleted"];

  if (id_stays && acoesPermitidas.includes(action)) {
    try {
      const reserva = await prisma.metricas.findFirst({ where: { id_stays } });

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

  return res.status(200).json({ status: "ok" });
});

export default router;


