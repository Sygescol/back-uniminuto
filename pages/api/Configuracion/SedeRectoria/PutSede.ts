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
    const { NombreSede, SedeIdRectoria, IdSede } = req.body;

    const [UpdateSede]: any = await connectionPool.query(`
    UPDATE sedes SET nombreSede = '${NombreSede}', idRectoria = '${SedeIdRectoria}' WHERE id = '${IdSede}'`);

    if (UpdateSede?.affectedRows === 0) {
      res.status(404).json({ body: "Sede no encontrada" });
      return;
    }

    res.status(200).json({ body: "Sede actualizada" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ body: "Internal server error" } as ErrorData);
  }
}
