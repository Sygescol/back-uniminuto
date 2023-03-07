import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../../config/db";

type ErrorData = {
  body: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ErrorData>
) {
  if (req.method !== "DELETE") {
    res.status(405).json({ body: "Method Not Allowed" });
    return;
  }
  try {
    const { id } = req.body;
    const [DeleteCompetencias]: any = await connectionPool.query(`
    DELETE FROM pfc_ejes WHERE eje_id = ${id}
    `);
    if (DeleteCompetencias.affectedRows === 0) {
      res.status(400).json({ body: "No se pudo eliminar la competencia" });
      return;
    }

    res.status(200).json({ body: "Se elimino correctamente" });
  } catch (error) {
    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
