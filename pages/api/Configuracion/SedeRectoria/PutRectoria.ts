import type { NextApiRequest, NextApiResponse } from "next";
import connectionPool from "../../../../config/db";

type ErrorData = {
  body: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ErrorData>
) {
  if (req.method !== "PUT") {
    res.status(405).json({ body: "Method Not Allowed" });
    return;
  }
  try {
    const { NombreRectoria, Rectoria } = req.body;

    const [UpdateRectoria]: any = await connectionPool.query(`
      UPDATE rectorias SET nombre = '${NombreRectoria?.toUpperCase()}' WHERE id = '${Rectoria}'`);

    if (UpdateRectoria?.affectedRows === 0) {
      res.status(400).json({ body: "No se pudo actualizar la rectoria" });
      return;
    }

    res.status(200).json({ body: "Rectoría actualizada con éxito" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
