import { Router } from "express";
import { prisma } from "../prisma";

const router = Router();

router.post("/", async (req, res) => {
  const { action, payload } = req.body;

  if (!payload) {
    console.log("🧪 Webhook de teste recebido.");
    return res.status(200).json({ status: "ok (teste sem payload)" });
  }

  const id_stays = payload?._id;
  const id = payload?.id; 
  const acoesPermitidas = ["reservation.canceled", "reservation.deleted"];

  if (id_stays && acoesPermitidas.includes(action)) {
    console.log(`📥 Webhook recebido: action = ${action}, id_stays = ${id_stays}, localizador = ${id}`);

    try {
      const reserva = await prisma.metricas.findFirst({ where: { id_stays } });

      if (!reserva) {
        console.log(`ℹ️ Nenhuma reserva encontrada com id_stays = ${id_stays}, localizador = ${id}.`);
      } else {
        const novoStatus = action === "reservation.canceled" ? "cancelado" : "deletado";

        await prisma.metricas.update({
          where: { id: reserva.id },
          data: { status: novoStatus }
        });

        console.log(`🔄 Reserva atualizada: id_stays = ${id_stays}, localizador = ${id}, id_banco = ${reserva.id}, novo status = "${novoStatus}".`);
      }
    } catch (error) {
      console.error(`❌ Erro ao atualizar reserva: id_stays = ${id_stays}, localizador = ${id}`, error);
      return res.status(500).json({ status: "erro", mensagem: "Erro ao atualizar status da reserva" });
    }
  }

  return res.status(200).json({ status: "ok" });
});

export default router;
