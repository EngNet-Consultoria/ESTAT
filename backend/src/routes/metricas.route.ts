import { Router } from "express";
import { listMetricas } from "../business/metricas.business";
import createHttpError from "http-errors";

const router = Router();

router.get("/", async (req, res) => {
  // Validate input (if any validation is needed)

  try {
    // Execute business logic
    const metricas = await listMetricas();

    // Send response
    return res.status(200).json(metricas);
  } catch (error) {
    // Handle error
    return res.status(500).json({ message: "Erro ao listar métricas" });
  }
});

export default router;
