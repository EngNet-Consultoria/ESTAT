import { Router } from "express";
import {
  listMetricas,
  getMetricasById,
  createMetricas,
  updateMetricas,
  deleteMetricas
} from "../business/metricas.business";
import createHttpError from "http-errors";

const router = Router();



// Atualizar a nota de várias métricas pelo ID
router.put("/", async (req, res) => {
  try {
    const metricasToUpdate = req.body; // O corpo da requisição deve ser um array de objetos com id e nota

    if (!Array.isArray(metricasToUpdate)) {
      return res.status(400).json({ message: "O corpo da requisição deve ser um array de objetos com 'id' e 'nota'." });
    }

    const updatedMetricas = [];

    for (const { id, nota } of metricasToUpdate) {
      if (!id || typeof nota !== 'number') {
        return res.status(400).json({ message: "Cada objeto deve conter 'id' e 'nota' válidos." });
      }

      const updated = await updateMetricas(id, { nota });

      if (updated) {
        updatedMetricas.push(updated);
      } else {
        return res.status(404).json({ message: `Métrica com id ${id} não encontrada.` });
      }
    }

    return res.status(200).json(updatedMetricas);

  } catch (error) {
    return res.status(500).json({ message: "Erro ao atualizar as métricas." });
  }
});

export default router;






